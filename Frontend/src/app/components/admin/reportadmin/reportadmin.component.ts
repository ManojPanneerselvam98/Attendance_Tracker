import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../../services/admin/report.service';
import { AbsentService } from '../../../services/admin/absent.service';
import { LogoutRedirectService } from '../../../services/logout-redirect.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { NgForm } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from "@angular/material";

@Component({
  selector: 'app-reportadmin',
  templateUrl: './reportadmin.component.html',
  styleUrls: ['./reportadmin.component.scss']
})
export class ReportadminComponent implements OnInit {
  myTime: Date = new Date();
  showMin: boolean = true;
  showSec: boolean = true
  myData: any;
  myDataById: any;
  days: any;
  absentUser:any;
  absentUserList:any;
  headers: any[];
  isModalShown: boolean = false;
  modaltitle: any;
  setAutoHide: boolean = true;
  autoHide: number = 2000;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  myDataupdateval: any;
  monthNames: any;
  years: any;
  makeAbsentReport:boolean = false;
  viewUserReport:boolean = true;
  role : any;
  constructor(
    private rAdminService: ReportService,
    private AbsentService : AbsentService,
    private lo: LogoutRedirectService,
    public snackBar: MatSnackBar,
    private atp: AmazingTimePickerService
  ) { }
  ngOnInit() {
    this.getReport();
    this.absentOftheDay();
    this.getAllMonth();
    this.getAllYear();
    console.log(localStorage.getItem('role'));
    this.role = localStorage.getItem('role');
  }

  updateTime(form: NgForm, id) {
    console.log(form.value);
    this.rAdminService
      .putReport(id, form.value).subscribe(
        result => {
          console.log(result.json());
          this.hideModal();
          this.getReport();
        },
        error => {
          if (error.status = 500) {
            //console.log("login again", error.status);
            let config = new MatSnackBarConfig();
            config.duration = this.setAutoHide ? this.autoHide : 0;
            this.snackBar.open(error._body, null, config);
          }
        }
      );
  }

  getReport() {
    let data = localStorage.getItem('role');
    this.rAdminService
      .getReport(data).subscribe(
        result => {
          let date = new Date();
          let days = this.daysInMonth(date.getMonth() + 1, date.getFullYear());
          this.headers = Array(days).fill(0).map((x, i) => i + 1);
          this.myData = result.json();
        },
        error => {
          console.log(error.json());
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

  logout() {
    this.lo.logout();
  }

  showModal(id, username): void {
    this.rAdminService
      .getReportById(id).subscribe(
        result => {
          this.myDataById = result.json();
          this.myDataupdateval = this.myDataById[0];
          this.modaltitle = username;
          console.log(result.json());
        },
        error => {
          console.log(error.json());
        }
      );
    this.isModalShown = true;
  }
  hideModal() {
    this.isModalShown = false;
    this.makeAbsentReport = false;
    this.viewUserReport = true;
  }
  onHidden(): void {
    this.isModalShown = false;
    this.makeAbsentReport = false;
    this.viewUserReport = true;
  }

  daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }

  absentOftheDay() {
    this.AbsentService
      .getAbsentReport().subscribe(
        result => {
          this.absentUser = result.json();
          var a = [];
          this.absentUser.forEach( function (item){
                var x = item.username;
                a.push(x);
            });
            this.absentUserList = a;
        },
        error => {
          console.log(error);
        }
      );
  }

  absentUserSubmit(data){
    console.log(data);
    this.AbsentService
      .putAbsentReport(data).subscribe(
        result => {
          this.absentUser = result.json();
          this.hideModal();
          location.reload();
        },
        error => {
          console.log(error);
        }
      );
  }

    getAllMonth(){
        this.monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    }

    getAllYear(){
        this.years = [ "2019", "2020", "2021", "2022", "2023", "2024","2025"];
    }
    historyUser(form: NgForm) {
        let data = form.value;
        var monthString = data.month+1;
        var dat = new Date('1 ' + monthString + data.year);
        this.rAdminService
          .getReportMonth(data).subscribe(
            result => {
              let date = new Date();
              let days = this.daysInMonth(dat.getMonth() + 1, date.getFullYear());
              this.headers = Array(days).fill(0).map((x, i) => i + 1);
              this.myData = result.json();
            },
            error => {
              console.log(error.json());
            }
          );
    }


    makeAbsent(){
      console.log("click");
      this.makeAbsentReport = true;
      this.viewUserReport = false;
    }
    viewReport(){
      this.makeAbsentReport = false;
      this.viewUserReport = true;
    }

    onSubmit(value,event: any) {
      console.log(value[0].username)
      var leaveType = event.target.type.value,
          leaveReason;
      if(leaveType == 'Sick Leave'){
        leaveReason = "Not Feeling Well"
      } else {
        leaveReason = "Personal Emergencey"
      }
      var data = { 
            "username" : value[0].username,
            "type" : leaveType,
            "reason" : leaveReason,
            "curdate" : value[0].curdate,
            "curmonth" : value[0].curmonth,
            "curyear" : value[0].curyear
      }
      //console.log(data);
      this.AbsentService
      .putAbsentReport(data).subscribe(
        result => {
          //this.absentUser = result.json();
          //this.absentOftheDay()
          this.onHidden()
          this.getReport();
        },
        error => {
          console.log(error);
        }
      );
   }

}
