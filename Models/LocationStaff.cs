using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace bookingsApp.Models
{
    public class LocationStaff
    {
        public int locationID { get; set; }
        public Location location { get; set; }

        public int userID { get; set; }
        public User user { get; set; }

    }
}
