import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ProfileService } from '../../../services/profile.service';
import { User } from '../../../models/user';
import { LogoutRedirectService } from '../../../services/logout-redirect.service';
import { tokenKey } from '@angular/core/src/view';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition
} from "@angular/material";

@Component({
  selector: 'app-adminlogin',
  templateUrl: './adminlogin.component.html',
  styleUrls: ['./adminlogin.component.scss']
})
export class AdminloginComponent implements OnInit {

  user: User = new User();
  userData;
  userName;
  setAutoHide: boolean = true;
  autoHide: number = 2000;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  constructor(
    private router: Router, 
    private auth: AuthService, 
    private profile: ProfileService, 
    public snackBar: MatSnackBar,
    public lo: LogoutRedirectService) { }
  ngOnInit() {
  }
  onLogin(): void {
    this.auth.adminLogin(this.user)
      .then((user) => {
        localStorage.setItem('token', user.json().token);
        this.profile
          .getUser(user.json().token).subscribe(
            result => {
              this.userData = result.json();
              console.log(this.userData);
              localStorage.setItem('user', JSON.stringify(this.userData));
              localStorage.setItem('role', this.userData.role);
              if (this.userData.role == "admin" || this.userData.role == "webadmin" || this.userData.role == "posadmin") {
                //location.reload();
                this.lo.showHeader = true;
                this.router.navigateByUrl('/admin/report');
              } else {
                //location.reload();
                this.lo.showHeader = true;
                this.router.navigateByUrl('/user/report');
              }
            },
            error => {
              console.log(error);
            }
          );


      })
      .catch((err) => {
        console.log(err.statusText);
        //this.snackBar.open("message");
        let config = new MatSnackBarConfig();
        //config.verticalPosition = this.verticalPosition;
        //config.horizontalPosition = this.horizontalPosition;
        config.duration = this.setAutoHide ? this.autoHide : 0;
        //config.extraClasses = this.addExtraClass ? ['test'] : undefined;
        this.snackBar.open(err.statusText, null, config);

      });
  }


}
