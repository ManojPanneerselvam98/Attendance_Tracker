import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { environment } from '../../../environments/environment';
import { Config } from '../../../load.config';

@Injectable({
  providedIn: 'root'
})
export class HolidayService {

   //url = environment.apiUrl + '/admin/holiday/';
   url = Config.settings.serviceURL + '/admin/holiday/';
   token = localStorage.getItem('token');
   constructor(private http: Http) { }
 
 
   postHoliday(value) {
     let headers = new Headers({ 'x-access-token': this.token });
     let options = new RequestOptions({ headers: headers });
     return this.http.post(this.url, value, options);
   }

   getHoliday() {
    let headers = new Headers({ 'x-access-token': this.token });
    let options = new RequestOptions({ headers: headers });
    return this.http.get(this.url, options);
  }

  cancelHoliday(value) {
    let headers = new Headers({ 'x-access-token': this.token });
    let options = new RequestOptions({ headers: headers });
    return this.http.delete(this.url+value, options);
  }
  getHLReportMonth(data) {
    //console.log(data)
    let headers = new Headers({ 'x-access-token': this.token });
    let options = new RequestOptions({ headers: headers });
    return this.http.get(this.url+'prevreport/?month='+data.month+'&year='+data.year, options);
}
   
 
}
