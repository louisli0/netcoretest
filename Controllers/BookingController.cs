using System;
using System.Text;
using System.Linq;
using System.Collections.Generic;
using Microsoft.Extensions.Logging;
using bookingsApp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace bookingsApp.Controllers
{
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
        public IActionResult Index()
        {
            _logger.LogInformation("Access all bookings");

            var bookingList =
                from booking in context.bookings
                join location in context.locations
                on booking.locationID equals location.locationId
                select new
                {
                    rowVersion = Convert.ToBase64String(booking.RowVersion),
                    bookedFor = booking.bookedFor.ToLocalTime().ToString("o", System.Globalization.CultureInfo.InvariantCulture).Substring(0, 10),
                    bookedTime = booking.bookedFor.ToLocalTime().ToString("hh:mm tt"),
                    createdOn = booking.createdOn.ToLocalTime().ToString("o", System.Globalization.CultureInfo.InvariantCulture).Substring(0, 10),
                    createdTime = booking.createdOn.ToLocalTime().ToString("hh:mm tt"),
                    idBooking = booking.bookingID,
                    idLocation = booking.locationID,
                    locationName = location.name,
                    locationPhone = location.phoneNumber,
                    status = booking.status
                };

            return Json(bookingList.ToArray());
        }

        [HttpGet]
        public IActionResult get(int? id)
        {
            _logger.LogInformation("Access specific bookings");
            var bookingList =
                from booking in context.bookings
                join location in context.locations
                    on booking.locationID equals location.locationId
                where booking.bookingID == id
                select new
                {
                    rowVersion = Convert.ToBase64String(booking.RowVersion),
                    bookedFor = booking.bookedFor.ToLocalTime().ToString("o", System.Globalization.CultureInfo.InvariantCulture).Substring(0, 10),
                    bookedTime = booking.bookedFor.ToLocalTime().ToString("HH:mm"),
                    createdOn = booking.createdOn.ToLocalTime().ToString("o", System.Globalization.CultureInfo.InvariantCulture).Substring(0, 10),
                    createdTime = booking.createdOn.ToLocalTime().ToString("HH:mm"),
                    idBooking = booking.bookingID,
                    idLocation = booking.locationID,
                    locationName = location.name,
                    locationPhone = location.phoneNumber,
                    status = booking.status,

                };
            return Json(bookingList.ToArray());
        }

        [HttpPost]
        public IActionResult add([FromBody] Bookings data)
        {

            if (ModelState.IsValid)
            {
                _logger.LogInformation("Booking is Valid, Adding into Database");
                context.bookings.Add(data);
                context.SaveChanges();
                return Json(data.bookingID);
            }
            else
            {
                _logger.LogWarning("Incoming Booking is Invalid");
                var errors = ModelState.Values.SelectMany(v => v.Errors);
                foreach (ModelError e in errors)
                {
                    _logger.LogWarning(e.ErrorMessage);
                }
                return BadRequest();
            }
        }

        [HttpPost]
        public IActionResult edit([FromBody] Bookings data)
        {
            _logger.LogInformation("Edit Booking" + data.bookingID);
            var singleBooking = from booking in context.bookings
                                where booking.bookingID == data.bookingID
                                select booking;

            if (singleBooking.Any())
            {
                Bookings selectedBooking = singleBooking.First();
                Console.WriteLine(selectedBooking.RowVersion.SequenceEqual(data.RowVersion));
                if (selectedBooking.RowVersion.SequenceEqual(data.RowVersion))
                {
                    selectedBooking.bookedFor = data.bookedFor;
                    selectedBooking.locationID = data.locationID;
                    context.SaveChanges();
                    return Json("ok");
                }
                else
                {
                    return Json("RowVersion does not match");
                }
            }
            else
            {
                _logger.LogError("Edit: Booking Not found / ID error");
                return BadRequest();
            }
        }
        [HttpPost]
        public IActionResult updateStatus([FromBody] int id)
        {
            //Confirm an appointment or cancel
            var singleBooking = from booking in context.bookings
                                where booking.bookingID == id
                                select booking;

            if (singleBooking.Any())
            {
                singleBooking.First().status = singleBooking.First().status == true ? false : true;
                context.SaveChanges();
                return Json("Ok");
            }
            else
            {
                return BadRequest();
            }


        }

        [HttpPost]
        public IActionResult cancel([FromBody] int id)
        {
            _logger.LogInformation("Cancel Request Received" + id);
            var singleBooking = from booking in context.bookings
                                where booking.bookingID == id
                                select booking;
            if (singleBooking.Any())
            {
                singleBooking.FirstOrDefault().status = false;
                context.SaveChanges();
                return Json(singleBooking.ToArray());
            }
            else
            {
                _logger.LogError("Unable to find booking or id error");
                return BadRequest();
            }
        }
    }
}
