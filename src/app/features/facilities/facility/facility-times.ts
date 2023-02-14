
export interface Times{
  slotsPerHour:number;
  dayHours: number;
  
}

export interface FacilityTime{
  timesInfo: Times;
  timeSlots: number;
  isBooked: boolean;
  slotName:string;
}
