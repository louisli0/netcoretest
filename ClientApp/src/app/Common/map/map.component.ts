import { Component, OnInit, Input } from '@angular/core';
import { LocationService } from '../../location.service';
import * as L from 'leaflet';
import "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/images/marker-icon-2x.png";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})

export class MapComponent implements OnInit {
  @Input() type: String;
  @Input() locationList: any;
  @Input() locationID: String;

  private map;
  coords;
  marker = L.marker([-33.8306421, 151.2416777], { draggable: true });
  constructor(private locationService: LocationService) { }

  ngOnChanges() {
    if (this.type == "edit" && this.locationList !== undefined) {
      let latitude = this.locationList.coordinates.lat;
      let longitude = this.locationList.coordinates.lng;
      let markerCoord = L.latLng(latitude, longitude);
      this.marker.setLatLng(markerCoord);
      this.map.panTo(markerCoord);
    }

    if (this.type == "view" && this.locationList !== undefined) {
      //Get Coordinate Data and create markers for location
      for (let a = 0; a < this.locationList.length; a++) {
        let lat = this.locationList[a].coordinates.lat
        let lng = this.locationList[a].coordinates.lng
        let markerTmp = L.marker([lat, lng]);
        markerTmp.bindPopup(this.locationList[a].name)
        markerTmp.addTo(this.map);
      }
    }
  }

  panMap(data) {
    let tmp = L.latLng(data.lat, data.lng);
    console.log(tmp);
    this.map.setView(tmp, 15);
  }

  ngOnInit() {
    this.map = L.map('map', {
      center: [-33.8306421, 151.2416777],
      zoom: 15
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 20,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    tiles.addTo(this.map);

    //HTML5 Geolocation
    if (!navigator.geolocation) {
      console.log("Navigator not available");
    } else if (navigator.geolocation && this.type == "new") {
      navigator.geolocation.getCurrentPosition((data) => {
        let a = L.latLng(data.coords.latitude, data.coords.longitude);
        this.marker.setLatLng(a);
        this.map.panTo(a);
      })
    }
    if (this.type != "view") {
      this.marker.addTo(this.map);
    }

    this.marker.on('dragend', () => {
      if (this.type == "new") {
        let data = { coords: this.marker.getLatLng() }
        this.locationService.editCoordinates(data);
      } else if (this.type == "edit" && this.locationID != null) {
        let data = { locationID: this.locationID, coords: this.marker.getLatLng() }
        this.locationService.editCoordinates(data);
      }
    })
  }
}
