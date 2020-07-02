using System;
using System.ComponentModel.DataAnnotations;

namespace bookingsApp.Models
{
    public class Bookings
    {
        [Key]
        public int bookingID { get; set; }
        public DateTime createdOn { get; set; }
        public DateTime bookedFor { get; set; }
        public Boolean status { get; set; }
        [Timestamp]
        public byte[] RowVersion { get; set; }
        public Location location { get; set; }
        public User user { get; set; }

    }

}
