import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class BookingService {
  bookingList;
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute) {
  }

  returnAll() {
    return this.http.get('/booking');
  }

  returnSpecific(id: Number) {
    let param = new HttpParams().set('id', id.toString());
    return this.http.get('/booking/get/', { params: param });
  }

  addNew(data) {
    let test = {
      "createdOn": new Date().toJSON(),
      "bookedFor": new Date(data.value.date + " " + data.value.time).toJSON(),
      "locationID": parseInt(data.value.location),
      "status": false
    }
    return this.http.post('booking/add', test)
  }

  editExisting(data) {
    let send = {
      bookingID: data.bookingID,
      createdOn: data.createdOn,
      bookedFor: new Date(data.newValues.date + " " + data.newValues.time).toJSON(),
      locationID: parseInt(data.newValues.location),
      status: false,
      RowVersion: data.rowVersion
    }
    return this.http.post('/booking/edit/', send)
  }

  cancelBooking(data: Number) {
    //Change status to false
    console.log("Cancel Booking", data);
    let sendId = { id: data };
    return this.http.post('/booking/updateStatus/', data)
  }
}
