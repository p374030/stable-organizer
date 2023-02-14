import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/core/services/notification.service';
import { Title } from '@angular/platform-browser';
import { NGXLogger } from 'ngx-logger';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { User } from 'src/app/core/guards/user';
import { CostumerService } from 'src/app/core/services/costumer.service';
import { Costumer } from '../../account/profile-details/costumer';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css']
})
export class DashboardHomeComponent implements OnInit {
  currentUser: User;
  costumer:any;

  constructor(private notificationService: NotificationService,
    private authService: AuthenticationService,
    private costumerService:CostumerService,
    private titleService: Title,
    private logger: NGXLogger) {
  }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.costumer = this.costumerService.getCostumerInfoOfUser(this.currentUser);
    console.log(this.currentUser);
    this.titleService.setTitle('angular-material-template - Dashboard');
    this.logger.log('Dashboard loaded');

    setTimeout(() => {
      this.notificationService.openSnackBar('Welcome!');
    });
  }
}
