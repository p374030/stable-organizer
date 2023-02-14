import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacilitiesRoutingModule } from './facilities-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FacilitiesListComponent } from './facilities-list/facilities-list.component';
import { FacilityComponent } from './facility/facility.component';

@NgModule({
    imports: [
        CommonModule,
        FacilitiesRoutingModule,
        SharedModule
    ],
    declarations: [
        FacilitiesListComponent,
        FacilityComponent
    ],
    providers: [
        { provide: LOCALE_ID, useValue: 'fr-FR'},
      ]
})
export class FacilitiesModule { }
