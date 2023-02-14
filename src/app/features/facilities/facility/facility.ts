import { FacilityBooking } from "./facility-booking";

export interface Facility {
    name: string;
    image: string;
    display: boolean;
    bookings: FacilityBooking[];
  }