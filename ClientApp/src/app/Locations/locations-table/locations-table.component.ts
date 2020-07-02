import { Component } from '@angular/core';
import { LocationService } from '../../location.service';
import { Router } from '@angular/router';
import { Locations } from 'src/app/Models/Locations';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-locations-table',
  templateUrl: './locations-table.component.html',
  styleUrls: ['./locations-table.component.scss']
})
export class LocationsTableComponent {
  displayedColumns = ['name', 'address', 'phone', 'email', 'actions'];
  locations: Observable<Locations>;

  constructor(
    private locationService: LocationService,
    private route: Router,
  ) {
    this.locations = this.locationService.getUserOwnedLocations();
  }

  edit(data: number): void {
    this.route.navigate(['/profile/location/edit/' + data]);
  }

  enableDetails(data: number): void {
    this.route.navigate(['/profile/location/bookings/' + data]);
  }

  delete(data) : void {
    this.locationService.removeLocation(data);
  }
}
