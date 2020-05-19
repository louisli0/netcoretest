using System;
using System.ComponentModel.DataAnnotations;

public class Location {
    [Key]
    public int locationId { get; set; }
    public string name { get; set; }
    public string address { get; set; }
    public int phoneNumber { get; set; }
    public string emailAddress {get; set; }

}
