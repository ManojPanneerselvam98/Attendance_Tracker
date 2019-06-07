import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/admin/user.service';
import { PlService } from '../../../services/admin/pl.service';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgForm } from "@angular/forms";
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition
} from "@angular/material";

@Component({
  selector: 'app-pl',
  templateUrl: './pl.component.html',
  styleUrls: ['./pl.component.scss']
})
export class PlComponent implements OnInit {
  userList:any;
  minDate: Date;
  maxDate: Date;
  data: Date;
  convertDate: any;
  convertMonth: any;
  convertYear: any;
  headers:any;
  userPL:any;
  setAutoHide: boolean = true;
  autoHide: number = 2000;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  datepickerModel: Date;
  monthNames: any;
  years: any;
  myData: any;
  constructor(
    private uAdminService: UserService,
    private plAdminService: PlService,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.getUser();
    this.getPL();
    let date = new Date();
    let days = this.daysInMonth(date.getMonth() + 1, date.getFullYear());
    this.headers = Array(days).fill(0).map((x, i) => i + 1);
    let d = new Date(),
      month = d.getMonth() + 1,
      day = d.getDate(),
      year = d.getFullYear(),
      totalDateInMonth = new Date(year, month, 0).getDate(),
      balanceDayInCurrentMonth = totalDateInMonth - day;
    this.minDate = new Date();
    this.maxDate = new Date();
    this.minDate.setDate(this.minDate.getDate() + 1);
    this.maxDate.setDate(this.maxDate.getDate() + balanceDayInCurrentMonth);
    this.getAllMonth();
    this.getAllYear();
  }
  daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }

  getUser() {
    this.uAdminService
      .getUsers().subscribe(
        result => {
          //this.myData = result;
          this.userList = result;
          //console.log(result);
        },
        error => {
          console.log(error);
        }
      );
  }


  getPL() {
    this.plAdminService
    .getPL().subscribe(
      result => {
        //this.getUser();
        this.userPL = result.json();
        console.log(result.json());
      },
      error => {
        console.log(error);
        console.log(error.json());
        var err = error.json();
        let config = new MatSnackBarConfig();
        config.duration = this.setAutoHide ? this.autoHide : 0;
        this.snackBar.open(err.message, null, config);
      }
    );
  }
  onSubmit(event: any) {
      var data = { 
        "username" : event.target.username.value,
        "date" : event.target.date.value
      }
      this.plAdminService
      .putPL(data).subscribe(
        result => {
          this.getPL();
        },
        error => {
          console.log(error);
          console.log(error.json());
          var err = error.json();
          let config = new MatSnackBarConfig();
          config.duration = this.setAutoHide ? this.autoHide : 0;
          this.snackBar.open(err.message, null, config);
        }
      );
 }

 cancelPL(value){
  //console.log()
  this.plAdminService
      .cancelPL(value._id).subscribe(
        result => {
          this.getPL();
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

makeHoliday(form: NgForm) {
  this.data = form.value.date;
  this.convertDate = new Date(this.data).toDateString().slice(8, 10);
  this.convertMonth = new Date(this.data).toDateString().slice(4, 7);
  this.convertYear = new Date(this.data).toDateString().slice(11, 15);

  let data = {
    curdate: this.convertDate,
    curmonth: this.convertMonth,
    curyear: this.convertYear,
    username : form.value.username
  };
  //console.log(data);
  this.plAdminService
  .postPL(data).subscribe(
    result => {
      this.getPL();
    },
    error => {
      console.log(error);
      console.log(error.json());
      var err = error.json();
      let config = new MatSnackBarConfig();
      config.duration = this.setAutoHide ? this.autoHide : 0;
      this.snackBar.open(err.message, null, config);
    }
  );
}
getAllMonth(){
  this.monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
}

getAllYear(){
  this.years = [ "2019", "2020", "2021", "2022", "2023", "2024","2025"];
}

historyPL(form: NgForm) {
  let data = form.value;
  var monthString = data.month+1;
  var dat = new Date('1 ' + monthString + data.year);
  this.plAdminService
    .getPLReportMonth(data).subscribe(
      result => {
        // let date = new Date();
        // let days = this.daysInMonth(dat.getMonth() + 1, date.getFullYear());
        // this.headers = Array(days).fill(0).map((x, i) => i + 1);
        // this.myData = result.json();
        this.userPL = result.json();
      },
      error => {
        console.log(error.json());
      }
    );
}
 


}
