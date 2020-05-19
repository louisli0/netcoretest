using System.ComponentModel.DataAnnotations;
public class Coordinates {
    [Key]
    public int coordID { get; set;}
    public int locationID { get; set; }
    public string longitude { get; set;}
    public string latitude {get; set;}
}