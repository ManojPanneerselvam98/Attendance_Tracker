import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { environment } from '../../../environments/environment';
import { Config } from '../../../load.config';

@Injectable({
  providedIn: 'root'
})
export class AbsentService {
  //url = environment.apiUrl + '/admin/absent/';
  url = Config.settings.serviceURL + '/admin/absent/';
  token = localStorage.getItem('token');
  constructor(private http: Http) { }
  getAbsentReport() {
    let headers = new Headers({ 'x-access-token': this.token });
    let options = new RequestOptions({ headers: headers });
    return this.http.get(this.url, options);
  }
  putAbsentReport(value) {
    let headers = new Headers({ 'x-access-token': this.token });
    let options = new RequestOptions({ headers: headers });
    return this.http.put(this.url, value, options);
  }

}
