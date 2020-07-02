import { Component } from '@angular/core';
import { BookingService } from '../../booking.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Bookings } from 'src/app/Models/Bookings';

@Component({
  selector: 'app-bookings-overview',
  templateUrl: './bookings-overview.component.html',
  styleUrls: ['./bookings-overview.component.scss']
})
export class BookingsOverviewComponent {
  bookingList: Observable<Bookings>;
  displayedColumns = ['Date / Time', 'location', 'status', 'actions']
  
  constructor(
    private bookingService: BookingService, 
    private route: Router
  ) {
    this.bookingList = this.bookingService.returnUserBookings();
  }

  cancel(id: number, status: boolean) : void {
    let data = { id: id, status: status}
    this.bookingService.editStatus(data);
  }

  edit(data: number): void {
    this.route.navigate(['/booking/edit/'+data]);
  }

}
