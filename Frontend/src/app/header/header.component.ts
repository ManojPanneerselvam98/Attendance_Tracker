import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from '../services/profile.service';
import { LogoutRedirectService } from '../services/logout-redirect.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  profileData;
  username;
  role;
  adminMenu;
  userMenu;
  isHeader;
  token;
  user;
  constructor(public lo: LogoutRedirectService, private profile: ProfileService) { }

  ngOnInit() {
    this.adminMenu = false;
    this.userMenu = false;
    this.getUser();
  }
  getUser() {
    this.token = localStorage.getItem('token');;
    this.user = localStorage.getItem('user');
    if (this.token && this.user) {
      this.lo.showHeader = true;
    
      this.profileData = JSON.parse(this.user);
      this.username = this.profileData.name;
      this.role = this.profileData.role;
      if (this.role == "admin" || this.role == "webadmin" || this.role == "posadmin") {
        this.adminMenu = true;
        this.userMenu = false;
      } else {
        this.adminMenu = false;
        this.userMenu = true;
      }
    } else {
      this.lo.showHeader =false;
    }
  }

  logout() {
    this.lo.logout();
  }

}
