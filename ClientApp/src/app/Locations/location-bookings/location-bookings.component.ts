import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { BookingService } from '../../booking.service';
import { Observable } from 'rxjs';
import { LocationBooking } from 'src/app/Models/Locations';

@Component({
  selector: 'app-location-bookings',
  templateUrl: './location-bookings.component.html',
  styleUrls: ['./location-bookings.component.scss']
})
export class LocationBookingsComponent {
  bookingList: Observable<LocationBooking>;
  locationName: string;
  locationID: number;
  displayColumns = ['date', 'user', 'actions']

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService,
    private title: Title) {
    this.title.setTitle('Bookings for Location');
    this.route.paramMap.subscribe(paramMap => {
      this.locationID = parseInt(paramMap.get('id'));
    })
    this.bookingList = this.bookingService.returnLocationBookings(this.locationID);
  }

  confirmBooking(id: number, status: string): void {
    let data = { id: id, status: status };
    this.bookingService.editStatus(data);
  }

  edit(id: number): void {
    this.router.navigate(['/booking/edit/' + id]);
  }
}
