import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AttendanceService } from '../../../services/user/attendance.service';


@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private AService : AttendanceService
  ) { }

  ngOnInit() {
    console.log(this.route.params['value']);
    var token = this.route.params['value'];
      this.AService
        .getAttendance(token).subscribe(
          result => {
            console.log(result);
          },
          error => {
            console.log(error);
          }
        );
  }


  

}
