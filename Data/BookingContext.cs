using bookingsApp.Models;
using Microsoft.EntityFrameworkCore;

public class BookingContext : DbContext {
    public BookingContext(DbContextOptions options) : base(options) {
    }

    public DbSet<Location> locations { get; set;} 
    public DbSet<Bookings> bookings { get; set; }
    public DbSet<Coordinates> coordinates { get; set;}

    protected override void OnModelCreating(ModelBuilder modelbuilder) {
        modelbuilder.Entity<Location>().ToTable("Location");
        modelbuilder.Entity<Bookings>().ToTable("Bookings");
        modelbuilder.Entity<Coordinates>().ToTable("Coordinates");
    }
}
