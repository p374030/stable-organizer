import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { NGXLogger } from 'ngx-logger';
import { Title } from '@angular/platform-browser';
import { NotificationService } from 'src/app/core/services/notification.service';
import { Router } from '@angular/router';
import { FacilityService } from 'src/app/core/services/facility.service';
import { Facility } from './facility';
import { FacilityBooking} from './facility-booking';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { FormBuilder, FormControl} from '@angular/forms';
import { FacilityTime } from './facility-times';
import { User } from '@firebase/auth';
import { Costumer } from '../../account/profile-details/costumer';
import { CostumerService } from 'src/app/core/services/costumer.service';

@Component({
  selector: 'app-facility',
  templateUrl: './facility.component.html',
  styleUrls: ['./facility.component.css']
})
export class FacilityComponent implements OnInit {
  display : boolean = true;
  facility: any;
  newBooking: FacilityBooking;
  maxBookings: number;
  disableSelect = new FormControl(false);
  times : string[];
  selectedTime: string ="";
  horseInput = new FormControl('');
  user : User;
  costumer:Costumer;
  timeBookable:boolean = false;
  

  @ViewChild(MatSort, { static: true })
  sort: MatSort = new MatSort;


  displayedColumns: string[] = ['timeSlot','user',  'horse', 'time'];

  setupBookings(){
    let setupBookings:FacilityBooking[] = this.facility.bookings;
    if(setupBookings!=undefined){
      setupBookings.forEach(booking => booking.timeSlot.timeSlots = this.facilityService.calculateTimeSlots(booking));
    this.facility.bookings = setupBookings;

    }
    
  }
  
 
  bookTime(){
    console.log("time:"+this.selectedTime);
    console.log("horse"+this.horseInput.value);
    const horseName = this.horseInput.value !;
    console.log("user"+this.user.email);
    //create Time and booking
    if(this.facility.bookings==undefined){
      this.facility.bookings = [{costumer:this.costumer,horse:"test",changeable:true,time:"time",
    timeSlot:{timeSlots:2,isBooked:true,slotName:this.selectedTime,timesInfo:{slotsPerHour:2,dayHours:13}}}];
    }
    const bookingTimeSlot: FacilityTime = {slotName:this.selectedTime,isBooked:true,timesInfo:this.facility.bookings[0].timeSlot.timesInfo,timeSlots:this.facility.bookings[0].timeSlot.timeSlots}
    const newBooking: FacilityBooking = {costumer:this.costumer, horse: horseName, timeSlot: bookingTimeSlot,time:this.selectedTime,changeable:true };
    this.facilityService.bookFacility(this.facility,newBooking);
    this.selectedTime = '';
  }
 

  checkUsedTimesSlot(time:string) :boolean{
    //{user:USER_LIST[0],horse:'horse',timeSlot:FACILITY_TIME_LIST_LH[0],time:'time',changeable: true},
    //{timesInfo: TIME_LIST[0],timeSlots:0,isBooked: true,slotName:"09.00-09.30"},
    //{timesInfo: TIME_LIST[0],timeSlots:0,isBooked: true,slotName:"09.30-10.00"},
    //{timesInfo: TIME_LIST[1],timeSlots:0,isBooked: true,slotName:"10.00-10.30"}

   let isBooked: boolean = false;
   if(this.facility.bookings!=undefined){
    if(time == this.facility.bookings.find((booking:FacilityBooking)=> booking.timeSlot.slotName == time)?.timeSlot.slotName){
      isBooked = true;
     }

   }
   
    return isBooked;
  }
  
  timeIsIn(bookings:any,time:string) {
    return bookings.timeSlot === time;
  }

  deleteBooking(booking:FacilityBooking){
    this.facilityService.removeBookingFromFacility(this.facility,booking);
  }
  

  constructor(
    private logger: NGXLogger,
    private notificationService: NotificationService,
    private titleService: Title,
    public router: Router,
    private facilityService: FacilityService,
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    private costumerService:CostumerService
  ) { }

  ngOnInit() {
    this.titleService.setTitle('Zeiten buchen');
    this.logger.log('Facility loaded');
    this.facility = this.facilityService.getSelectedFacility();
    this.setupBookings();
    this.facilityService.checkBooking(this.facility);
    this.maxBookings = 7;
    this.times = this.facilityService.generateTimeSlotNames();
    this.user = JSON.parse(localStorage.getItem('currentUser')!);
    this.costumer = this.costumerService.getCostumerInfoOfUser(this.user);
    console.log("costumer there");
  }
  

}

