import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PlannedleaveService } from '../../../services/user/plannedleave.service';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition
} from "@angular/material";

@Component({
  selector: 'app-leave',
  templateUrl: './leave.component.html',
  styleUrls: ['./leave.component.scss']
})
export class LeaveComponent implements OnInit {
  today: number = Date.now();
  minDate: Date;
  maxDate: Date;
  data: Date;
  convertDate :any;
  list: any[] = [];
  PLDetails : any;
  bsInlineValue = new Date();
  setAutoHide: boolean = true;
  autoHide: number = 2000;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  constructor(
    private PLservice: PlannedleaveService,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    var d = new Date(),
        month = d.getMonth()+1,
        day = d.getDate(),
        year = d.getFullYear(),
        totalDateInMonth = new Date(year, month, 0).getDate(),
        balanceDayInCurrentMonth = totalDateInMonth - day;
    this.minDate = new Date();
    this.maxDate = new Date();
    this.minDate.setDate(this.minDate.getDate()+1);
    this.maxDate.setDate(this.maxDate.getDate() +balanceDayInCurrentMonth);
    this.getPL();
  }

  // updateTime(form: NgForm) {
  //   console.log(form.value);
  //   var date = form.value.plannedleave;
  //   console.log(date);
  //   console.log(new Date(date.toDateString()));
  //   console.log(new Date('Thu Mar 14 2019 17:14:56 GMT+0530 (India Standard Time)').toDateString());
  // }

  onValueChange(value: Date): void {
    this.data = value;
    if(this.data){
    this.convertDate = new Date(this.data).toDateString().slice(8,10);
    //console.log(this.convertDate.slice(8,10));
    // if(this.data != null){
    //   this.list.push({ curdate : this.convertDate})
    // }
    // console.log(this.list);
    var data = { "curdate" : this.convertDate}
    this.PLservice
      .putPl(data).subscribe(
        result => {
          this.getPL();
          console.log(result);
        },
        error => {
          console.log(error);
        }
      );
    }
  }
  

  getPL(){
    this.PLservice
      .getPl().subscribe(
        result => {
          this.PLDetails = result;
          console.log(result);
        },
        error => {
          console.log(error);
        }
      );
  }

  cancelPL(id){
    var data = { "curdate" : id}
    this.PLservice
      .putcancelPL(data).subscribe(
        result => {
          this.getPL();
          console.log(result);
        },
        error => {
          console.log(error);
          let config = new MatSnackBarConfig();
        //config.verticalPosition = this.verticalPosition;
        //config.horizontalPosition = this.horizontalPosition;
        config.duration = this.setAutoHide ? this.autoHide : 0;
        //config.extraClasses = this.addExtraClass ? ['test'] : undefined;
        this.snackBar.open(error.error.message, null, config);
        }
      );
  }


}
