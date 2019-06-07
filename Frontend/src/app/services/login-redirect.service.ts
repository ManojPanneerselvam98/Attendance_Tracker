import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { LogoutRedirectService } from './logout-redirect.service';

@Injectable()
export class LoginRedirect implements CanActivate {
    constructor(private auth: AuthService, private router: Router,private logout:LogoutRedirectService) {}
    canActivate(): boolean {
        if (localStorage.getItem('token')) {
            this.logout.showHeader = true;
            this.router.navigateByUrl('user/report');
            return false;
        }
        else {
            
            return true;
        }
    }
}