import { Injectable } from '@angular/core';
import { Headers, RequestOptions } from '@angular/http';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Config } from '../../../load.config';

@Injectable({
  providedIn: 'root'
})
export class DayService {
  url = Config.settings.serviceURL + '/day';
  //url = environment.apiUrl + '/day';
  // url = 'http://localhost:3000/api/day';
  token = localStorage.getItem('token');

  getHeaders() {
    return {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Access-token': this.token
    }
  }
  constructor(private http: HttpClient) { }
  currentMonth() {
    return this.http.post(this.url, null, { headers: this.getHeaders() });
  }
}
