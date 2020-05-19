import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class LocationService {
  locationList;
  coords;

  constructor(private http: HttpClient,
    private route: ActivatedRoute) {
  }

  returnList() {
    return this.http.get('/location/get');
  }

  getLocationID(data) {
    console.log("Getting Location data for ID:", data);
    return this.http.get('/location/get/' + data)
  }

  addLocation(data) {
    let send = {
      name: data.value.name,
      phoneNumber: data.value.phone,
      emailAddress: data.value.email,
      address: data.value.address
    };

    //Verify Marker Data
    if (this.coords != null) {
      console.log("Sending Location Data", send);
      this.http.post('/location/add', send).subscribe(data => {
        //Add Coordinates
        console.log("Location Add returned", data);
        
        let sendCoords = {
          locationID: data,
          latitude: this.coords.lat.toString(),
          longitude: this.coords.lng.toString()
        };
        console.log("Sending Coordinates", sendCoords);
        this.http.post('/location/addCoordinates', sendCoords).subscribe(data => {
          console.log("Coordinates", data);
        })
      })
    } else {
      console.log("No Marker");
    }
  }

  editLocation(data) {
    console.log("Edit Location", data);

    let send = {
      locationId: data.locationId,
      name: data.newValues.name,
      phoneNumber: data.newValues.phone,
      emailAddress: data.newValues.email,
      address: data.newValues.address
    };

    this.http.post('/location/edit/', send).subscribe(data => {
      console.log("Edit Returned", data);
    }),
      error => {
        console.log(error);
      }, () => {
        console.log("No Error on edit");
      }

    let sendCoords = {
      locationID: data.locationId,
      latitude: this.coords.lat.toString(),
      longitude: this.coords.lng.toString()
    }

    this.http.post('/location/editCoordinates', sendCoords).subscribe(data => {
      console.log("Coords Controller returned", data);
    }, error => {
      console.log("Coordinate error", error);
    })
  }

  removeLocation(data) {
    console.log("Remove Location ID", data);
    return this.http.post('/location/delete/', data);
  }

  editCoordinates(data) {
    this.coords = data.coords;
  }
}
