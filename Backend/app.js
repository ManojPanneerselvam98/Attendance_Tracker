var express = require('express'),
    app = express(),
    cors = require('cors'),
    path = require('path'),
    bodyParser = require('body-parser'),
    home = process.env.deployPath || ''; 
    app.use(cors());
// app.use(cors({
//     origin: 'http://localhost:4200'
// }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



var //UserController = require('./api/user/UserController'),
    AuthController = require('./api/auth/AuthController'),
    ReportController = require('./api/report/ReportController'),
    DayController = require('./api/report/DayController'),
    MakeDayController = require('./api/report/MakeDayController'),
    AttendanceController = require('./api/report/AttendanceController'),
    WfmController = require('./api/report/WFHController'),
    PlannedLeaveController = require('./api/report/PlannedLeaveController'),
    HolidayController = require('./api/report/HolidayController'),
    AdminReportController = require('./api/admin/report/ReportController'),
    
    SendReportController = require('./api/admin/report/SendReportController'),
    WFHAdminController = require('./api/admin/report/WFHReportController'),
    AdminHolidayController = require('./api/admin/report/HolidayController'),

    AdminMailReportController = require('./api/admin/report/MailReportController'),
    AdminPlannedLeaveController = require('./api/admin/report/PlannedLeaveController'),
    AdminMakeAbsentController = require('./api/admin/report/MakeAbsentController'),
    UserController = require('./api/admin/user/UserController');
    SmeController = require('./api/sme/SmeController');
    TeamController = require('./api/team/TeamController');
    HolidayAdminController = require('./api/holiday/HolidayController');
    PlannedLeaveAdminController = require('./api/plannedleave/PlannedLeaveController');

// app.use('/users', UserController)
// app.use('/api/auth', AuthController);
// app.use('/api/report', ReportController);
// app.use('/api/day', DayController);
// app.use('/api/wfh', WfmController);
// app.use('/api/admin/report', AdminReportController);
// app.use('/api/admin/user', UserController);

app.use(home+'/api/auth', AuthController);
app.use(home+'/api/report', ReportController);
app.use(home+'/api/day', DayController);
app.use(home+'/api/mday',MakeDayController);
app.use(home+'/api/attendanceLink',AttendanceController);
app.use(home+'/api/wfh', WfmController);
app.use(home+'/api/pl', PlannedLeaveController);
app.use(home+'/api/hl', HolidayController);
app.use(home+'/api/admin/sme', SmeController);
app.use(home+'/api/admin/team', TeamController);

app.use(home+'/api/admin/report', AdminReportController);
app.use(home+'/api/admin/sendreport', SendReportController);
app.use(home+'/api/admin/hl', AdminHolidayController);

app.use(home+'/api/admin/wfh', WFHAdminController);
app.use(home+'/api/admin/pl', AdminPlannedLeaveController);

app.use(home+'/api/admin/absent', AdminMakeAbsentController);
app.use(home+'/api/admin/mail', AdminMailReportController);
app.use(home+'/api/admin/user', UserController);
app.use(home+'/api/admin/holiday', HolidayAdminController);
app.use(home+'/api/admin/plannedleave', PlannedLeaveAdminController);






app.get('/markattendance',function(req,res){
    res.sendFile(path.join(__dirname+  '/markattendance.html'));
});

/*Build and Use this*/
/*app.use(express.static(path.join(__dirname, 'ui'))); 
app.use(function(req, res) {
    // Use res.sendfile, as it streams instead of reading the file into memory.
    res.sendfile(__dirname + '/ui/index.html');
}); */
/*Build and Use this*/
module.exports = app;