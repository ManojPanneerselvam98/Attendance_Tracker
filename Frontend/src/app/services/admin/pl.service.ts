import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { environment } from '../../../environments/environment';
import { Config } from '../../../load.config';

@Injectable({
  providedIn: 'root'
})
export class PlService {
  //url = environment.apiUrl + '/admin/pl/';
  url = Config.settings.serviceURL + '/admin/pl/';
  urlHoliday = Config.settings.serviceURL + '/admin/hl/';
  urlPlannedLeave = Config.settings.serviceURL + '/admin/plannedleave/';
  token = localStorage.getItem('token');
  constructor(private http: Http) { }

  postPL(value) {
    let headers = new Headers({ 'x-access-token': this.token });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.urlPlannedLeave, value, options);
  }

  putPL(value) {
    let headers = new Headers({ 'x-access-token': this.token });
    let options = new RequestOptions({ headers: headers });
    return this.http.put(this.url, value, options);
  }

  putHolidayDay(value) {
    console.log(value)
    let headers = new Headers({ 'x-access-token': this.token });
    let options = new RequestOptions({ headers: headers });
    return this.http.put(this.urlHoliday, value, options);
  }

  cancelPL(value) {
    let headers = new Headers({ 'x-access-token': this.token });
    let options = new RequestOptions({ headers: headers });
    return this.http.delete(this.urlPlannedLeave+value, options);
  }

  getPL() {
    let headers = new Headers({ 'x-access-token': this.token });
    let options = new RequestOptions({ headers: headers });
    return this.http.get(this.urlPlannedLeave, options);
  }

  getPLReportMonth(data) {
    //console.log(data)
    let headers = new Headers({ 'x-access-token': this.token });
    let options = new RequestOptions({ headers: headers });
    return this.http.get(this.urlPlannedLeave+'prevreport/?month='+data.month+'&year='+data.year, options);
}
}
