import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Config } from '../../load.config';
@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  
  url = Config.settings.serviceURL + '/auth/me';
  //url = 'http://localhost:3000/api/auth/me';
  token = localStorage.getItem('token');
  constructor(private http: Http) { }
    getUser(token){
      let headers = new Headers({ 'x-access-token': token });
      let options = new RequestOptions({ headers: headers });
      return this.http.get(this.url, options);
    }
}
