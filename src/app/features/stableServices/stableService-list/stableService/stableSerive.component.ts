import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { User } from '@firebase/auth';
import { UserType } from 'src/app/core/guards/user-type';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { CostumerService } from 'src/app/core/services/costumer.service';
import { StableServiceService } from 'src/app/core/services/stableService.service';
import { Horse } from 'src/app/features/account/horse-deatils/horse';
import { Costumer } from 'src/app/features/account/profile-details/costumer';
import { StableServiceBookingTimes } from './booking-time-enum';
import { StableSerive } from './stableService';
import { StableServiceBooking } from './stableService-booking';
import { weekNumber } from 'weeknumber'
import { Observable } from 'rxjs';




@Component({
  selector: 'app-stableSerive',
  templateUrl: './stableSerive.component.html',
  styleUrls: ['./stableSerive.component.css']
})
export class StableServiceComponent implements OnInit {
  stableServiceList: any;
  selectedStableService: StableSerive;
  selectedTime:Date;
  selectedTimeFrame:StableServiceBookingTimes;
  selectedHorses:string[];
  user: any;
  costumer: Costumer[];
  isAdmin: Boolean;
  range = new FormGroup({
  start: new FormControl<Date | null>(null),
  end: new FormControl<Date | null>(null),
  });
  today:Date;
  currentMonth:string;
  startOfWeek:string;
  endOfWeek:string;
  horses = new FormControl('');
  horseNameList: string[];
  timeRanges:StableServiceBookingTimes[];
  todayBookings: StableServiceBooking[] = [];
  currentWeekBookings: StableServiceBooking[];
  datePipe:DatePipe;
  currentMonthBookings: StableServiceBooking[];
  isMyBooking:boolean=true;
  costumerStableServiceBookings: any;

  

  constructor(private stableServiceService:StableServiceService,
              private authService: AuthenticationService,
              private costumerService: CostumerService,
              private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
    ) { }

  bookStableService(){
    this.selectedHorses.forEach(horse=>{
      let booking: StableServiceBooking = {costumer:this.costumer[0],horse:horse,startTime:this.selectedTime,time:this.selectedTimeFrame,changeable:true};
    this.stableServiceService.addStableServiceBookingToCostumer(booking,this.selectedStableService);
    });

  }

  checkSelectedTime(): string{
    if(this.selectedTimeFrame == StableServiceBookingTimes.day){
      return "day";
    }else if(this.selectedTimeFrame == StableServiceBookingTimes.week){
      return "week";
    }else if(this.selectedTimeFrame == StableServiceBookingTimes.month){
      return "month";
    }
    return "";
  }
  setTime(event: MatDatepickerInputEvent<Date>){
    let value = event.value!;
    let date = new Date(value);
    this.selectedTime=date;

  }

  getLocalTime(time:any){
    return new Date(time).toLocaleDateString();

  }

  getCurrentWeek(){
    var curr = new Date; // get current date
    var first = curr.getDate() - curr.getDay()+1; // First day is the day of the month - the day of the week
    var last = first + 6; // last day is the first day + 6
    
    this.startOfWeek = new Date(curr.setDate(first)).toLocaleDateString();
    this.endOfWeek= new Date(curr.setDate(last)).toLocaleDateString();
  }

  getCurrentMonth(){
    this.currentMonth= this.today.toLocaleString('de-DE', { month: 'long' });
    console.log("month:"+this.currentMonth);
  }

  getServiceBookingsForToday(){
     this.todayBookings=this.selectedStableService.bookings.filter(booking=>
      new Date(booking.startTime).toLocaleDateString() == this.today.toLocaleDateString()
     )
  }
  getServiceBookingsForCurrentWeek(){
    this.currentWeekBookings=this.selectedStableService.bookings.filter(booking=>
      this.getWeekNumber(new Date(booking.startTime)) == this.getWeekNumber(this.today)
    )
 }

 getServiceBookingsForCurrentMonth(){
  this.currentMonthBookings=this.selectedStableService.bookings.filter(booking=>
    new Date(booking.startTime).getMonth() == this.today.getMonth() 
  )
}

 getBookingsForTabs(){
  this.getServiceBookingsForToday();
  this.getServiceBookingsForCurrentWeek();
  //this.getServiceBookingsForCurrentMonth();
 }

 getWeekNumber(date:Date){
  console.log(weekNumber(date))
  return weekNumber(date);

 }
 weekendFilter = (date: Date |null ): boolean => {
  if(date!= null){
    let dayDate = new Date(date);
    const day = (dayDate || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;

  }else{
    return true;
  }
  
  }

  deleteServiceBooking(booking:StableServiceBooking){
    this.stableServiceService.deleteBooking(this.selectedStableService,booking);

  }
  getBookingsOfUser(){
    return this.selectedStableService.bookings.filter(booking=> booking.costumer.user.id == this.user.id);

  }



  async ngOnInit() {
    //this.stableServiceService.deSelectStableServices();
   
    this.stableServiceList = this.stableServiceService.getStableServiceList();
      this.user = this.authService.getCurrentUser();
    this.costumer = this.costumerService.getCostumerInfoOfUser(this.user);
    this.isAdmin =this.costumerService.isCostumerAdmin(this.costumer[0]);
    this.selectedStableService =this.stableServiceService.getSelectedStableService(this.stableServiceList);
    this.costumerStableServiceBookings = this.getBookingsOfUser();
    this.timeRanges = this.selectedStableService.bookeableTimeRanges;
    console.log(this.timeRanges[0].valueOf());
    this.horseNameList = this.costumer[0].horses.map(horse=>horse.name);
    this.today = new Date();
    console.log("TODDAY:"+this.today.toLocaleDateString());
    this.getCurrentWeek();
    this.getCurrentMonth();
    this.getServiceBookingsForToday();
    //this.getServiceBookingsForCurrentMonth();
    





    
  }
}
