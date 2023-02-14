import { Injectable, Inject, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, map } from 'rxjs/operators';
import * as moment from 'moment';
import { User } from '../guards/user';
import {
    AngularFirestore,
    AngularFirestoreDocument,
  } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { environment } from '../../../environments/environment';
import { of, EMPTY } from 'rxjs';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserType } from '../guards/user-type';
import { CostumerService } from './costumer.service';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    userData: any;

    constructor(private http: HttpClient,
        @Inject('LOCALSTORAGE') private localStorage: Storage,
        public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public costumerService:CostumerService,
    public router: Router,
    public ngZone: NgZone // NgZone service to remove outside scope warning
        ) {

            /* Saving user data in localstorage when 
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe((user) => {
        if (user) {
          this.userData = user;
          localStorage.setItem('user', JSON.stringify(this.userData));
          JSON.parse(localStorage.getItem('user')!);
        } else {
          localStorage.setItem('user', 'null');
          JSON.parse(localStorage.getItem('user')!);
        }
      });
    }

    // Sign in with email/password
  login(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.SetUserData(result.user);
        this.afAuth.authState.subscribe((user) => {
          if (user) {
            this.router.navigate(['dashboard']);
          }else{
            this.router.navigate(['auth/login']);
          }
        });
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  register(email:string,password:string,firstName:string,lastName:string){
    
    const registeredUser = this.afAuth.createUserWithEmailAndPassword(email,password);
   //return this.costumerService.createCostumerForRegistration(firstName,lastName,registeredUser);
    

  }
  

  SetUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };

    this.localStorage.setItem('currentUser', JSON.stringify({
        token: userData.uid,
        isAdmin: true,
        email: userData.email,
        id: userData.uid,
        alias: userData.email.split('@')[0],
        expiration: moment().add(1, 'days').toDate(),
        fullName: userData.displayName
    }));
    return userRef.set(userData, {
      merge: true,
    });
  }

    loginOld(email: string, password: string) {
        return of(true)
            .pipe(delay(1000),
                map((/*response*/) => {
                    // set token property
                    // const decodedToken = jwt_decode(response['token']);

                    // store email and jwt token in local storage to keep user logged in between page refreshes
                    this.localStorage.setItem('currentUser', JSON.stringify({
                        token: 'aisdnaksjdn,axmnczm',
                        isAdmin: true,
                        email: 'john.doe@gmail.com',
                        id: '12312323232',
                        alias: 'john.doe@gmail.com'.split('@')[0],
                        expiration: moment().add(1, 'days').toDate(),
                        fullName: 'John Doe'
                    }));

                    return true;
                }));
    }

    logout() {
        // clear token remove user from local storage to log user out
        this.localStorage.removeItem('currentUser');
        return this.afAuth.signOut().then(() => {
          localStorage.removeItem('user');
          this.router.navigate(['sign-in']);
        });
    }

    getCurrentUser(): any {
        // TODO: Enable after implementation
        // return JSON.parse(this.localStorage.getItem('currentUser'));

       const userJson = this.localStorage.getItem('currentUser');
      const user: User =JSON.parse(localStorage.getItem('currentUser')!);
        return user;
    }

    getCurrentUserId(): any {
      // TODO: Enable after implementation
      // return JSON.parse(this.localStorage.getItem('currentUser'));
      this.afAuth.authState.subscribe((user) => {
        return user?.uid;
      });
  }

  getCurrentUserType(): UserType{
    const user = this.getCurrentUser();
    return user.UserType;
  }

    passwordResetRequest(email: string) {
        return of(true).pipe(delay(1000));
    }

    changePassword(email: string, currentPwd: string, newPwd: string) {
        return of(true).pipe(delay(1000));
    }

    passwordReset(email: string, token: string, password: string, confirmPassword: string): any {
        return of(true).pipe(delay(1000));
    }

    get authState(): Observable<any> {
      return this.afAuth.authState;
    }
}
