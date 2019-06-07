import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { LogoutRedirectService } from '../../services/logout-redirect.service';


@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent implements OnInit {
  isLoggedIn: boolean = false;
  constructor(private auth: AuthService, private lo:LogoutRedirectService) {}
  ngOnInit(): void {
    // const token = localStorage.getItem('token');
    // if (token) {
    //   this.auth.ensureAuthenticated(token)
    //   .then((user) => {
    //     //console.log(user.json());
    //     if (user.json().status === 'success') {
    //       this.isLoggedIn = true;
    //     }
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    // }
  }
  
  logout(){
        this.lo.logout();
  }
}
