import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LocationService } from '../../location.service';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Locations } from 'src/app/Models/Locations';


@Component({
  selector: 'app-location-form',
  templateUrl: './location-form.component.html',
  styleUrls: ['./location-form.component.scss']
})

export class LocationFormComponent {
  locationID: String;
  type: String;
  currentLocation: Locations;
  errorMessage: String;
  
  locationForm = new FormGroup({
    name: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required)
  })

  constructor(
    private locationService: LocationService,
    private route: ActivatedRoute,
    private title: Title)
  {

    this.route.paramMap.subscribe(paramMap => {
      this.locationID = paramMap.get('id');
      if(paramMap.get('id') == null) {
        this.type = "new";
        this.title.setTitle("New Location");
      } else {
        console.log("Editing", this.locationID);
        this.type = "edit";
        this.title.setTitle("Editing Location");
      }
    })

    if (this.locationID != undefined) {
      this.locationService.getLocationID(this.locationID).subscribe(data => {
        this.currentLocation = data[0];
        this.locationForm.setValue({
          name: data[0].name,
          phone: data[0].phone,
          address: data[0].address,
          email: data[0].email
        }); 
      });
    }
  }

  actions() : void {
    if(this.locationForm.controls['name'].errors
  || this.locationForm.controls['phone'].errors
  || this.locationForm.controls['address'].errors
  || this.locationForm.controls['email'].errors
  ) {
      console.log("Error in form", this.locationForm);
      return;
    }

    if (this.locationID != undefined) {
      console.log("Editing existing location")
      this.editLocation();
    } else {
      console.log("Adding new location")
      this.addLocation();
    }
  }

  editLocation(): void {
    console.log("Edit Location", this.locationForm.value);
    let send = {
      locationId: this.currentLocation.id,
      prev: this.currentLocation,
      newValues: this.locationForm.value
    }
    this.locationService.editLocation(send);
  }

  addLocation() : void {
    console.log("Add Location", this.locationForm.value);
    this.locationService.addLocation(this.locationForm);
  }

}
