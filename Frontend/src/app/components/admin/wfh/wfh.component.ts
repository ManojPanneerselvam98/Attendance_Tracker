import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/admin/user.service';
import { WfhService } from '../../../services/admin/wfh.service';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition
} from "@angular/material";


@Component({
  selector: 'app-wfh',
  templateUrl: './wfh.component.html',
  styleUrls: ['./wfh.component.scss']
})
export class WfhComponent implements OnInit {
  userList:any;
  userWFH:any;
  setAutoHide: boolean = true;
  autoHide: number = 2000;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  constructor(
    private uAdminService: UserService,
    private wfhService : WfhService,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.getUser();
    this.getWFH();
  }

  getUser() {
    this.uAdminService
      .getUsers().subscribe(
        result => {
          //this.myData = result;
          this.userList = result;
          console.log(this.userList);
        },
        error => {
          console.log(error.error.message);
          let config = new MatSnackBarConfig();
          config.duration = this.setAutoHide ? this.autoHide : 0;
          this.snackBar.open(error.error.message, null, config);
        }
      );
  }

  getWFH() {
    this.wfhService
    .getWFH().subscribe(
      result => {
        //this.getUser();
        this.userWFH = result.json();
        //console.log(result.json());
      },
      error => {
        console.log(error);
      }
    );
  }

  onSubmit(event: any) {
    var data = { 
      "username" : event.target.username.value
    }
    this.wfhService
    .putWFH(data).subscribe(
      result => {
        this.getUser();
        this.getWFH();
      },
      error => {
        console.log(error);
      }
    );

 }

}
