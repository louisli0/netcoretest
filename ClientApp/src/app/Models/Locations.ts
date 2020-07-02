export interface Locations{
    id: number,
    name: string,
    email: string,
    phone: number,
    coordinates: LocationCoordinates
    staff: object
};

export interface LocationCoordinates{
    lat: string,
    lng: string
};

export interface LocationBooking {
    id: number,
    createdOn: string,
    bookedFor: string,
    bookedTime: string,
    status: string,
    revision: string,
    user: LocationBookingUser
};

export interface LocationBookingUser {
    name: string,
    phone: number
};