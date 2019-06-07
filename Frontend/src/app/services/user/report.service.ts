import { Injectable } from '@angular/core';
import { Headers, RequestOptions } from '@angular/http';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Config } from '../../../load.config';


@Injectable({
  providedIn: 'root'
})
export class ReportService {
  url = Config.settings.serviceURL + '/report';
  WFHurl = Config.settings.serviceURL + '/wfh';
  //url = environment.apiUrl + '/report';
  //WFHurl = environment.apiUrl + '/wfh';
  // url = 'http://localhost:3000/api/report';
  token = localStorage.getItem('token');

  getHeaders() {
    return {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Access-token': this.token
    }
  }
  constructor(private http: HttpClient) { }
  getReport() {
    return this.http.get(this.url, { headers: this.getHeaders() });

  }
  putReport() {
    return this.http.put(this.url, null, { headers: this.getHeaders() });
  }

  putWFHReport() {
    return this.http.put(this.WFHurl, null, { headers: this.getHeaders() });
  }
}
