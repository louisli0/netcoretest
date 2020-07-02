import { Component, ViewChild } from '@angular/core';
import { LocationService } from '../../location.service';
import { MapComponent } from '../../Common/map/map.component';
import { Title } from '@angular/platform-browser';
import { Locations } from 'src/app/Models/Locations';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})

export class LocationComponent  {
  locations: Locations;
  type: string;
  displayedColumns = ['name', 'address', 'phone', 'actions'];
  @ViewChild(MapComponent) mapComponent: MapComponent;

  constructor(
    private title: Title,
    private locationService: LocationService) {
    this.type = "view";

    this.locationService.returnList().subscribe( (data:Locations) => {
      this.locations = data;
    });
    this.title.setTitle("Locations");
  }

  mapFind(data): void {
    let send = { lat: data.lat, lng: data.lng }
    this.mapComponent.panMap(send);
  }
}