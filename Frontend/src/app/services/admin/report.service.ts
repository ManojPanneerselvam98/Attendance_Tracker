import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { environment } from '../../../environments/environment';
import { Config } from '../../../load.config';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  url = Config.settings.serviceURL + '/admin/report/';
  role = localStorage.getItem('role');
  //url = environment.apiUrl + '/admin/report/';
  //url = 'http://localhost:3000/api/admin/report/';
  token = localStorage.getItem('token');
  constructor(private http: Http) { }
  getReport(data) {
    let headers = new Headers({ 'x-access-token': this.token });
    let options = new RequestOptions({ headers: headers });
    return this.http.get(this.url+'?role='+data, options);
  }

  getReportById(id) {
    let headers = new Headers({ 'x-access-token': this.token });
    let options = new RequestOptions({ headers: headers });
    return this.http.get(this.url + id, options);
  }

  putReport(id, value) {
    let headers = new Headers({ 'x-access-token': this.token });
    let options = new RequestOptions({ headers: headers });
    return this.http.put(this.url + id, value, options);
  }

   getReportMonth(data) {
      let headers = new Headers({ 'x-access-token': this.token });
      let options = new RequestOptions({ headers: headers });
      return this.http.get(this.url+'prevreport/?month='+data.month+'&year='+data.year+'&role='+this.role, options);
  }
}
