import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { environment } from '../../environments/environment';
import { Config } from '../../load.config';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    //console.log(Config.settings.serviceURL);
    // private BASE_URL: string = 'http://localhost:3000/api/auth';
    private BASE_URL: string = Config.settings.serviceURL + '/auth';
    private headers: Headers = new Headers({ 'Content-Type': 'application/json' });
    constructor(private http: Http) { }
    login(user: User): Promise<any> {
        let url: string = this.BASE_URL + '/login';
        return this.http.post(url, user, { headers: this.headers }).toPromise();
    }
    register(user: User): Promise<any> {
        let url: string = this.BASE_URL + '/register';
        return this.http.post(url, user, { headers: this.headers }).toPromise();
    }
    adminLogin(user: User): Promise<any> {
        let url: string = this.BASE_URL + '/admin/login';
        return this.http.post(url, user, { headers: this.headers }).toPromise();
    }
}