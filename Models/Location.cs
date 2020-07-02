using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using bookingsApp.Models;
using NetTopologySuite.Geometries;
using Newtonsoft.Json;

public class Location
{
    [Key]
    public int locationId { get; set; }
    public string name { get; set; }
    public string address { get; set; }
    public int phoneNumber { get; set; }
    public string emailAddress { get; set; }
    [JsonIgnore]
    public Point coordinates { get; set; }
    [Timestamp]
    public byte[] RowVersion { get; set; }

    public virtual ICollection<LocationStaff> staff { get; set; }
    public virtual ICollection<Bookings> bookings { get; set; }

}
