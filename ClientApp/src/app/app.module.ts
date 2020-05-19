import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { LocationComponent } from './location/location.component';
import { MapComponent } from './map/map.component';
import { BookingComponent } from './booking/booking.component';
import { LocationFormComponent } from './location-form/location-form.component';
import { BookingFormComponent } from './booking-form/booking-form.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    LocationComponent,
    MapComponent,
    BookingComponent,
    LocationFormComponent,
    BookingFormComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    LeafletModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'location-list', component: LocationComponent },
      { path: 'booking-list', component: BookingComponent },
      { path: 'booking-form', component: BookingFormComponent },
      { path: 'booking-form/:id', component: BookingFormComponent },
      { path: 'location-form', component: LocationFormComponent },
      { path: 'location-form/:id', component: LocationFormComponent }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
