import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../../services/user/report.service';
import { DayService } from '../../../services/user/day.service';
import { HolidayService } from '../../../services/user/holiday.service';
import { LogoutRedirectService } from '../../../services/logout-redirect.service';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from "@angular/material";

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  myData: any;
  setAutoHide: boolean = true;
  autoHide: number = 2000;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  constructor(
    private UreportService: ReportService,
    private lo: LogoutRedirectService,
    private Dservice: DayService,
    private HDservice: HolidayService,
    public snackBar: MatSnackBar) { }
  ngOnInit() {
    this.getAttendance();
  }

  currentMonthWeekEnds(){
    var d = new Date();
    var getTot = this.daysInMonth(d.getMonth()+1,d.getFullYear()); //Get total days in a month
    var sat = new Array();   //Declaring array for inserting Saturdays
    var sun = new Array();   //Declaring array for inserting Sundays
    var WO = new Array();
    for(var i=1;i<=getTot;i++){    //looping through days in month
      var newDate = new Date(d.getFullYear(),d.getMonth(),i)
      if(newDate.getDay()==0){   //if Sunday
        WO.push(i);
      }
      if(newDate.getDay()==6){   //if Saturday
        WO.push(i);
      }
    }
    console.log(sat);
    console.log(sun);
    console.log(WO);
    this.HDservice
      .putWO(WO).subscribe(
        result => {
          this.getAttendance();
          console.log(result);
        },
        error => {
          console.log(error);
        }
      );
  }

  daysInMonth(month,year) {
    return new Date(year, month, 0).getDate();
  }

  getAttendance() {
    this.UreportService
      .getReport().subscribe(
        result => {
          if (Object.getOwnPropertyNames(result).length === 0) {
            //console.log("0");
            this.makeAttendanceofMonth();
          } else {
            //console.log("1");
            this.myData = result;
            //console.log(result);
          }
        },
        error => {
          console.log(error);
          if (error.status = 500) {
            //console.log("login again", error.status);
            let config = new MatSnackBarConfig();
            config.duration = this.setAutoHide ? this.autoHide : 0;
            this.snackBar.open("Token Expired Login", null, config);
            this.logout();
          }
        }
      );
  }

  makeAttendanceofMonth() {
    this.Dservice
      .currentMonth().subscribe(
        result => {
          this.currentMonthWeekEnds();
          this.getAttendance();
          //console.log(result);
        },
        error => {
          console.log(error);
        }
      );
  }

  logout() {
    this.lo.logout();
  }

  wfh(){
    this.UreportService
      .putWFHReport().subscribe(
        result => {
          this.getAttendance();
          console.log(result);
        },
        error => {
          console.log(error);
        }
      );
  }
  makeAttendance() {
    this.UreportService
      .putReport().subscribe(
        result => {
          this.getAttendance();
          //console.log(result);
        },
        error => {
          console.log(error);
        }
      );
  }

}
