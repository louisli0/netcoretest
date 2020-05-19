import { Component, OnInit  } from '@angular/core';
import { BookingService } from '../booking.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {
  allBookings;

  constructor(
    private bookingService: BookingService,
    private route: Router) {
    this.bookingService.returnAll().subscribe(data => {
      console.log("Bookings All:", data);
      this.allBookings = data;
    })
  }

  change(data2) {
    console.log("Change Data", data2);
    this.route.navigate(['booking-form/', { id: data2 }]);
  }

  cancel(data2) {
    this.bookingService.cancelBooking(data2);
  }

  addNew() {
    this.route.navigate(['booking-form']);
  }

  ngOnInit() {

  }
}
