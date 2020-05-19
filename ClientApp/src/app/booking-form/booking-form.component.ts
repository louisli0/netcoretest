import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { LocationService } from '../location.service';
import { BookingService } from '../booking.service';

@Component({
  selector: 'app-booking-form',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.scss']
})

export class BookingFormComponent implements OnInit {
  locationList;
  currentBooking;
  id;
  errorMessage;

  bookingForm = new FormGroup({
    date: new FormControl('', Validators.required),
    time: new FormControl('', Validators.required),
    location: new FormControl('', Validators.required)
  })

  constructor(
    private route: ActivatedRoute,
    private locationService: LocationService,
    private bookingService: BookingService) {

    this.route.paramMap.subscribe(paramMap => {
      this.id = paramMap.get('id');
    })

    //If ID Parameter exists, Get the specific location and specific actions
    if (this.id != undefined) {
      this.bookingService.returnSpecific(this.id).subscribe(data => {
        console.log("Single Booking Return", data[0]);
        this.currentBooking = data[0];

        this.bookingForm.setValue({
          date: data[0].bookedFor,
          time: data[0].bookedTime,
          location: data[0].idLocation
        })
      });

    } else {
      console.log("New Booking state");
    }

    this.locationService.returnList().subscribe(data => {
      console.log("Get all data", data);
      this.locationList = data;
    })
  }

  ngOnInit() {
  }

  determineAction() {
    if (this.id != undefined) {
      this.editBooking();
    } else {
      this.addBooking();
    }
  }

  editBooking() {
    console.log(this.bookingForm);
    //Need to add created and booking id
    console.log(this.currentBooking.createdOn + " " + this.currentBooking.createdTime);
    console.log(this.bookingForm.value.date + " " + this.bookingForm.value.time);
    let a = {
      newValues: this.bookingForm.value,
      createdOn: new Date(this.currentBooking.createdOn + " " + this.currentBooking.createdTime).toJSON(),
      bookingID: this.currentBooking.idBooking,
      rowVersion: this.currentBooking.rowVersion
    }
    this.bookingService.editExisting(a).subscribe(data => {
      console.log("Edit Booking Received", data);
      this.errorMessage = data;
    }), error => {
      this.errorMessage = "Error Occured"
      console.log("Edit booking error", error);
    };
  }

  addBooking() {
    this.bookingService.addNew(this.bookingForm).subscribe(data => {
      console.log("New Booking Received", data);
      this.errorMessage = data;
    }, error => {
      console.log("Add Booking Error", error);
      this.errorMessage = "Unable to add booking";
    });
  }

}
