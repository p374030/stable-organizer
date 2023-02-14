import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { map, Observable } from 'rxjs';
import { Costumer } from 'src/app/features/account/profile-details/costumer';
import { StableServiceBookingTimes } from 'src/app/features/stableServices/stableService-list/stableService/booking-time-enum';
import { StableSerive } from 'src/app/features/stableServices/stableService-list/stableService/stableService';
import { StableServiceBooking } from 'src/app/features/stableServices/stableService-list/stableService/stableService-booking';
import { AuthenticationService } from './auth.service';
import { CostumerService } from './costumer.service';

const TIME_RANGES:StableServiceBookingTimes[] = [StableServiceBookingTimes.day,StableServiceBookingTimes.week];


  @Injectable({
    providedIn: 'root'
})
export class StableServiceService {
constructor(private authService:AuthenticationService,
  private database: AngularFireDatabase,
  private costumerService:CostumerService,) {
    this.stabelServiceRef = database.list(this.dbPath);
  }

private dbPath = '/stableService';
stabelServiceRef: AngularFireList<StableSerive>;
consumer:Costumer = this.getCostumer();
dateFühranlage:Date = new Date();
dateKoppel:Date = new Date();
stableServiceList: StableSerive[];

BOOKINGS_Führanlage_LIST:StableServiceBooking[]=[{costumer:this.consumer,horse:"Eowyn",startTime:this.dateFühranlage,time:StableServiceBookingTimes.day,changeable:false}]
BOOKINGS_Koppel_LIST:StableServiceBooking[]=[{costumer:this.consumer,horse:"Faramir",startTime:this.dateKoppel,time:StableServiceBookingTimes.day,changeable:false}]

STABLE_SERVICE_LIST:StableSerive[] = [
    {name:"Führanlage",image: "/assets/images/fanlage.png",display:false,bookeableTimeRanges:TIME_RANGES,bookings:this.BOOKINGS_Führanlage_LIST},{
    name:"Koppel",image: "/assets/images/koppel.png",display:false,bookeableTimeRanges:TIME_RANGES,bookings:this.BOOKINGS_Koppel_LIST}];


    async getAllStableServices(){

      return this.getStableServiceListDB();
}
    

getStableServiceListDB(): Observable<StableSerive[]> {
  return this.stabelServiceRef.snapshotChanges().pipe(
    // finish the subscription after receiving the first value
    map((changes: any[]) => changes.map(c => 
        ({ key: c.payload.key, ...c.payload.val() })
      ).map((stableService) => stableService)
    ));
}

setStableServiceList(list:any){
  this.stableServiceList = list;
}
getStableServiceList(){
  return this.stableServiceList;
}

createStableService(){
  this.STABLE_SERVICE_LIST.forEach(
    service => this.stabelServiceRef.push(service)
  );
}

getSelectedStableService(stableServiceList:StableSerive[]):StableSerive{

  return stableServiceList.filter(stableService => stableService.display==true)[0];

}

deSelectStableServices(stableServiceList:StableSerive[]){
  stableServiceList.forEach(stableService=>
    stableService.display=false

  )

}

deleteBooking(selectedStableService:any,toDeleteBooking:any){
  selectedStableService.bookings = selectedStableService.bookings.filter((booking:StableServiceBooking)=>booking != toDeleteBooking);
  this.stabelServiceRef.update(selectedStableService.key,selectedStableService);

}

getCostumer():Costumer{
  return this.costumerService.getCostumerInfoOfUser(this.authService.getCurrentUser());
}

addStableServiceBookingToCostumer(booking:StableServiceBooking,stableSerive:any){
  if(stableSerive.bookings== undefined){
    stableSerive.bookings=[];
    stableSerive.bookings.push(booking);
  }else{
    stableSerive.bookings.push(booking);

  }
  //stableSerive.display=false;
  this.stabelServiceRef.update(stableSerive.key,stableSerive);
  stableSerive.bookings.push(booking);
}



}







