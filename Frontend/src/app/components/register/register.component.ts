/*import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}*/


import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';

@Component({
    selector: 'register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
    user: User = new User();
constructor(private router: Router,private auth: AuthService) {}
onRegister(): void {
    this.auth.register(this.user)
    .then((user) => {
    localStorage.setItem('token', user.json().auth_token);
    this.router.navigateByUrl('/status');
    
})
    .catch((err) => {
        console.log(err);
    });
}
}