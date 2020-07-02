import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AccountService } from './account.service';
import { SnackbarService } from './snackbar.service';
import { LocationBooking } from './Models/Locations';
import { Bookings } from './Models/Bookings';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class BookingService {
  userID: string;

  constructor(
    private snackbar: SnackbarService,
    private accountService: AccountService,
    private http: HttpClient) {
  }

  returnLocationBookings(data: Number): Observable<LocationBooking> {
    return this.http.get<LocationBooking>('/api/location/bookings/' + data);
  }

  returnUserBookings(): Observable<Bookings> {
    console.log(this.accountService.getLocalUserID());
    
    return this.http.get<Bookings>('api/booking/user/' + this.accountService.getLocalUserID());
  }

  returnSpecific(id: Number): Observable<Bookings> {
    return this.http.get<Bookings>('api/booking/get/' + id);
  }

  addNew(data): void {
    const newBooking = {
      createdOn: new Date().toJSON(),
      bookedFor: new Date(data.value.date + " " + data.value.time).toJSON(),
      status: false,
      userID: this.accountService.getUserID(),
      locationID: parseInt(data.value.location)
    }
    this.http.post('api/booking/add', newBooking).subscribe(() => {
      this.snackbar.notification.next("Added new booking!");
    }, () => {
      this.snackbar.notification.next("Failed to create booking");
    })
  }

  editExisting(data): void {
    const bookingObj = {
      bookingID: data.id,
      bookedFor: new Date(data.newValues.date + " " + data.newValues.time).toJSON(),
      locations: parseInt(data.newValues.location),
      status: false,
      user: this.userID,
      RowVersion: data.revision
    }

    this.http.post('api/booking/edit/', bookingObj).subscribe(() => {
      this.snackbar.notification.next("Booking Changed!");
    }, () => {
      this.snackbar.notification.next("Unable to change booking");
    })
  }

  editStatus(data): void {
    if (data.status == "Confirmed") {
      data.status = false;
    } else {
      data.status = true;
    }
    this.http.post('api/booking/confirmStatus', data).subscribe(() => {
      if (data.status) {
        this.snackbar.notification.next("Confirmed!");
      } else {
        this.snackbar.notification.next("Cancelled!");
      }
    }, () => {
      this.snackbar.notification.next("Error confirming status!");
    })
  }
} 
