import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { HorseService } from 'src/app/core/services/horse.service ';

@Component({
  selector: 'app-account-page',
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.css']
})
export class AccountPageComponent implements OnInit {

  constructor(private titleService: Title,
              private horseService:HorseService) { }


  

  ngOnInit() {
    this.titleService.setTitle('angular-material-template - Account');
  }

}
