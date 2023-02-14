import { Costumer } from "src/app/features/account/profile-details/costumer";
import { StableServiceBookingTimes } from "./booking-time-enum";

export interface StableServiceBooking{
  costumer: Costumer;
  horse: string;
  startTime: Date,
  time: StableServiceBookingTimes;
  changeable: boolean;
}
