import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { OAuthModule } from 'angular-oauth2-oidc';
import { TokenIntercept } from './token-intercept.service';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './Common/nav-menu/nav-menu.component';
import { HomeComponent } from './Common/home/home.component';
import { MapComponent } from './Common/map/map.component';
import { NotFoundComponent } from './ErrorPages/not-found/not-found.component';
import { LocationComponent } from './Locations/location/location.component';
import { LocationFormComponent } from './Locations/location-form/location-form.component';
import { BookingFormComponent } from './Bookings/booking-form/booking-form.component';
import { ProfileOverviewComponent } from './Profile-Dashboard/profile-overview/profile-overview.component';
import { AccountDetailsComponent } from './Account/account-details/account-details.component';
import { BookingsOverviewComponent } from './Profile-Dashboard/bookings-overview/bookings-overview.component';
import { LocationOverviewComponent } from './Profile-Dashboard/location-overview/location-overview.component';
import { RouteGuardService } from './route-guard.service';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { LayoutModule } from '@angular/cdk/layout';
import { LocationBookingsComponent } from './Locations/location-bookings/location-bookings.component';
import { LocationsTableComponent } from './Locations/locations-table/locations-table.component';
import { ProfileFrontComponent } from './Profile-Dashboard/profile-front/profile-front.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    LocationComponent,
    MapComponent,
    LocationFormComponent,
    BookingFormComponent,
    ProfileOverviewComponent,
    AccountDetailsComponent,
    NotFoundComponent,
    BookingsOverviewComponent,
    LocationOverviewComponent,
    LocationBookingsComponent,
    LocationsTableComponent,
    ProfileFrontComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    OAuthModule.forRoot(),
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'location-list', component: LocationComponent },
      {
        path: 'profile', component: ProfileOverviewComponent,
        children: [
          { path: '', component: ProfileFrontComponent },
          { path: 'bookings', component: BookingsOverviewComponent },
          { path: 'account', component: AccountDetailsComponent },
          {
            path: 'location', component: LocationOverviewComponent, children: [
              { path: '', component: LocationsTableComponent },
              { path: 'new', component: LocationFormComponent },
              { path: 'bookings/:id', component: LocationBookingsComponent },
              { path: 'edit/:id', component: LocationFormComponent }
            ]
          }
        ],
        canActivate: [RouteGuardService]
      },
      {
        path: 'locations', component: LocationComponent },
      {
        path: 'booking', children: [
          { path: '', redirectTo: '/profile/bookings', pathMatch: 'full' },
          { path: 'new', component: BookingFormComponent },
          { path: 'edit/:id', component: BookingFormComponent }
        ],
        canActivate: [RouteGuardService]
      },
      { path: '**', component: NotFoundComponent },
    ], { onSameUrlNavigation: 'reload' }),
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatInputModule,
    MatCardModule,
    MatDividerModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatTableModule,
    MatSidenavModule,
    MatListModule,
    MatFormFieldModule,
    MatGridListModule,
    MatSelectModule,
    MatPaginatorModule
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenIntercept, multi: true },
  ]
})

export class AppModule { }
