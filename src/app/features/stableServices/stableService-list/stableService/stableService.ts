import { StableServiceBookingTimes } from "./booking-time-enum";
import { StableServiceBooking } from "./stableService-booking";

export interface StableSerive{
name:string;
image:string;
bookeableTimeRanges:StableServiceBookingTimes[];
bookings: StableServiceBooking[]
display:boolean;
}