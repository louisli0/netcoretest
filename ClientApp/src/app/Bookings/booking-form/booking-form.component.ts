import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LocationService } from '../../location.service';
import { BookingService } from '../../booking.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { SnackbarService } from 'src/app/snackbar.service';

@Component({
  selector: 'app-booking-form',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.scss']
})

export class BookingFormComponent implements OnInit {
  todayDate = new Date().toJSON().substring(0, 10);
  locationList: any;
  currentBooking: any;
  locationId: string;
  id;

  bookingForm = new FormGroup({
    date: new FormControl('', Validators.required),
    time: new FormControl('', Validators.required),
    location: new FormControl('', Validators.required)
  })

  constructor(
    private title: Title,
    private route: ActivatedRoute,
    private snackBar: SnackbarService,
    private locationService: LocationService,
    private bookingService: BookingService) {

    this.route.paramMap.subscribe(paramMap => {
      this.id = paramMap.get('id');
    });

    //If ID Parameter exists, Get Booking Data
    if (this.id != undefined) {
      this.title.setTitle('Edit Booking');

      this.bookingService.returnSpecific(this.id).subscribe(data => {
        this.currentBooking = data[0];
        this.bookingForm.setValue({
          date: new Date(data[0].bookedFor).toISOString().substring(0, 10),
          time: data[0].bookedTime,
          location: data[0].location.id
        })
      });
    }
  }

  ngOnInit(): void {
    this.locationService.returnList().subscribe(data => {
      this.locationList = data;
    })
  }

  determineAction(): void {
    if (
      !this.bookingForm.controls['date'].valid ||
      !this.bookingForm.controls['time'].valid ||
      !this.bookingForm.controls['location'].valid) {
      console.log(this.bookingForm)
      this.snackBar.notification.next("Incomplete Form");
      return;
    } else {
      if (this.id != undefined) {
        this.editBooking();
      } else {
        this.addBooking();
      }
    }
  }

  editBooking(): void {
    let a = {
      newValues: this.bookingForm.value,
      id: this.currentBooking.id,
      revision: this.currentBooking.revision
    }
    this.bookingService.editExisting(a);
  }

  addBooking(): void {
    this.bookingService.addNew(this.bookingForm);
  }
}