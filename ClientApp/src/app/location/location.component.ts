import { Component, OnInit, ViewChild } from '@angular/core';
import { LocationService } from '../location.service';
import { Router } from '@angular/router';
import { MapComponent } from '../map/map.component';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})

export class LocationComponent implements OnInit {
  locations;
  type;
  errorMessage;
  @ViewChild(MapComponent) mapComponent: MapComponent;

  constructor(
    private locationService: LocationService,
    private route: Router) {

    this.locations = this.locationService.returnList().subscribe(data => {
      console.log("Location Component Received", data);
      this.locations = data;
    });
  }

  mapFind(data) {
    console.log("Find on Map", data)
    let send = { lat: data.latitude, lng: data.longitude}
    this.mapComponent.panMap(send);
  }

  edit(data) {
    console.log("edit", data);
    this.route.navigate(['location-form/', { id: data }]);
  }

  delete(data) {
    this.locationService.removeLocation(data).subscribe(data => {
      console.log("Delete Status", data);
    });
  }

  ngOnInit() {
    this.type = "view"
  }
}
