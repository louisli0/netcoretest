using bookingsApp.Models;
using Microsoft.EntityFrameworkCore;

public class BookingContext : DbContext
{
    public BookingContext(DbContextOptions options) : base(options)
    { }

    public DbSet<Location> locations { get; set; }
    public DbSet<Bookings> bookings { get; set; }
    public DbSet<User> users { get; set; }
    public DbSet<LocationStaff> staff { get; set; }

    protected override void OnModelCreating(ModelBuilder modelbuilder)
    {

        modelbuilder.Entity<Location>()
            .HasMany(loc => loc.bookings)
            .WithOne(booking => booking.location);

        modelbuilder.Entity<User>()
            .HasMany(u => u.locations)
            .WithOne(locStaff => locStaff.user);

        modelbuilder.Entity<User>()
            .HasMany(u => u.bookings)
            .WithOne(booking => booking.user);

        modelbuilder.Entity<LocationStaff>()
            .HasKey(i => new { i.locationID, i.userID });

    }
}
