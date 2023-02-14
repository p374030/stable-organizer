import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { User } from 'src/app/core/guards/user';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { CostumerService } from 'src/app/core/services/costumer.service';
import { HorseService } from 'src/app/core/services/horse.service ';
import { Costumer } from '../profile-details/costumer';
import { Horse } from './horse';
import { ServiceProviderType } from './service-provider-enum';
import { ServiceProvider } from './service-prrovider';
import { Router } from '@angular/router';

@Component({
  selector: 'horse-profile-details',
  templateUrl: './horse-details.component.html',
  styleUrls: ['./horse-details.component.css']
})
export class HorseDetailsComponent implements OnInit {

  fullName: string = "";
  email: string = "";
  alias: string = "";
  horses:Horse[];
  costumer:any;
  user: User;
  horseSharingStringList:string[];
  horseSharingList:Costumer[] = [];
  addNewHorseCardShown:boolean =false;
  enabled = false;
  changeModeOff:boolean = true;
  newHorseNameInput = new FormControl({value:'',disabled: false});
  newHorseBreedInput = new FormControl({value:'',disabled: false});
  newHorseStableInput = new FormControl({value:'',disabled: false});
  newHorseBirthdayInput = new FormControl({value:'',disabled: false});
  newHorseShareInput = new FormControl({value:'',disabled: false});
  newHorseVetInput = new FormControl({value:'',disabled: false});
  newHorseVetPhoneInput = new FormControl({value:'',disabled: false});
  currentHorseId: string = "";
  changeHorse: Horse;
  thereWasAChange: boolean = false;
 
  
  getUrl(){
    return this.horses[0].image;
  }

  addHorse(){
    this.addNewHorseCardShown = false;
    const horseName:string =this.newHorseNameInput.value!;
    const horseBreed:string =this.newHorseBreedInput.value!;
    const horseStable:string =this.newHorseStableInput.value!;
    const horseBirthday:string =this.newHorseBirthdayInput.value!;
    const horseVet: ServiceProvider = {name:this.newHorseVetInput.value!,phoneNumber:this.newHorseVetPhoneInput.value!,type:ServiceProviderType.vet};
    const newHorse: Horse = {id:"",name:horseName,breed:horseBreed,stable:horseStable,age:horseBirthday,image:"",vet:horseVet};
    this.horseService.addHorseToCostumer(this.costumer,newHorse);
    this.resetInputFields();
    console.log("Horse added.")
  }

  editHorse(horseId:string){
    this.currentHorseId = horseId;
    this.changeHorse = this.getHorseFromHorseList(this.currentHorseId);
    this.changeModeOff = false;
    this.enabled = true;
    this.newHorseNameInput.enable();
    this.newHorseBreedInput.enable();
    this.newHorseStableInput.enable();
    this.newHorseShareInput.disable();
    this.newHorseVetInput.enable();
    this.newHorseVetPhoneInput.enable();
    console.log("Horse chanhged");
  }

  getHorseFromHorseList(horseId:string) : Horse{
    return this.horses.filter(horse => horse.id == horseId)[0];

  }

  saveEditedHorse(horseId:string){
    this.changeModeOff = true;
    this.enabled = false;
    const changeHorse: Horse = this.createEditedHorse(horseId);
    this.horseService.changeHorseOfCostumer(this.costumer,changeHorse);
    this.horses = this.horseService.getHorsesOfCostumer(this.costumer);
    this.changeHorseShare();
    this.resetInputFields();
    this.currentHorseId ="";
  }

  resetInputFields(){
    this.newHorseNameInput.reset();
    this.newHorseBreedInput.reset();
    this.newHorseStableInput.reset();
    this.newHorseShareInput.reset();
    this.newHorseVetInput.reset();
    this.newHorseVetPhoneInput.reset();
    this.newHorseBirthdayInput.reset();

  }

  changeHorseShare(){
    let share = this.newHorseShareInput.value;
    console.log(share)
  }

  createEditedHorse(horseId:string):Horse{
    
    let oldHorse = this.horses.filter(horse=> horse.id == horseId)[0];
    const horseVet: ServiceProvider = {name:this.newHorseVetInput.value !,phoneNumber:this.newHorseVetPhoneInput.value !,type:ServiceProviderType.vet};
   
    let horse:Horse = {
      id: horseId,
      name: this.newHorseNameInput.value !,
      age: this.newHorseBirthdayInput.value !,
      stable:this.newHorseStableInput.value !,
      vet: horseVet,
      breed: this.newHorseBreedInput.value !,
      image:oldHorse.image
    };

    
    return this.checkIfChangedValueIsEmpty(oldHorse,horse);



  }

  checkIfChangedValueIsEmpty(oldHorse:Horse,changedHorse:Horse) :Horse{
    const keys = Object.keys(changedHorse);
    let values ;
    let value ;
    let vet:ServiceProvider ;

    keys.forEach(
      () => 
      values = keys.map(
        key => {
          value = `${Reflect.get(changedHorse,key)}`;
          if(key == "vet"){
            vet = Reflect.get(changedHorse,key)!;
            if(vet.name ==""){
              Reflect.set(changedHorse,key,Reflect.get(oldHorse,key));
            }
            if(vet.phoneNumber ==""){
              Reflect.set(changedHorse,key,Reflect.get(oldHorse,key));
            }

          }
          else{if(`${Reflect.get(changedHorse,key)}` == ""){
            console.log("emptyString");
            `${Reflect.set(changedHorse,key,`${Reflect.get(oldHorse,key)}`)}`
          }
          else{
            console.log("yippi")
          }}
          
          
          
      }
        
        
       )
    )
     
    

    return changedHorse;
    
    
  }

  showAddNewHorseCard(){
    this.addNewHorseCardShown = true;
  }

  deleteHorse(horse:Horse){
    this.horseService.deleteHorseToCostumer(this.costumer,horse);
    this.router.navigate([this.router.url]);
    this.horses = this.horseService.getHorsesOfCostumer(this.costumer);

  }

  getCostumersFromHorseSharing(){
    let cusList = this.costumerService.getFieldCList()
    if(this.horseSharingStringList.length>=1&&this.horseSharingStringList[0] !=""){
      this.horseSharingStringList.forEach(string=>{
        this.horseSharingList.push(cusList.filter(cus=> cus.user.id)[0]);
       });

    }else{
      this.horseSharingList = [];
    }
   
  }


  constructor(private authService: AuthenticationService,
    private horseService: HorseService,
    private costumerService: CostumerService,
    public router: Router) { }

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    this.costumer = this.costumerService.getCostumerInfoOfUser(this.user)[0];
    this.fullName = this.costumer.firstName+" "+this.costumer.lastName;
    this.email = this.user.email;
    this.horseSharingStringList= this.costumer.horseSharingList
    this.getCostumersFromHorseSharing();
    this.horses = this.horseService.getHorsesOfCostumer(this.costumer);
  }

}
