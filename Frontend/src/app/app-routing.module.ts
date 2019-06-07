import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { StatusComponent } from './components/status/status.component';
import { ReportComponent } from './components/user/report/report.component';
import { LeaveComponent } from './components/user/leave/leave.component';
import { HolidayComponent } from './components/user/holiday/holiday.component';
import { AttendanceComponent } from './components/user/attendance/attendance.component';

import { ReportadminComponent } from './components/admin/reportadmin/reportadmin.component';
import { UseradminComponent } from './components/admin/useradmin/useradmin.component';
import { LeaveadminComponent } from './components/admin/leaveadmin/leaveadmin.component';
import { AdminloginComponent } from './components/admin/adminlogin/adminlogin.component';
import { SmeComponent } from './components/admin/sme/sme.component';
import { TeamComponent } from './components/admin/team/team.component';
import { SendreportComponent } from './components/admin/sendreport/sendreport.component';
import { AbsentadminComponent } from './components/admin/absentadmin/absentadmin.component';
import { WfhComponent } from './components/admin/wfh/wfh.component';
import { PlComponent } from './components/admin/pl/pl.component';
import { AdminholidayComponent } from './components/admin/adminholiday/adminholiday.component';


import { EnsureAuthenticated } from './services/ensure-authenticated.service';
import { LoginRedirect } from './services/login-redirect.service';
import { AuthadminService } from './services/authadmin.service';
import { AuthuserService } from './services/authuser.service';

const routes: Routes = [
  { path: '', redirectTo: 'user/login', pathMatch: 'full' },
  { path: 'user/login', component: LoginComponent, canActivate: [LoginRedirect] },
  { path: 'admin/login', component: AdminloginComponent, canActivate: [LoginRedirect] },
  { path: 'user/register', component: RegisterComponent, canActivate: [LoginRedirect] },
  { path: 'user/status', component: StatusComponent, canActivate: [AuthuserService] },
  { path: 'user/report', component: ReportComponent,canActivate: [AuthuserService]},
  { path: 'user/attendance/:token', component: AttendanceComponent},
  { path: 'user/leave', component: LeaveComponent,canActivate: [AuthuserService]},
  { path: 'user/holiday', component: HolidayComponent,canActivate: [AuthuserService]},
  { path: 'admin/report', component: ReportadminComponent, canActivate: [AuthadminService]},
  { path: 'admin/user', component: UseradminComponent, canActivate: [AuthadminService]},
  { path: 'admin/sme', component: SmeComponent, canActivate: [AuthadminService]},
  { path: 'admin/team', component: TeamComponent, canActivate: [AuthadminService]},
  { path: 'admin/wfh', component: WfhComponent, canActivate: [AuthadminService]},
  { path: 'admin/pl', component: PlComponent, canActivate: [AuthadminService]},
  // { path: 'admin/send', component: SendreportComponent, canActivate: [AuthadminService]},
  { path: 'admin/absent', component: AbsentadminComponent, canActivate: [AuthadminService]},
  { path: 'admin/leave', component: LeaveadminComponent, canActivate: [AuthadminService]},
  { path: 'admin/hl', component: AdminholidayComponent, canActivate: [AuthadminService]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
