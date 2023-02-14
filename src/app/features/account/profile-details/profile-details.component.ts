import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { CostumerService } from 'src/app/core/services/costumer.service';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.css']
})
export class ProfileDetailsComponent implements OnInit {

  fullName: string = "";
  email: string = "";
  alias: string = "";
  firstName: string;
  lastName:string;
  contact: any;
  user:any;
  costumer:any;

  constructor(private authService: AuthenticationService, private costumerService:CostumerService ) { }

  ngOnInit() {
    
    
    this.contact = this.costumerService.getFieldCList()[0].contact;

    this.user = this.authService.getCurrentUser();
    this.costumer = this.costumerService.getCostumerInfoOfUser(this.user)[0];
    this.fullName = this.costumer.firstName+" "+this.costumer.lastName;
    this.firstName = this.costumer.firstName;
    this.lastName = this.costumer.lastName;
    this.email = this.user.email;
    this.contact = this.costumer.contact;
   
  }

}
