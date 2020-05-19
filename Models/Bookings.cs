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
        [Required]
        public int locationID { get; set; }
        public Boolean status { get; set; }
        [Timestamp]
        public byte[] RowVersion { get; set;}   
    }
}
