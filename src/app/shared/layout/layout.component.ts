import { Component, OnInit, ChangeDetectorRef, OnDestroy, AfterViewInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Observable, timer } from 'rxjs';
import { Subscription } from 'rxjs';
import { faHorseHead } from '@fortawesome/free-solid-svg-icons';
import { User } from '@firebase/auth';
 import { AuthenticationService } from 'src/app/core/services/auth.service';
import { SpinnerService } from '../../core/services/spinner.service';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { CostumerService } from 'src/app/core/services/costumer.service';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Costumer } from 'src/app/features/account/profile-details/costumer';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit, OnDestroy, AfterViewInit {

    private _mobileQueryListener: () => void;
    mobileQuery: MediaQueryList;
    showSpinner: boolean = false;
    userName: string = "";
    isAdmin: Boolean = false;
    faHorse = faHorseHead;
    isFullyCreated: boolean = false;
    user: User;
    loginForm!: UntypedFormGroup;
    costumerList: Costumer[];
    

    private autoLogoutSubscription: Subscription = new Subscription;

    constructor(private changeDetectorRef: ChangeDetectorRef,
        private media: MediaMatcher,
        public spinnerService: SpinnerService,
        private authService: AuthenticationService,
        private costumerService:CostumerService,
        private router: Router,
        private authGuard: AuthGuard) {

        this.mobileQuery = this.media.matchMedia('(max-width: 1000px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        // tslint:disable-next-line: deprecation
        this.mobileQuery.addListener(this._mobileQueryListener);
        this.createForm();
    }
    private createForm() {
        const savedUserEmail = localStorage.getItem('savedUserEmail');

        this.loginForm = new UntypedFormGroup({
            firstName: new UntypedFormControl('', Validators.required),
            lastName: new UntypedFormControl('', Validators.required)
        });
    }

    async ngOnInit(): Promise<void> {
        this.user = this.authService.getCurrentUser();
        let list:Observable<any> = await this.costumerService.getCustomerList();
        list.subscribe(list=> {
            this.costumerList = list
            this.isFullyCreated =this.costumerService.isUserCreated(this.user,this.costumerList)
            this.costumerService.setCustomerList(list);
            this.isAdmin = this.costumerService.isCostumerAdmin(this.costumerService.getCostumerInfoOfUser(this.user));
           

       // this.isAdmin = user.isAdmin;
        this.userName = this.user.uid;

        
        
       

        // Auto log-out subscription
        const timer$ = timer(2000, 5000);
        this.autoLogoutSubscription = timer$.subscribe(() => {
            this.authGuard.canActivate();
        });
        }
        )
       
        

    }

    ngOnDestroy(): void {
        // tslint:disable-next-line: deprecation
        this.mobileQuery.removeListener(this._mobileQueryListener);
        this.autoLogoutSubscription.unsubscribe();
    }

    ngAfterViewInit(): void {
        this.changeDetectorRef.detectChanges();
        this.ngOnInit();
       
    }

    createCustomer(){
        this.costumerService.createCostumerByFirstLogin(this.user,this.loginForm.get('firstName')?.value,this.loginForm.get('lastName')?.value);
        this.isFullyCreated = true;
        this.router.navigate(['/profile']);


    }

}
