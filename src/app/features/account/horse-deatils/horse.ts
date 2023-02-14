import { Costumer } from "../profile-details/costumer";
import { ServiceProvider } from "./service-prrovider";

export interface Horse{
    id:string;
    name:string;
    breed:string
    vet:ServiceProvider;
    age:string;
    stable:string;
    image:string;
}
