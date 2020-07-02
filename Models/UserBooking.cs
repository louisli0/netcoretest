using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace bookingsApp.Models
{
    public class UserBooking
    {
        public int userID { get; set; }
        public User user { get; set; }

        public int bookingID { get; set; }
        public Bookings booking { get; set; }
    }
}
