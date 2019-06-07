import { Injectable } from '@angular/core';
import { Headers, RequestOptions } from '@angular/http';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Config } from '../../../load.config';

@Injectable({
  providedIn: 'root'
})
export class SmeService {
  url = Config.settings.serviceURL + '/admin/sme/';
  //url = environment.apiUrl + '/admin/sme/';
  token = localStorage.getItem('token');
  getHeaders() {
    return {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Access-token': this.token
    }
  }
  constructor(private http: HttpClient) { }

  getSme() {
    return this.http.get(this.url, { headers: this.getHeaders() });

  }
  getSmeId(id) {
    return this.http.get(this.url + id, { headers: this.getHeaders() });
  }
  updateSme(id, data) {
    return this.http.put(this.url + id, data, { headers: this.getHeaders() });
  }
  deleteSme(id) {
    return this.http.delete(this.url + id, { headers: this.getHeaders() });
  }
  postSme(data) {
    return this.http.post(this.url, data, { headers: this.getHeaders() });
  }
}
