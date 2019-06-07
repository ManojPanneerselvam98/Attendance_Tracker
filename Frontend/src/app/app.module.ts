import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatSnackBarModule } from '@angular/material';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { AmazingTimePickerModule } from 'amazing-time-picker'; // this line you need
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';



import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { ReportComponent } from './components/user/report/report.component';

import { AuthService } from './services/auth.service';
import { RegisterComponent } from './components/register/register.component';
import { StatusComponent } from './components/status/status.component';
import { EnsureAuthenticated } from './services/ensure-authenticated.service';

import { AuthadminService } from './services/authadmin.service';
import { AuthuserService } from './services/authuser.service';

import { LoginRedirect } from './services/login-redirect.service';
import { LogoutRedirectService } from './services/logout-redirect.service';
import { ReportService } from './services/user/report.service';
import { ReportadminComponent } from './components/admin/reportadmin/reportadmin.component';
import { UseradminComponent } from './components/admin/useradmin/useradmin.component';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './header/header.component';
import { AdminloginComponent } from './components/admin/adminlogin/adminlogin.component';
import { LeaveComponent } from './components/user/leave/leave.component';
import { HolidayComponent } from './components/user/holiday/holiday.component';
import { LeaveadminComponent } from './components/admin/leaveadmin/leaveadmin.component';
import { AttendanceComponent } from './components/user/attendance/attendance.component';
import { SmeComponent } from './components/admin/sme/sme.component';
import { TeamComponent } from './components/admin/team/team.component';
import { SendreportComponent } from './components/admin/sendreport/sendreport.component';
import { AbsentadminComponent } from './components/admin/absentadmin/absentadmin.component';
import { WfhComponent } from './components/admin/wfh/wfh.component';
import { PlComponent } from './components/admin/pl/pl.component';
import { Config } from '../load.config';
import { AdminholidayComponent } from './components/admin/adminholiday/adminholiday.component';

export function initializeApp(config: Config) {
    return () => config.load();
  }


@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        RegisterComponent,
        StatusComponent,
        ReportComponent,
        ReportadminComponent,
        UseradminComponent,
        HeaderComponent,
        AdminloginComponent,
        LeaveComponent,
        HolidayComponent,
        LeaveadminComponent,
        AttendanceComponent,
        SmeComponent,
        TeamComponent,
        SendreportComponent,
        AbsentadminComponent,
        WfhComponent,
        PlComponent,
        AdminholidayComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpModule,
        FormsModule,
        HttpClientModule,
        ModalModule.forRoot(),
        BrowserAnimationsModule,
        MatButtonModule,
        MatSnackBarModule,
        TimepickerModule.forRoot(),
        AmazingTimePickerModule,
        BsDatepickerModule.forRoot()
    ],
    providers: [
        AuthService,
        EnsureAuthenticated,
        AuthadminService,
        AuthuserService,
        LoginRedirect,
        LogoutRedirectService,
        ReportService,
        Config,
        {
            provide: APP_INITIALIZER,
            useFactory: initializeApp,
            deps: [Config], multi: true
          }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
