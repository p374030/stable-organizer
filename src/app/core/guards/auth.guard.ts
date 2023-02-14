import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import * as moment from 'moment';
import { map, Observable, take, tap } from 'rxjs';

import { AuthenticationService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router,
        private notificationService: NotificationService,
        private authService: AuthenticationService) { }

    
    canActivate(): Observable<boolean> {
            return this.authService.authState
              .pipe(
                   map(authState => !!authState),
                   tap((auth: any) => !auth ?  this.router.navigate(['auth/login']): true),
                   take(1)
               );
          }

    canActivateOld() {
        const user = this.authService.getCurrentUser();

        if (user && user.expiration) {

            if (moment() < moment(user.expiration)) {
                return true;
            } else {
                this.notificationService.openSnackBar('Your session has expired');
                this.router.navigate(['auth/login']);
                return false;
            }
        }

        this.router.navigate(['auth/login']);
        return false;
    }
}
