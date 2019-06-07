import { Component, OnInit, TemplateRef } from '@angular/core';
import { SmeService } from '../../../services/admin/sme.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition
} from "@angular/material";

@Component({
  selector: 'app-sme',
  templateUrl: './sme.component.html',
  styleUrls: ['./sme.component.scss']
})
export class SmeComponent implements OnInit {
  smeList : any;
  isModalShown: boolean = false;
  mySmeId:any;
  modalRef: BsModalRef;
  name :any;
  setAutoHide: boolean = true;
  autoHide: number = 2000;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  constructor(
    private smeService: SmeService,
    private modalService: BsModalService,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.getSme()
  }

  hideModal() {
    this.isModalShown = false;
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
          console.log(error.error.message);
          let config = new MatSnackBarConfig();
          config.duration = this.setAutoHide ? this.autoHide : 0;
          this.snackBar.open(error.error.message, null, config);
        }
      );
  }

  getSmeId(id) {
    this.isModalShown = true;
    this.smeService
      .getSmeId(id).subscribe(
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
    this.smeService
      .updateSme(id, data).subscribe(
        result => {
          this.getSme();
          this.isModalShown = false;
        },
        error => {
          console.log(error.error.message);
          
        }
      );
  }
  deleteSme(id) {
    this.smeService
      .deleteSme(id).subscribe(
        result => {
          // console.log(result);
          this.getSme();
        },
        error => {
          console.log(error);
        }
      );
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  postSme(data) {
    this.smeService
      .postSme(data).subscribe(
        result => {
          this.modalRef.hide();
          this.getSme();
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
