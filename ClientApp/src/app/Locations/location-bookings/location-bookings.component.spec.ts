import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationBookingsComponent } from './location-bookings.component';

describe('LocationBookingsComponent', () => {
  let component: LocationBookingsComponent;
  let fixture: ComponentFixture<LocationBookingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationBookingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
