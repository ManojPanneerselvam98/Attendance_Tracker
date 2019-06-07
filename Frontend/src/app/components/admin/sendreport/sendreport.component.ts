import { Component, OnInit } from '@angular/core';
import { SendreportService } from '../../../services/admin/sendreport.service';


@Component({
  selector: 'app-sendreport',
  templateUrl: './sendreport.component.html',
  styleUrls: ['./sendreport.component.scss']
})
export class SendreportComponent implements OnInit {
  leaveList:any;
  arrayOfAbsentees=[];
  private regForm:any;
  constructor(
    private sService: SendreportService
  ) { }

  ngOnInit() {
    this.getLeaveDetails();

  }


  getLeaveDetails(){
    this.sService
      .getLeaveDetails().subscribe(
        result => {
            this.leaveList = result;
            console.log(result);
        },
        error => {
          console.log(error);
        }
      );
  }

  postUser(data){
    console.log(data);
  }

  absentUserSubmit(data){
    this.arrayOfAbsentees.push(data);
    console.log(this.arrayOfAbsentees);
  }


}
