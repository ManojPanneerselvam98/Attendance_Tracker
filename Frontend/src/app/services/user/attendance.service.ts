import { Injectable } from '@angular/core';
import { Headers, RequestOptions } from '@angular/http';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Config } from '../../../load.config';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  url = Config.settings.serviceURL + '/attendanceLink';
  //url = environment.apiUrl + '/attendanceLink';
  getHeaders() {
    return {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }
  constructor(private http: HttpClient) { }
    getAttendance(token) {
      //console.log(token.token);
      return this.http.get(this.url+'?token='+token.token, { headers: this.getHeaders() });
    }
}
