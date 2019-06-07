import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthadminService implements CanActivate {

    constructor(private router: Router) { }
    canActivate(): boolean {
        if ((localStorage.getItem('token')) && (localStorage.getItem('role') == "admin" || localStorage.getItem('role') == "webadmin" || localStorage.getItem('role') == "posadmin")) {
            return true;
        }
        else {
            //this.router.navigateByUrl('user/login');
            return false;
        }
    }
}
