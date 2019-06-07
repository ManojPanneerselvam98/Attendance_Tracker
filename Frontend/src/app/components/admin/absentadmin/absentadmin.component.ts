import { Component, OnInit } from '@angular/core';
import { AbsentService } from '../../../services/admin/absent.service';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition
} from "@angular/material";

@Component({
  selector: 'app-absentadmin',
  templateUrl: './absentadmin.component.html',
  styleUrls: ['./absentadmin.component.scss']
})
export class AbsentadminComponent implements OnInit {
  absentUser:any;
  absentUserList:any;
  setAutoHide: boolean = true;
  autoHide: number = 2000;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  constructor(
    private AbsentService : AbsentService,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    console.log("object")
    this.absentOftheDay()
  }

  absentOftheDay() {
    this.AbsentService
      .getAbsentReport().subscribe(
        result => {
          console.log(result.json());
          this.absentUser = result.json();
        },
        error => {
          console.log(error.json());
          var err = error.json();
          let config = new MatSnackBarConfig();
          config.duration = this.setAutoHide ? this.autoHide : 0;
          this.snackBar.open(err.message, null, config);
        }
      );
  }

  onSubmit(event: any) {
    var leaveType = event.target.type.value,
        leaveReason;
    if(leaveType == 'Sick Leave'){
      leaveReason = "Not Feeling Well"
    } else {
      leaveReason = "Personal Emergencey"
    }
    var data = { 
          "username" : event.target.username.value,
          "type" : leaveType,
          "reason" : leaveReason
    }
//    console.log(data);
    this.AbsentService
    .putAbsentReport(data).subscribe(
      result => {
        //this.absentUser = result.json();
        this.absentOftheDay()
      },
      error => {
        console.log(error);
      }
    );
 }



}
