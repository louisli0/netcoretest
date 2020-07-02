import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LocationService } from '../location.service';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-location-form',
  templateUrl: './location-form.component.html',
  styleUrls: ['./location-form.component.scss']
})

export class LocationFormComponent implements OnInit {
  locationID: String;
  type: String;
  currentLocation;
  errorMessage;
  
  locationForm = new FormGroup({
    name: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required)
  })

  constructor(
    private locationService: LocationService,
    private route: ActivatedRoute,
  private titleService: Title)
  {

    this.route.paramMap.subscribe(paramMap => {
      this.locationID = paramMap.get('id');
      if(paramMap.get('id') == null) {
        this.type = "new";
        this.titleService.setTitle("New Location");
      } else {
        this.type = "edit";
        this.titleService.setTitle("Editing Location");
      }
    })

    //Check ID
    if (this.locationID != undefined) {
      
      //Get Location Data and set form
      this.locationService.getLocationID(this.locationID).subscribe(data => {
        console.log("Location Form got", data[0].locationData);
        this.currentLocation = data[0];

        this.locationForm.setValue({
          name: data[0].locationData.name,
          phone: data[0].locationData.phoneNumber,
          address: data[0].locationData.address,
          email: data[0].locationData.emailAddress
        });
      });

    } else {
      console.log("New Location")
      this.titleService.setTitle("Adding Location");
    }
  }

  ngOnInit() {

  }

  actions() {
    if (this.locationID != undefined) {
      console.log("Editing existing location")
      this.editLocation();
    } else {
      console.log("Adding new location")
      this.addLocation();
    }
  }

  editLocation() {
    console.log("Edit Location", this.locationForm.value);
    let send = {
      locationId: this.currentLocation.locationData.locationId,
      newValues: this.locationForm.value
    }
    this.locationService.editLocation(send);
  }

  addLocation() {
    console.log("Add Location", this.locationForm.value);
    this.locationService.addLocation(this.locationForm);
  }
}
