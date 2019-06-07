import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Config } from '../../../load.config';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url = Config.settings.serviceURL + '/admin/user/';
  //url = environment.apiUrl + '/admin/user/';
  // url = 'http://localhost:3000/api/admin/user/';
  token = localStorage.getItem('token');
  getHeaders() {
    return {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Access-token': this.token
    }
  }

  constructor(private http: HttpClient) { }
  getUser() {
    return this.http.get(this.url, { headers: this.getHeaders() });
  }
  getUsers() {
    return this.http.get(this.url+'users', { headers: this.getHeaders() });
  }

  getUserById(id) {
    return this.http.get(this.url + id, { headers: this.getHeaders() });
  }
  postUser(data) {
    return this.http.post(this.url, data, { headers: this.getHeaders() });
  }
  updateUser(id, data: any) {
    return this.http.put(this.url + id, data, { headers: this.getHeaders() });
  }

  deleteUser(id) {
    return this.http.delete(this.url + id, { headers: this.getHeaders() });
  }





}
