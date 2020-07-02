import { Component, OnInit } from '@angular/core';
import { LocationService } from '../../location.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Locations } from 'src/app/Models/Locations';
@Component({
  selector: 'app-location-overview',
  templateUrl: './location-overview.component.html',
  styleUrls: ['./location-overview.component.scss']
})
export class LocationOverviewComponent implements OnInit {
  displayedColumns = ['name', 'address', 'phone', 'email', 'actions'];
  locations: Observable<Locations>
  seeDetails: boolean

  constructor(
    private locationService: LocationService,
    private route: Router
  ) { }

  ngOnInit() {
    this.locations = this.locationService.getUserOwnedLocations()
  }

  edit(data: number) : void {
    this.route.navigate(['locations/edit/'+data]);
  }
  enableDetails(data: number) : void {
    this.seeDetails = true;
  }

  delete(data) : void {
    this.locationService.removeLocation(data);
  }
}
