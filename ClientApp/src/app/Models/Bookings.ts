export interface Bookings{
    id: number,
    createdOn: string,
    bookedFor: string,
    bookedTime: string,
    status: string,
    revision: string,
    location: BookingLocation
};

export interface BookingLocation {
    id: number,
    name: string,
    phone: number
};