import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { map, Observable, take } from 'rxjs';
import { Horse } from 'src/app/features/account/horse-deatils/horse';
import { ServiceProviderType } from 'src/app/features/account/horse-deatils/service-provider-enum';
import { ServiceProvider } from 'src/app/features/account/horse-deatils/service-prrovider';
import { ContactDetails } from 'src/app/features/account/profile-details/contact-destails';
import { Costumer } from 'src/app/features/account/profile-details/costumer';
import { CostumerType } from 'src/app/features/account/profile-details/costumer-type-enum';
import { User } from '@firebase/auth';
import { UserType } from '../guards/user-type';
import { HorseService } from './horse.service ';

const ADMIN_AND_COSTUMER: UserType[] = [UserType.admin,UserType.costumer];
const COSTUMER: UserType[] = [UserType.costumer];


let vet: ServiceProvider = {name:"Härtel",phoneNumber:"+49156test65",type: ServiceProviderType.vet}

const CONTACT_EX: ContactDetails ={mobilePhone:"testMobile",homePhone:"",adress:"test"} 

let HORSE_LIST: Horse[]=[
    {id:"1",name:"Eowyn",vet:vet,age:"01.06.2014",stable:"Aktivstall",breed:"Ardenner",image:"/assets/images/eowyn.png"},
    {id:"2",name:"ToniText",vet:vet,age:"01.06.2014",stable:"Box",breed:"Murgese",image:"/assets/images/eowyn.png"},
]



  @Injectable({
    providedIn: 'root'
})
export class CostumerService {
costumersRef: AngularFireList<Costumer>;

constructor(
            private horseService: HorseService,
            private database: AngularFireDatabase) {

                this.costumersRef = database.list(this.dbPath);

            }

horseOfCostumer:Horse[];
private dbPath = '/costumer';
private customerList:Costumer[];

getCostumerInfoOfUser(user:any) :any{
   //implement when BE there here is just a mock
   let returnList: Costumer[] = [];
    this.customerList.forEach(c =>{
        console.log("CustomerIDForService"+c.user.id+" "+c.user.email);
        if(c.user.id == user.id){
            returnList.push(c);
        }
    });
 return returnList;

}

resetCurrentCustomer(){
    this.customerList = [];
}

isCostumerAdmin(costumer:Costumer):Boolean{
    let cTypes = costumer.userTypes;
    let isAdmin:boolean =false;

    let type =cTypes.filter(cType=> cType == UserType.admin);

    if(type.length>0){
        return true;
    }else{
        return false;
    }

}

createCostumerByFirstLogin(user:any,firstName:string,lastName:string){
    
    this.costumersRef.valueChanges().subscribe(list=> {
        this.customerList = list;
        console.log("ValueChangees"+this.customerList);
        let isUserThere = this.customerList.filter(customer=> customer.user.id == user.id);
   console.log("userThere:"+isUserThere);
   if(isUserThere.length<=0){
    console.log("Create that shit !");
    let newCustomer: Costumer =this.createUserFromRegistration(firstName,lastName,user)
    this.costumersRef.push(newCustomer);
    return true;
   }else{
    console.log("IS THERE !");
    return false;
   }
    }
    )
   
}


isUserCreated(user:any,list:Costumer[]): any{

    let mapedCustomer = list.filter(costumer=> costumer.user.id == user.id);

    
   if(mapedCustomer.length<=0){
   return false;
   }else{
    return true;
   }
    
    
   
}



getCustomerList(): Observable<Costumer[]> {
    return this.costumersRef.snapshotChanges().pipe(
      // finish the subscription after receiving the first value
      map((changes: any[]) => changes.map(c => 
          ({ key: c.payload.key, ...c.payload.val() })
        ).map((customer) => customer)
      ));
  }

  setCustomerList(list:any){
    this.customerList = list;
  }

  getFieldCList(){
    return this.customerList;
  }



private createUserFromRegistration(firstName:string,lastName:string,user:User) :Costumer{

    return {firstName:firstName,lastName:lastName,user:user,contact:{adress:"",homePhone:"",mobilePhone:""},horses:[{id:"",name:"",vet:vet,age:"",stable:"",breed:"",image:""}],costumerType:CostumerType.owner
    ,horseSharingList:[""]
    ,userTypes:[UserType.costumer]}
;
   
}
}
