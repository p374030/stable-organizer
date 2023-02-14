import { Costumer } from "../../account/profile-details/costumer";
import { FacilityTime } from "./facility-times";

export interface FacilityBooking{
  costumer: Costumer;
  horse: string;
  timeSlot: FacilityTime;
  time: string;
  changeable: boolean;
}
