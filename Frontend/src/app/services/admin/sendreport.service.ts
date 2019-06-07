import { Injectable } from '@angular/core';
import { Headers, RequestOptions } from '@angular/http';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Config } from '../../../load.config';

@Injectable({
  providedIn: 'root'
})
export class SendreportService {
  url = Config.settings.serviceURL + '/admin/sendreport/';
  //url = environment.apiUrl + '/admin/sendreport/';
  token = localStorage.getItem('token');
  getHeaders() {
    return {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Access-token': this.token
    }
  }
  constructor(private http: HttpClient) { }

  getLeaveDetails() {
    return this.http.get(this.url, { headers: this.getHeaders() });
  }
  // getTeamId(id) {
  //   return this.http.get(this.url + id, { headers: this.getHeaders() });
  // }
  // updateTeam(id, data) {
  //   return this.http.put(this.url + id, data, { headers: this.getHeaders() });
  // }
  // deleteTeam(id) {
  //   return this.http.delete(this.url + id, { headers: this.getHeaders() });
  // }
  // postTeam(data) {
  //   return this.http.post(this.url, data, { headers: this.getHeaders() });
  // }
}
