import { Injectable } from '@angular/core';
import { Horse } from 'src/app/features/account/horse-deatils/horse';
import { ServiceProviderType } from 'src/app/features/account/horse-deatils/service-provider-enum';
import { ServiceProvider } from 'src/app/features/account/horse-deatils/service-prrovider';
import { ContactDetails } from 'src/app/features/account/profile-details/contact-destails';
import { Costumer } from 'src/app/features/account/profile-details/costumer';
import { CostumerType } from 'src/app/features/account/profile-details/costumer-type-enum';
import { Facility } from 'src/app/features/facilities/facility/facility';
import { FacilityBooking } from 'src/app/features/facilities/facility/facility-booking';
import { FacilityTime, Times } from 'src/app/features/facilities/facility/facility-times';
import { User } from '@firebase/auth';
import { UserType } from '../guards/user-type';
import { AuthenticationService } from './auth.service';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { map, Observable } from 'rxjs';


const ADMIN_AND_COSTUMER: UserType[] = [UserType.admin,UserType.costumer];
const COSTUMER: UserType[] = [UserType.admin,UserType.costumer];



let vet: ServiceProvider = {name:"Härtel",phoneNumber:"+49156test65",type: ServiceProviderType.vet}

const CONTACT_EX: ContactDetails ={mobilePhone:"testMobile",homePhone:"",adress:"test"} 

let HORSE_LIST: Horse[]=[
    {id:"1",name:"Eowyn",vet:vet,age:"01.06.2014",stable:"Aktivstall",breed:"Ardenner",image:"/assets/images/eowyn.png"},
    {id:"2",name:"ToniText",vet:vet,age:"01.06.2014",stable:"Box",breed:"Murgese",image:"/assets/images/eowyn.png"},
]

const TIME_LIST: Times[]=[
    {slotsPerHour:2,dayHours:13},
    {slotsPerHour:1,dayHours:13},

]


let BOOKING_LIST_LH: FacilityBooking[]=[ 
   
]

let BOOKING_LIST_RP: FacilityBooking[]=[ 
]

let BOOKING_LIST_NH: FacilityBooking[]=[ 
]


let FACILITY_LIST: Facility[] = [
    { name: 'Longierhalle',image: "/assets/images/lhalle.png",display: true ,bookings: BOOKING_LIST_LH},
    { name: 'Roundpen',image: "/assets/images/round.png",display: true ,bookings: BOOKING_LIST_RP },
    { name: 'Neue Halle',image: "/assets/images/neueHalle.png",display: true ,bookings: BOOKING_LIST_NH }
  ];


  @Injectable({
    providedIn: 'root'
})
export class FacilityService {
constructor(private authService:AuthenticationService, private database: AngularFireDatabase) {
    this.facilityListeRef = database.list(this.dbPath);
}

private dbPath = '/facilities';
facilityListeRef: AngularFireList<Facility>;
facilityList:Facility[];
getFacilities(){
    return FACILITY_LIST;
}

createFacilities(){
    FACILITY_LIST.forEach(
        service => this.facilityListeRef.push(service)
      );

}

getAllFacilities(){
    return this.getFacilityListDB();
}

setFacilityList(list:any){
    this.facilityList = list ;
}

getFacilityListDB(): Observable<Facility[]> {
    return this.facilityListeRef.snapshotChanges().pipe(
      // finish the subscription after receiving the first value
      map((changes: any[]) => changes.map(c => 
          ({ key: c.payload.key, ...c.payload.val() })
        ).map((facility) => facility)
      ));
  }

generateTimeSlotNames(){
    let timeslots: string[] = [
        "09.00-09.30",
        "09.30-10.00",
        "10.00-10.30",
        "10.30-11.00",
        "11.00-11.30",
        "11.30-12.00",
        "12.00-12.30",
        "12.30-13.00",
        "13.00-13.30",
        "13.30-14.00",
        "14.00-14.30",
        "14.30-15.00",
        "15.00-15.30",
        "15.30-16.00",
        "16.00-16.30",
        "16.30-17.00",
        "17.00-17.30",
        "17.30-18.00",
        "18.00-18.30",
        "18.30-19.00",
        "19.00-19.30",
        "19.30-20.00",
        "20.00-20.30",
        "20.30-21.00",
        "21.00-21.30",
        "21.30-22.00"
    ];
    
    return timeslots;

}

getTimes(facility:Facility){
    return facility.bookings[0].timeSlot.timeSlots;
}

bookFacility(facility:any,booking:FacilityBooking){
    facility.bookings.push(booking);
    //add to Booking List change when BE there
    this.facilityListeRef.update(facility.key,facility);
}
selectFacility(selectedfacility: Facility){
    this.facilityList.forEach(
        facility =>{
            if(facility.name==selectedfacility.name){
                facility.display=false;
            }
        }
    );
}

getSelectedFacility(){
    return this.facilityList.filter(facility => facility.display == false)[0];
}

calculateTimeSlots(booking:FacilityBooking){
    return  booking.timeSlot.timesInfo.dayHours * booking.timeSlot.timesInfo.slotsPerHour;
   
}
resetFacilitySelection(){
    this.facilityList.forEach(facility => facility.display = true);
    FACILITY_LIST.forEach(facility => facility.display = true);
}

checkBooking(facility:Facility){
    if(facility.bookings!=undefined){
        facility.bookings.
        forEach(
            booking => this.setChangeable(booking),       
        );

    }
    
}

setChangeable(booking:FacilityBooking){
    const currentUser = this.authService.getCurrentUser();
    let costumerList:any = booking.costumer;
    if(costumerList[0].user.id == currentUser.id){
        booking.changeable = true;
    }else{booking.changeable = false;}
    

}

removeBookingFromFacility(facility:any,bookingToRemove:FacilityBooking){
    facility.bookings = facility.bookings.filter((booking:FacilityBooking) => booking !== bookingToRemove);
    //add to Booking List change when BE there
    this.facilityListeRef.update(facility.key,facility);
}
   

}
