import { Component, OnInit, TemplateRef } from '@angular/core';
import { TeamService } from '../../../services/admin/team.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition
} from "@angular/material";

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {

  teamList : any;
  isModalShown: boolean = false;
  mySmeId:any;
  modalRef: BsModalRef;
  name :any;
  setAutoHide: boolean = true;
  autoHide: number = 2000;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  constructor(
    private tService: TeamService,
    private modalService: BsModalService,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.getTeam();
  }

  hideModal() {
    this.isModalShown = false;
  }

  getTeam(){
    this.tService
      .getTeam().subscribe(
        result => {
            this.teamList = result;
            //console.log(result);
        },
        error => {
          console.log(error.error.message);
          let config = new MatSnackBarConfig();
          config.duration = this.setAutoHide ? this.autoHide : 0;
          this.snackBar.open(error.error.message, null, config);
        }
      );
  }

  getTeamId(id) {
    this.isModalShown = true;
    this.tService
      .getTeamId(id).subscribe(
        result => {
          this.mySmeId = result[0];
          //console.log(result)
        },
        error => {
          console.log(error);
        }
      );
  }

  updateUser(id, data) {
    this.tService
      .updateTeam(id, data).subscribe(
        result => {
          this.getTeam();
          this.isModalShown = false;
        },
        error => {
          console.log(error.error.message);
          
        }
      );
  }
  deleteTeam(id) {
    this.tService
      .deleteTeam(id).subscribe(
        result => {
          // console.log(result);
          this.getTeam();
        },
        error => {
          console.log(error);
        }
      );
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  postTeam(data) {
    this.tService
      .postTeam(data).subscribe(
        result => {
          this.modalRef.hide();
          this.getTeam();
          this.clear();
        },
        error => {
          console.log(error.error.message);
        }
      );
  }

  clear() {
    this.name = null;
  }

}
