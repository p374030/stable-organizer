import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { StableServiceService } from 'src/app/core/services/stableService.service';
import { StableSerive } from './stableService/stableService';




@Component({
  selector: 'app-stableSerive-list',
  templateUrl: './stableSerive-list.component.html',
  styleUrls: ['./stableSerive-list.component.css']
})
export class StableServiceListComponent implements OnInit {
  stableServiceList: StableSerive[];
  range = new FormGroup({
  start: new FormControl<Date | null>(null),
  end: new FormControl<Date | null>(null),
  });

  constructor(private stableServiceService:StableServiceService
    ) { }
    listIsLoaded: boolean=false;
    showStableService(stableSerive: StableSerive){
      this.hideAllStableServices();
      stableSerive.display = true;

    }

    hideAllStableServices(){
      this.stableServiceList.map((stableService: { display: boolean; }) => stableService.display = false);
    }

  async ngOnInit() {

    let list:Observable<any> = await this.stableServiceService.getAllStableServices();
  list.subscribe(list=>{
    this.stableServiceList = list;
    this.stableServiceService.setStableServiceList(list);
    this.listIsLoaded=true;
    this.stableServiceService.deSelectStableServices(this.stableServiceList);
    console.log("deselect");

  });

  }
}
