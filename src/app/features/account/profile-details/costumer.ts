import { UserType } from "src/app/core/guards/user-type";
import { Horse } from "../horse-deatils/horse";
import { ContactDetails } from "./contact-destails";
import { CostumerType } from "./costumer-type-enum";
import { User } from '@firebase/auth';


export interface Costumer{
    firstName:string;
    lastName:string;
    user:any;
    contact:ContactDetails;
    horses:Horse[];
    costumerType: CostumerType;
    horseSharingList:string[];//userId
    userTypes: UserType[];

}
