import { ServiceProviderType } from "./service-provider-enum";

export interface ServiceProvider{
    name:string;
    phoneNumber:string
    type: ServiceProviderType;
}