import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NGXLogger } from 'ngx-logger';
import { Title } from '@angular/platform-browser';
import { NotificationService } from 'src/app/core/services/notification.service';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { getLocaleDateFormat } from '@angular/common';
import { DatePipe } from '@angular/common';
import { Facility } from '../facility/facility';
import { FacilityService } from 'src/app/core/services/facility.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-facilities-list',
  templateUrl: './facilities-list.component.html',
  styleUrls: ['./facilities-list.component.css']
})
export class FacilitiesListComponent implements OnInit {

  facilityList: Facility[];
  
  date : Date = this.getDate();
  dateInForm = new FormControl(new Date());
  listIsLoaded: boolean = false;

  getDate(){
    return new Date();
  }

  openFacility(facility: Facility){
    this.facilityService.resetFacilitySelection();
    this.facilityService.selectFacility(facility);
  }

  setFacilityTimes(){
    this.facilityList.forEach(facility => {
      if(facility.bookings!=undefined){
        this.facilityService.calculateTimeSlots(facility.bookings[0]);

      }
    })
  }

  @ViewChild(MatSort, { static: true })
  sort: MatSort = new MatSort;

  constructor(
    private logger: NGXLogger,
    private notificationService: NotificationService,
    private titleService: Title,
    public router: Router,
    private datePipe: DatePipe,
    private facilityService: FacilityService
  ) { }

  async ngOnInit() {

    let list:Observable<any> = await this.facilityService.getAllFacilities();
  list.subscribe(list=>{
    this.facilityList = list;
    this.facilityService.setFacilityList(list);
    this.facilityService.selectFacility(list);
    this.listIsLoaded=true;
    this.titleService.setTitle('Facilities');
    this.logger.log('Facility List loaded');
    this.setFacilityTimes();
    this.facilityService.resetFacilitySelection();
  });



    

  }
}
