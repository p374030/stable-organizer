import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { StableServiceRoutingModule } from './stableService-routing.module';
import { StableServiceListComponent } from './stableService-list/stableSerive-list.component';
import { StableServiceComponent } from './stableService-list/stableService/stableSerive.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';

@NgModule({
    imports: [
        CommonModule,
        StableServiceRoutingModule,
        SharedModule
    ],
    declarations: [
        StableServiceListComponent,
        StableServiceComponent
    ],
    providers:[
        {provide: MAT_DATE_LOCALE, useValue: 'de-DE'},
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
          },
          {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},

    ]
})
export class StableServiceModule { }
