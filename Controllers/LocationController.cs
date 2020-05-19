using System;
using System.Linq;
using System.Collections;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Mvc.ModelBinding;

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
        public IActionResult Index()
        {
            return BadRequest();
        }

        [HttpGet]
        public IActionResult get(int? id)
        {
            if (id == null)
            {
                var selectedLocation =
                from location in context.locations
                join coordinates in context.coordinates
                on location.locationId equals coordinates.locationID
                select new
                {
                    locationData = location,
                    coordinateData = coordinates
                };
                return Json(selectedLocation.ToArray());
            }
            else
            {
                //Specific ID
                var selectedLocation =
                    from location in context.locations
                    join coordinates in context.coordinates
                    on location.locationId equals coordinates.locationID
                    where location.locationId.Equals(id)
                    select new
                    {
                        locationData = location,
                        coordinateData = coordinates
                    };
                return Json(selectedLocation.ToArray());
            }
        }

        [HttpPost]
        public IActionResult add([FromBody] Location data)
        {
            _logger.LogInformation("Adding New Location");
            if (ModelState.IsValid)
            {
                context.locations.Add(data);
                context.SaveChanges();
                Console.WriteLine("New ID" + data.locationId);
                return Json(data.locationId);
            }
            else
            {
                _logger.LogInformation("Add: Location Data is not a valid model");
                return BadRequest();
            }
        }

        [HttpPost]
        public IActionResult edit([FromBody] Location data)
        {
            _logger.LogInformation("Editing Location" + data.locationId);

            if (ModelState.IsValid)
            {
                var singleLocation = from location in context.locations
                                     where location.locationId == data.locationId
                                     select location;

                Location a = singleLocation.FirstOrDefault();
                if (a != null)
                {
                    a.name = data.name;
                    a.phoneNumber = data.phoneNumber;
                    a.emailAddress = data.emailAddress;
                    a.address = data.address;
                    context.SaveChanges();
                    return Json(a.locationId);
                }
                else
                {
                    _logger.LogInformation("Location Edit: ID did not return data");
                    return Json("No data found");
                }
            }
            else
            {
                _logger.LogError("Model failed");
                var errors = ModelState.Values.SelectMany(v => v.Errors);
                foreach (ModelError e in errors)
                {
                    _logger.LogWarning(e.ErrorMessage);
                }
                return BadRequest();
            }
        }

        [HttpPost]
        public IActionResult delete([FromBody] int id)
        {
            _logger.LogInformation("Delete ID" + id);

            var selectedLocation = from location in context.locations
                                   where location.locationId == id
                                   select location;

            if (selectedLocation.Any())
            {
                _logger.LogInformation("Found Location");
                Location a = selectedLocation.First();
                context.locations.Remove(a);
                context.SaveChanges();
                return Ok("Deleted");
            }
            else
            {
                _logger.LogError("Unable to find location given ID");
                return BadRequest();
            }
        }

        [HttpPost]
        public IActionResult addCoordinates([FromBody] Coordinates data)
        {
            _logger.LogInformation("Adding new Coordinates");
            if (ModelState.IsValid)
            {
                context.coordinates.Add(data);
                context.SaveChanges();
                return Json(data.locationID);
            }
            else
            {
                _logger.LogWarning("Coordinate object Fail");
                return BadRequest();
            }
        }
        [HttpPost]
        public IActionResult editCoordinates([FromBody] Coordinates data)
        {
            _logger.LogInformation("Edit Coordinates");
            if (ModelState.IsValid)
            {
                var locationCoordinate =
                from coordinate in context.coordinates
                where coordinate.locationID == data.locationID
                select coordinate;

                Coordinates tmp = locationCoordinate.FirstOrDefault();
                if (tmp != null)
                {
                    tmp.locationID = data.locationID;
                    tmp.latitude = data.latitude;
                    tmp.longitude = data.longitude;
                    context.SaveChanges();
                    return Json(data.locationID);
                }
                else
                {
                    return Json("Edit Coord: Fail");
                }
            }
            else
            {
                _logger.LogError("Coordinate Object Fail");
                return BadRequest();
            }
        }
    }
}