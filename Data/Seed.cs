using System;
using System.Collections;
using System.Linq;
using bookingsApp.Models;

public class Seed
{
    public static void SeedDatabase(BookingContext context)
    {
        context.Database.EnsureCreated();

        //Location
        if (context.locations.Any())
        {
            return; //Data exists in DB.
        }
        else
        {
            //Store New LocationIds
            ArrayList locationIDList = new ArrayList();

            var Locations = new Location[] {
                new Location {
                    name = "Location 1",
                    phoneNumber = 98765432,
                    emailAddress = "Test@test.com",
                    address = "123 Fake St",
                    coordinates = new NetTopologySuite.Geometries.Point(151.215050,-33.858245) {SRID = 4326},
                },
                new Location {
                    name = "Location 2",
                    address = "1234 Fake St",
                    phoneNumber = 1234567890,
                    emailAddress = "Test2@test.com",
                    coordinates = new NetTopologySuite.Geometries.Point(151.209968,-33.858998) {SRID = 4326},
                },
            };

            foreach (Location a in Locations)
            {
                context.locations.Add(a);
            };
            context.SaveChanges();
        }
    }
}