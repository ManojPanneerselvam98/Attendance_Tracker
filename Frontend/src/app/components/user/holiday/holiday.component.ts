import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { HolidayService } from '../../../services/user/holiday.service';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition
} from "@angular/material";

@Component({
  selector: 'app-holiday',
  templateUrl: './holiday.component.html',
  styleUrls: ['./holiday.component.scss']
})
export class HolidayComponent implements OnInit {
  today: number = Date.now();
  data: Date;
  minDate: Date;
  maxDate: Date;
  convertDate :any;
  HLDetails : any;
  list: any[] = [];
  bsInlineValue = new Date();
  setAutoHide: boolean = true;
  autoHide: number = 2000;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  constructor(
    private HDservice: HolidayService,
    public snackBar: MatSnackBar
  ) { }

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
    this.getHL();
  }

  onValueChange(value: Date): void {
    this.data = value;
    console.log(this.data);
    if(this.data){
    this.convertDate = new Date(this.data).toDateString().slice(8,10);
    console.log(this.convertDate.slice(8,10));
    // if(this.data != null){
    //   this.list.push({ curdate : this.convertDate})
    // }
    // console.log(this.list);
    var data = { "curdate" : this.convertDate}
    this.HDservice
      .putHday(data).subscribe(
        result => {
          //this.getPL();
          this.getHL();
          console.log(result);
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  getHL(){
    this.HDservice
      .getHL().subscribe(
        result => {
          this.HLDetails = result;
          console.log(result);
        },
        error => {
          console.log(error);
        }
      );
  }

  cancelHL(id){
    var data = { "curdate" : id}
    this.HDservice
      .putcancelHL(data).subscribe(
        result => {
          this.getHL();
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
