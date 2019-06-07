import { Component, OnInit } from "@angular/core";
import { UserService } from "../../../services/admin/user.service";
import { PlService } from "../../../services/admin/pl.service";
import { NgForm } from "@angular/forms";
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { HolidayService } from "../../../services/admin/holiday.service";

@Component({
  selector: "app-adminholiday",
  templateUrl: "./adminholiday.component.html",
  styleUrls: ["./adminholiday.component.scss"]
})
export class AdminholidayComponent implements OnInit {
  minDate: Date;
  maxDate: Date;
  data: Date;
  convertDate: any;
  convertMonth: any;
  convertYear: any;
  userList: any;
  userHL: any;
  datepickerModel: Date;
  monthNames : any;
  years: any;
  constructor(
    private uAdminService: UserService,
    private plAdminService: PlService,
    private holidayAdminService : HolidayService
  ) {}

  ngOnInit() {
    var d = new Date(),
      month = d.getMonth() + 1,
      day = d.getDate(),
      year = d.getFullYear(),
      totalDateInMonth = new Date(year, month, 0).getDate(),
      balanceDayInCurrentMonth = totalDateInMonth - day;
    this.minDate = new Date();
    this.maxDate = new Date();
    this.minDate.setDate(this.minDate.getDate() + 1);
    this.maxDate.setDate(this.maxDate.getDate() + balanceDayInCurrentMonth);
    this.getHoliday();
    this.getAllMonth();
    this.getAllYear();
  }

  getUser() {
    this.uAdminService.getUsers().subscribe(
      result => {
        //this.myData = result;
        this.userList = result;
        console.log(result);
      },
      error => {
        console.log(error);
      }
    );
  }

  getHoliday() {
    this.holidayAdminService
    .getHoliday().subscribe(
      result => {
        //this.getUser();
        this.userHL = result.json();
        //console.log(result.json());
      },
      error => {
        console.log(error);
        console.log(error.json());
        var err = error.json();
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
      holidayreason : form.value.holidayreason
    };
    //console.log(data)
    this.holidayAdminService
      .postHoliday(data).subscribe(
        result => {
          //this.getPL();
          console.log(data);
          this.getHoliday();
        },
        error => {
          console.log(error);
          console.log(error.json());
        }
      );
    //console.log(data);
  }

  cancelHoliday(value){
    this.holidayAdminService
    .cancelHoliday(value._id).subscribe(
      result => {
        this.getHoliday();
      },
      error => {
        console.log(error);
        console.log(error.json());
        var err = error.json();
      }
    );

  }

  getAllMonth(){
    this.monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  }
  
  getAllYear(){
    this.years = [ "2019", "2020", "2021", "2022", "2023", "2024","2025"];
  }
  
  historyHL(form: NgForm) {
    let data = form.value;
    var monthString = data.month+1;
    var dat = new Date('1 ' + monthString + data.year);
    this.holidayAdminService
      .getHLReportMonth(data).subscribe(
        result => {
          this.userHL = result.json();
        },
        error => {
          console.log(error.json());
        }
      );
  }
}
