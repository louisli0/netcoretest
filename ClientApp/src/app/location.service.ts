import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from './account.service';
import { Observable } from 'rxjs';
import { Locations } from './Models/Locations';
import { SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root'
})

export class LocationService {
  coords;
  constructor(
    private http: HttpClient,
    private snackBar : SnackbarService,
    private accountService: AccountService,
    private route: ActivatedRoute) {
  }

  returnList() : Observable<Locations>{
    return this.http.get<Locations>('api/location/get');
  }

  getLocationID(data): Observable<Locations> {
    console.log("Getting Location data for ID:", data);
    return this.http.get<Locations>('api/location/get/' + data)
  }

  getUserOwnedLocations() : Observable<Locations> {
    let userID = this.accountService.getLocalUserID();
    return this.http.get<Locations>('api/location/getUser/' + userID);
  }

  async addLocation(data) {
    if (this.coords != null) {
      let send = {
        name: data.value.name,
        phoneNumber: data.value.phone,
        emailAddress: data.value.email,
        address: data.value.address,
        lat: this.coords.lat,
        lng: this.coords.lng
      };
      console.log("Sending Location Data", send);

      this.http.post('api/location/add', send).subscribe(data => {
        console.log("New LocationID:", data);
        this.accountService.addLocationID(data);
      })
    } else {
      console.log("No Marker Coordinates");
    }
  }

  editLocation(data) {
    console.log("Edit Location", data);
    
    let send = {
      locationId: data.locationId,
      name: data.newValues.name,
      phoneNumber: data.newValues.phone,
      emailAddress: data.newValues.email,
      address: data.newValues.address,
      lat: this.coords == undefined ? data.prev.coordinates.lat : this.coords.lat,
      lng: this.coords == undefined ? data.prev.coordinates.lng : this.coords.lng,
    };

    this.http.post('api/location/edit/', send).subscribe(data => {
      console.log("Edit Returned", data);
    }),
      error => {
        console.log(error);
      }, () => {
        console.log("No Error on edit");
      }
  }

  removeLocation(data) {
    console.log("Remove Location", data);
    return this.http.post('api/location/delete/', data);
  }

  editCoordinates(data) : void {
    this.coords = data.coords;
  }
}
