import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UserService } from '../../../services/admin/user.service';
import { LogoutRedirectService } from '../../../services/logout-redirect.service';
import { SmeService } from '../../../services/admin/sme.service';
import { TeamService } from '../../../services/admin/team.service';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from "@angular/material";

@Component({
  selector: 'app-useradmin',
  templateUrl: './useradmin.component.html',
  styleUrls: ['./useradmin.component.scss']
})
export class UseradminComponent implements OnInit {
  myData;
  myDatabyId;
  isModalShown: boolean = false;
  modalRef: BsModalRef;
  setAutoHide: boolean = true;
  autoHide: number = 2000;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  name: string = '';
  username: string = '';
  email: string = '';
  role: string = '';
  password: string = '';
  sme: string = '';
  team: string = '';
  status: string = '';
  smeList:any;
  teamList:any;
  constructor(
    private uAdminService: UserService,
    private smeService: SmeService,
    private tService: TeamService,
    private lo: LogoutRedirectService,
    private modalService: BsModalService,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.isModalShown = false;
    this.getUser();
  }
  clear() {
    this.name = null;
    this.username = null;
    this.email = null;
    this.role = null;
    this.password = null;
    this.sme = null;
    this.team = null;
    this.status = null;
  }
  openModal(template: TemplateRef<any>) {
    this.getSme();
    this.getTeam();
    this.modalRef = this.modalService.show(template);
  }
  getSme(){
    this.smeService
      .getSme().subscribe(
        result => {
            this.smeList = result;
            //console.log(result);
        },
        error => {
          console.log(error);
        }
      );
  }
  getTeam(){
    this.tService
      .getTeam().subscribe(
        result => {
            this.teamList = result;
            //console.log(result);
        },
        error => {
          console.log(error);
        }
      );
  }
  postUser(data) {
    console.log(data);
    this.uAdminService
      .postUser(data).subscribe(
        result => {
          this.modalRef.hide();
          this.getUser();
          this.clear();
        },
        error => {
          // console.log(error.error.message);
          // console.log("Enter");
          let config = new MatSnackBarConfig();
          config.duration = this.setAutoHide ? this.autoHide : 0;
          this.snackBar.open(error.error.message, null, config);
        }
      );
  }

  hideModal() {
    this.isModalShown = false;
  }
  getUser() {
    this.uAdminService
      .getUser().subscribe(
        result => {
          this.myData = result;
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
  getUserById(id) {
    this.isModalShown = true;
    this.getSme();
    this.getTeam();
    this.uAdminService
      .getUserById(id).subscribe(
        result => {
          this.myDatabyId = result[0];
        },
        error => {
          console.log(error);
        }
      );
  }
  deleteUser(id) {
    this.uAdminService
      .deleteUser(id).subscribe(
        result => {
          // console.log("deleted");
          // console.log(result);
          this.getUser();
        },
        error => {
          console.log(error);
        }
      );
  }
  updateUser(id, data) {
    this.uAdminService
      .updateUser(id, data).subscribe(
        result => {
          this.getUser();
          this.isModalShown = false;
        },
        error => {
          // console.log(error.error.message);
          // console.log("Enter");
          let config = new MatSnackBarConfig();
          config.duration = this.setAutoHide ? this.autoHide : 0;
          this.snackBar.open(error.error.message, null, config);
        }
      );
  }
  logout() {
    this.lo.logout();
  }


}
