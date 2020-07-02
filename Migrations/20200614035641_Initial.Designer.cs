﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using NetTopologySuite.Geometries;

namespace bookingsApp.Migrations
{
    [DbContext(typeof(BookingContext))]
    [Migration("20200614035641_Initial")]
    partial class Initial
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "3.1.5")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("Location", b =>
                {
                    b.Property<int>("locationId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<byte[]>("RowVersion")
                        .IsConcurrencyToken()
                        .ValueGeneratedOnAddOrUpdate()
                        .HasColumnType("rowversion");

                    b.Property<string>("address")
                        .HasColumnType("nvarchar(max)");

                    b.Property<Point>("coordinates")
                        .HasColumnType("geography");

                    b.Property<string>("emailAddress")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("name")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("phoneNumber")
                        .HasColumnType("int");

                    b.HasKey("locationId");

                    b.ToTable("locations");
                });

            modelBuilder.Entity("bookingsApp.Models.Bookings", b =>
                {
                    b.Property<int>("bookingID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<byte[]>("RowVersion")
                        .IsConcurrencyToken()
                        .ValueGeneratedOnAddOrUpdate()
                        .HasColumnType("rowversion");

                    b.Property<DateTime>("bookedFor")
                        .HasColumnType("datetime2");

                    b.Property<DateTime>("createdOn")
                        .HasColumnType("datetime2");

                    b.Property<int?>("locationId")
                        .HasColumnType("int");

                    b.Property<bool>("status")
                        .HasColumnType("bit");

                    b.Property<int?>("userID")
                        .HasColumnType("int");

                    b.HasKey("bookingID");

                    b.HasIndex("locationId");

                    b.HasIndex("userID");

                    b.ToTable("bookings");
                });

            modelBuilder.Entity("bookingsApp.Models.LocationStaff", b =>
                {
                    b.Property<int>("locationID")
                        .HasColumnType("int");

                    b.Property<int>("userID")
                        .HasColumnType("int");

                    b.HasKey("locationID", "userID");

                    b.HasIndex("userID");

                    b.ToTable("staff");
                });

            modelBuilder.Entity("bookingsApp.Models.User", b =>
                {
                    b.Property<int>("userID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("email")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("name")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("phone")
                        .HasColumnType("int");

                    b.Property<string>("uuid")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("userID");

                    b.ToTable("users");
                });

            modelBuilder.Entity("bookingsApp.Models.Bookings", b =>
                {
                    b.HasOne("Location", "location")
                        .WithMany("bookings")
                        .HasForeignKey("locationId");

                    b.HasOne("bookingsApp.Models.User", "user")
                        .WithMany("bookings")
                        .HasForeignKey("userID");
                });

            modelBuilder.Entity("bookingsApp.Models.LocationStaff", b =>
                {
                    b.HasOne("Location", "location")
                        .WithMany("staff")
                        .HasForeignKey("locationID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("bookingsApp.Models.User", "user")
                        .WithMany("locations")
                        .HasForeignKey("userID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });
#pragma warning restore 612, 618
        }
    }
}
