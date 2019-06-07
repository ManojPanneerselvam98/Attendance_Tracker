import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
@Injectable({
    providedIn: 'root'
})
export class LogoutRedirectService {

    showHeader;
    constructor(
        private router: Router
    ) { }

    logout() {

        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('user');
        this.router.navigate(['admin/login']);
        this.showHeader = false;
       // location.reload();
    }
}


