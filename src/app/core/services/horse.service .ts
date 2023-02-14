import { Injectable } from '@angular/core';
import { Horse } from 'src/app/features/account/horse-deatils/horse';
import { ServiceProviderType } from 'src/app/features/account/horse-deatils/service-provider-enum';
import { ServiceProvider } from 'src/app/features/account/horse-deatils/service-prrovider';
import { ContactDetails } from 'src/app/features/account/profile-details/contact-destails';
import { Costumer } from 'src/app/features/account/profile-details/costumer';
import { User } from '../guards/user';
import { UserType } from '../guards/user-type';
import { AuthenticationService } from './auth.service';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';

const ADMIN_AND_COSTUMER: UserType[] = [UserType.admin,UserType.costumer];
const COSTUMER: UserType[] = [UserType.admin,UserType.costumer];

const USER_LIST: User[]=[
    {uid: "1G6fo7LBGUh8NA8NBFRHEzFrlnt12NOPE",email:"test@mail",displayName:"Martina",photoURL:"url",emailVerified:true},
    {uid: "1G6fo7LBGUh8NA8NBFRHEzFrlnt1",email:"stamakirr@gmail.com",displayName:"test",photoURL:"url",emailVerified:true},
]



  @Injectable({
    providedIn: 'root'
})
export class HorseService {
constructor(private database: AngularFireDatabase) {
    this.horseRef = database.list(this.dbPath);
}

private dbPath = '/costumer';
horseRef: AngularFireList<Costumer>;

getHorsesOfCostumer(costumer:Costumer){
    return costumer.horses;
}

addHorseToCostumer(costumer:any,horse:Horse){

    horse.id = ((costumer.horses.length)+1).toString();
    costumer.horses.push(horse);
    this.horseRef.update(costumer.key,costumer);

}

deleteHorseToCostumer(costumer:any,horseToDelete:Horse){
    let newHorseList = costumer.horses.filter((horse:Horse)=>horse.id!=horseToDelete.id);
    costumer.horses = newHorseList;
    this.horseRef.update(costumer.key,costumer);
}

changeHorseOfCostumer(costumer:Costumer,changedHorse:Horse){
    let filtertedHorses = costumer.horses.filter(horse=> horse.id != changedHorse.id);
    filtertedHorses.push(changedHorse);
    //chnage when db and be is there
    costumer.horses = filtertedHorses;

}




}
