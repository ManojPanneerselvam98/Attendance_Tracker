import { Injectable } from '@angular/core';
import { Headers, RequestOptions } from '@angular/http';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Config } from '../../../load.config';

@Injectable({
  providedIn: 'root'
})
export class PlannedleaveService {
  url = Config.settings.serviceURL + '/pl';
  //url = environment.apiUrl + '/pl';
  token = localStorage.getItem('token');
  getHeaders() {
    return {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Access-token': this.token
    }
  }

  constructor(private http: HttpClient) { }

  putPl(data) {
    return this.http.put(this.url, data, { headers: this.getHeaders() });
  }

  putcancelPL(data) {
    return this.http.put(this.url+'/cancelPL', data, { headers: this.getHeaders() });
  }

  getPl() {
    return this.http.get(this.url, { headers: this.getHeaders() });

  }
}
