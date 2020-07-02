using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace bookingsApp.Models
{
    public class User
    {
        [Key]
        public int userID { get; set; }
        public string uuid { get; set; }
        public string name { get; set;}
        public int phone {get; set;}
        public string email { get; set;}
        public virtual ICollection<LocationStaff> locations { get; set; }
        public virtual ICollection<Bookings> bookings { get; set; }
    }
}
