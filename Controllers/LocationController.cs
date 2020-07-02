using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using NetTopologySuite.Geometries;
using Newtonsoft.Json;
using Microsoft.EntityFrameworkCore;

namespace bookingsApp.Controllers
{

    public class LocationController : Controller
    {
        private readonly BookingContext context;
        private readonly ILogger _logger;
        public LocationController(BookingContext db, ILogger<BookingContext> logger)
        {
            context = db;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> get(int? id)
        {
            if (id == null)
            {
                //For Public Page
                var selectedLocation =
                from location in context.locations
                .Include(loc => loc.staff)
                select new
                {
                    id = location.locationId,
                    name = location.name,
                    address = location.address,
                    email = location.emailAddress,
                    phone = location.phoneNumber,
                    coordinates = new
                    {
                        lat = location.coordinates.Y,
                        lng = location.coordinates.X,
                    }
                };
                return Json(await selectedLocation.ToListAsync());
            }
            else
            {
                var selectedLocation =
                    from location in context.locations
                    .Include("bookings.user")
                    where location.locationId == id
                    select new
                    {
                        id = location.locationId,
                        name = location.name,
                        address = location.address,
                        email = location.emailAddress,
                        phone = location.phoneNumber,
                        coordinates = new
                        {
                            lat = location.coordinates.Y,
                            lng = location.coordinates.X,
                        },
                        staff = location.staff.Select(a => a.user.name).ToList(),
                    };
                return Json(await selectedLocation.ToListAsync());
            }
        }

        // TODO: Add some kind of auth check to ensure the query client is allowed to access this.
        [HttpGet]
        public IActionResult bookings(int? id) {
            try {
                if(id != null) {
                var bookingData = from booking in context.bookings
				where booking.location.locationId == id
				select new {
                    id = booking.bookingID,
                    createdOn = booking.createdOn.ToLongDateString(),
                    bookedFor = booking.bookedFor.ToLongDateString(),
                    bookedTime = booking.bookedFor.ToLocalTime().ToString("HH:mm tt"),
                    status = (booking.status == false ? "Not confirmed" : "Confirmed"),
                    revision = booking.RowVersion,
                    User = new {
                        name = booking.user.name,
                        phone = booking.user.phone
				    }
				};
                return Json(bookingData);
                } else {
                    return BadRequest();
                }
            } catch(Exception e) {
                _logger.LogError("Unable to obtain location bookings: " + e);
                return StatusCode(500);
            }
            
        }

        [HttpGet]
        [Authorize(Policy = "User")]
        public async Task<IActionResult> getUser(int? id)
        {
            _logger.LogInformation("UserLocationRoute: " + id);
            try
            {
                if (id != null)
                {
                    var locationList = from location in context.locations
                    .Include(a => a.staff)
                    .Where(a => a.staff.Any(u => u.userID == id))
                                       select new
                                       {
                                           locationID = location.locationId,
                                           name = location.name,
                                           address = location.address,
                                           emailAddress = location.emailAddress,
                                           phoneNumber = location.phoneNumber,
                                           coordinates = new
                                           {
                                               lat = location.coordinates.Y,
                                               lng = location.coordinates.X,
                                           },
                                           staff = location.staff
                                       };
                    return Json(await locationList.ToArrayAsync());
                }
                else
                {
                    throw new Exception("ID error");
                }
            }
            catch (Exception e)
            {
                _logger.LogError("Error getting user locations " + e);
                return BadRequest();
            }
        }

        [HttpPost]
        [Authorize(Policy = "User")]
        public async Task<IActionResult> add([FromBody] dynamic data)
        {
            try
            {
                dynamic a = JsonConvert.DeserializeObject(data.ToString());
                Location newLocation = new Location
                {
                    name = a.name,
                    phoneNumber = a.phoneNumber,
                    emailAddress = a.emailAddress,
                    address = a.address,
                    coordinates = new Point((double)a.lng, (double)a.lat) { SRID = 4326 },
                };
                context.locations.Add(newLocation);
                await context.SaveChangesAsync();
                return Ok(newLocation);
            }
            catch (Exception e)
            {
                _logger.LogError("Adding Location Error" + e);
                return BadRequest();
            }

        }
        [HttpPost]
        [Authorize(Policy = "User")]
        public async Task<IActionResult> edit([FromBody] dynamic data)
        {
            try
            {
                dynamic locationData = JsonConvert.DeserializeObject(data.ToString());
                Console.WriteLine(locationData);
                int locID = locationData.locationId;

                var singleLocation = from locations in context.locations
                                     where locations.locationId == locID
                                     select locations;

                Location location = singleLocation.FirstOrDefault();
                if (location != null)
                {
                    location.name = locationData.name;
                    location.address = locationData.address;
                    location.emailAddress = locationData.emailAddress;
                    location.phoneNumber = locationData.phoneNumber;
                    location.coordinates = new Point((double)locationData.lng, (double)locationData.lat) { SRID = 4326 };
                    await context.SaveChangesAsync();
                    return NoContent();
                }
                else
                {
                    throw new Exception("Failed to find location");
                }

            }
            catch (Exception e)
            {
                _logger.LogError("Editing Location Failed " + e.Message);
                return BadRequest();
            }
        }

        [HttpPost]
        [Authorize(Policy = "User")]
        public async Task<IActionResult> delete([FromBody] int id)
        {
            var selectedLocation = from location in context.locations
                                   where location.locationId == id
                                   select location;

            if (selectedLocation.Any())
            {
                Location a = selectedLocation.First();
                context.locations.Remove(a);
                await context.SaveChangesAsync();
                return NoContent();
            }
            else
            {
                _logger.LogError("Unable to find location given ID");
                return BadRequest();
            }
        }
    }
}