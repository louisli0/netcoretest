using System;
using System.Linq;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using bookingsApp.Models;
using System.Threading.Tasks;
using System.Net.Http;

namespace bookingsApp.Controllers
{
    [Authorize(Policy = "User")]
    public class BookingController : Controller
    {
        private readonly BookingContext context;
        private readonly ILogger _logger;
        public BookingController(BookingContext db, ILogger<BookingContext> logger)
        {
            context = db;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> get(int id)
        {
            try
            {
                if (id != 0)
                {
                    var bookingList =
                        from booking in context.bookings.Include(a => a.location)
                        where booking.bookingID == id
                        select new
                        {
                            id = booking.bookingID,
                            createdOn = booking.createdOn.ToString("u"),
                            bookedFor = booking.bookedFor.ToString("u"),
                            bookedTime = booking.bookedFor.ToLocalTime().ToString("HH:mm"),
                            status = booking.status,
                            revision = booking.RowVersion,
                            location = new
                            {
                                id = booking.location.locationId,
                                name = booking.location.name,
                                phone = booking.location.phoneNumber
                            }
                        };
                    return Json(await bookingList.ToArrayAsync());
                }
                else
                {
                    return NoContent();
                }
            }
            catch (HttpRequestException e)
            {
                _logger.LogInformation("Request Exception " + e);
                return NoContent();

            }
            catch (OperationCanceledException e)
            {
                _logger.LogInformation("Cancelled Operation" + e);
                return NoContent();
            }
        }

        [HttpGet]
        public async Task<IActionResult> user(string id)
        {
            try
            {
                if (id == "undefined") { throw new Exception("Invalid User"); }
                var uID = int.Parse(id);
                //User
                var singleUser = from user in context.users
                                 where user.userID == uID
                                 select user;
                var userObject = await singleUser.FirstOrDefaultAsync();
                if (userObject == null) { throw new Exception("User not found"); }

                //Bookings
                var userBookings =
                from booking in context.bookings
                where booking.user == userObject
                select new
                {
                    id = booking.bookingID,
                    createdOn = booking.createdOn.ToLongDateString(),
                    bookedFor = booking.bookedFor.ToLongDateString(),
                    bookedTime = booking.bookedFor.ToLocalTime().ToString("HH:mm tt"),
                    status = (booking.status == false ? "Not confirmed" : "Confirmed"),
                    revision = booking.RowVersion,
                    location = new
                    {
                        name = booking.location.name,
                        phone = booking.location.phoneNumber
                    }
                };
                return Json(await userBookings.ToListAsync());
            }
            catch (Exception e)
            {
                _logger.LogError("Error getting user bookings ", e);
                return BadRequest();
            }
        }

        [HttpPost]
        public async Task<IActionResult> add([FromBody] dynamic data)
        {
            try
            {
                dynamic bookingObj = JsonConvert.DeserializeObject(data.ToString());
                //Get User
                string uuid = bookingObj.userID;
                var singleUser = from user in context.users
                                 where user.uuid == uuid
                                 select user;

                var userTmp = singleUser.FirstOrDefault();
                if (userTmp == null) { throw new Exception("Local User Object not found"); }

                //Get Location
                int locID = bookingObj.locationID;
                var singleLocation = from location in context.locations
                                     where location.locationId == locID
                                     select location;
                Location locationTmp = singleLocation.FirstOrDefault();
                if (userTmp == null) { throw new Exception("Location Object not found"); }

                Bookings newBooking = new Bookings
                {
                    createdOn = bookingObj.createdOn,
                    bookedFor = bookingObj.bookedFor,
                    status = false,
                    user = userTmp,
                    location = locationTmp
                };
                context.bookings.Add(newBooking);
                await context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception e)
            {
                _logger.LogError("Add Booking error: " + e.Message);
                return BadRequest();
            }
        }

        [HttpPost]
        public async Task<IActionResult> edit([FromBody] dynamic data)
        {
            try
            {
                dynamic dataObj = JsonConvert.DeserializeObject(data.ToString());

                int bID = dataObj.bookingID;
                var singleBooking = from booking in context.bookings
                                    where booking.bookingID == bID
                                    select booking;

                Bookings selectedBooking = singleBooking.FirstOrDefault();

                if (selectedBooking != null)
                {
                    Byte[] compare = dataObj.RowVersion;
                    if (selectedBooking.RowVersion.SequenceEqual(compare))
                    {
                        if (data.locations != selectedBooking.location)
                        {
                            Console.WriteLine("Need to update locations");
                            int newlocID = dataObj.locations;
                            var singleLocation = from location in context.locations
                                                 where location.locationId == newlocID
                                                 select location;
                            Location locationObj = singleLocation.FirstOrDefault();
                            if (locationObj == null) { throw new Exception("Failed to find location"); }

                            selectedBooking.location = locationObj;
                        }
                        selectedBooking.bookedFor = dataObj.bookedFor;
                        selectedBooking.status = dataObj.status;
                        await context.SaveChangesAsync();
                        return NoContent();
                    }
                    else
                    {
                        return Json("RowVersion does not match");
                    }
                }
                else
                {
                    return Json("No booking found");
                }
            }
            catch (Exception e)
            {
                _logger.LogError("Edit Booking Exception ", e.Message);
                return BadRequest();
            }
        }

        [HttpPost]
        public async Task<IActionResult> confirmStatus([FromBody] dynamic data)
        {
            try
            {
                _logger.LogInformation("Booking Confirmation");
                var dataObj = JsonConvert.DeserializeObject(data.ToString());
                int bookingID = dataObj.id;
                var singleBooking = from booking in context.bookings
                                    where booking.bookingID == bookingID
                                    select booking;
                Bookings bookingObj = await singleBooking.FirstAsync();
                if (bookingObj != null)
                {
                    bookingObj.status = dataObj.status;
                    await context.SaveChangesAsync();
                    return NoContent();
                }
                else
                {
                    _logger.LogInformation("Unable to find booking");
                    throw new Exception("Cannot find booking data");
                }
            }
            catch (Exception e)
            {
                _logger.LogError("Error Updating Booking Status" + e.Message);
                return StatusCode(500);
            }
        }
    }
}
