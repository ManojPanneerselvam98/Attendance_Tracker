import { Injectable } from '@angular/core';
import { Headers, RequestOptions } from '@angular/http';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Config } from '../../../load.config';

@Injectable({
  providedIn: 'root'
})
export class HolidayService {
  url = Config.settings.serviceURL + '/hl';
  //url = environment.apiUrl + '/hl';
  token = localStorage.getItem('token');
  getHeaders() {
    return {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Access-token': this.token
    }
  }

  constructor(private http: HttpClient) { }

  putHday(data) {
    return this.http.put(this.url, data, { headers: this.getHeaders() });
  }
  putcancelHL(data) {
    return this.http.put(this.url+'/cancelHL', data, { headers: this.getHeaders() });
  }

  putWO(data) {
    return this.http.put(this.url+'/weekoff', data, { headers: this.getHeaders() });
  }

  getHL() {
    return this.http.get(this.url, { headers: this.getHeaders() });
  }

}
