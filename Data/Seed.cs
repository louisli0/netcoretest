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
                    address = "123 Fake St"
                },
                new Location {
                    name = "Location 2",
                    address = "1234 Fake St",
                    phoneNumber = 1234567890,
                    emailAddress = "Test2@test.com"
                },
            };

            foreach (Location a in Locations)
            {
                context.locations.Add(a);
                context.SaveChanges();
                Console.WriteLine(a.locationId);
                locationIDList.Add(a.locationId);
            };

            var Coordinates = new Coordinates[] {
                new Coordinates {
                locationID = (int) locationIDList[0],
                latitude = "-33.8613586",
                longitude = "151.1963595"
                },
                new Coordinates {
                    locationID = (int) locationIDList[1],
                    latitude = "-33.879994",
                    longitude = "151.190738",
                }
            };

            foreach (Coordinates a in Coordinates)
            {
                context.coordinates.Add(a);
            }
            context.SaveChanges();

            var Bookings = new Bookings[]
    {
                    new Bookings {
                       createdOn = DateTime.Now,
                       bookedFor = DateTime.Now,
                       locationID = 1,
                    },
    };

            foreach (Bookings b in Bookings)
            {
                context.bookings.Add(b);
            };

            context.SaveChanges();
        }

    }
}