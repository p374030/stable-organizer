import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { NGXLogger } from 'ngx-logger';
import { CostumerService } from 'src/app/core/services/costumer.service';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  constructor(
    private logger: NGXLogger,
    private notificationService: NotificationService,
    private titleService: Title,
    private costumerService: CostumerService
  ) { }

  costumerList:any;

  ngOnInit() {
    this.titleService.setTitle('angular-material-template - Users');
    this.logger.log('Users loaded');
    this.costumerList =this.costumerService.getFieldCList();
  }
}
