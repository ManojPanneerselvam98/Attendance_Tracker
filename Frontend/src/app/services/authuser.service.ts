import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthuserService implements CanActivate {

    constructor(private router: Router) { }
    canActivate(): boolean {
        if ((localStorage.getItem('token')) && (localStorage.getItem('role') == "User")) {
            return true;
        }
        else {
            //this.router.navigateByUrl('user/login');
            return false;
        }
    }
}
