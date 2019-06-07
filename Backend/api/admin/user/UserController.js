var express = require('express'),
    jwt = require('jsonwebtoken'),
    router = express.Router(),
    config = require('../../../config'),
    User = require('../../user/User'),
    Report = require('../../report/Report'),
    VerifyToken = require('../../auth/VerifyToken'),
    custom = require('../../auth/custom'),
    bcrypt = require('bcryptjs'),
    dateFormat = require('dateformat'),
    //now = new Date(),
    chkUser = [VerifyToken, custom],
    cron = require('node-cron'),
    CronJob = require('cron').CronJob;
    //queryString = require('query-string');


function sendReminderAttendanceMail() {
    Report.find({ curdate: dateFormat(new Date(), "d"), curmonth: dateFormat(new Date(), "mmm"), curyear: dateFormat(new Date(), "yyyy"), status: '' }, function (err, reports) {
        if (err) return res.status(500).send("There was a problem finding the users.");
        for (let reportData of reports) {
            User.find({ username: reportData.username, status:'1'}, function (err, users) {
                if (err) return res.status(500).send("There was a problem finding the users.");

                for (let item of users) {
				//console.log(item.username +' --> '+item.token)
                    //console.log(item.username +' --> '+item.token)
                    let randomVal = '&id='+Math.floor(Math.random() * 10000000000);
                    var shiftEmp = '';
                    if(item.shift == 1){
                        shiftEmp = '&statusVal=shift';
                    }
                    const  sendmail  =  require('sendmail')({
                        silent: true,
                    })
                    sendmail({
                        from:  config.defaultMailer,
                        to: 'mpanneerselvam@tnsi.com',
                        //to:  item.email,
                        //cc: item.supervisor,
                        subject:   'Attendance Reminder for ' + dateFormat(new Date(), "d") + `-` + dateFormat(new Date(), "mmm") + `-` + dateFormat(new Date(), "yyyy"),
                        html: `<table> Dear ` + item.name + `</table>
                              <table style="margin-right:50px;">Your have not marked your attendence for Today.<br/>Please <a href=`+ config.dailyAttendanceMailUrl + item.token + randomVal + shiftEmp + `> Click here </a> to mark your attendance.
                              <br/>
                              <br/>
                             <b> Dear Supervisor</b>,
                              <br/>
                                  Please mark appropriate attendance in case of absence/WFH.<br/>
                                  <table style="margin-right:50px;"><a href=`+ config.dailyAttendanceMailUrl + item.token +`&statusVal=W`+ randomVal +`> Work From Home </a><br/></table>
                                  <table style="margin-right:50px;"><a href=`+ config.dailyAttendanceMailUrl + item.token +`&statusVal=US`+ randomVal +`> Sick Leave </a><br/></table>
                                  <table style="margin-right:50px;"><a href=`+ config.dailyAttendanceMailUrl + item.token +`&statusVal=UE`+ randomVal +`> Emergency Leave </a></table>
								  <table style="margin-right:50px;"><a href=`+ config.dailyAttendanceMailUrl + item.token +`&statusVal=PL`+ randomVal +`> Planned Vacation </a></table>
                              </table>
                                  `
                    },  function (err,  reply) {
                        //console.log(err  &&  err.stack);
                        //console.dir(reply);
                    })
                }
            });
        }
    });
}

function sendDailyAttendance() {
    User.find({ role: 'User', status:'1'}, function (err, users) {
    //Report.find({ curdate: dateFormat(new Date(), "d"), curmonth: dateFormat(new Date(), "mmm"), curyear: dateFormat(new Date(), "yyyy"), status: '' }, function (err, users) {
        if (err) return res.status(500).send("There was a problem finding the users.");
        //res.status(200).send(users);
        for (let item of users) {
            //console.log(item.username+'-->'+item.token);
            var shiftEmp = '';
            if(item.shift == 1){
                shiftEmp = '&statusVal=shift';
            }
            //console.log(item.email); // Will display contents of the object inside the array
            const  sendmail  =  require('sendmail')({
                silent: true,
            })
            sendmail({
                from:  config.defaultMailer,
                to:  item.email,
                //to: 'mpanneerselvam@tnsi.com',
                subject:  'Attendance for ' + dateFormat(new Date(), "d") + `-` + dateFormat(new Date(), "mmm") + `-` + dateFormat(new Date(), "yyyy"),
                //html: '<h1>Mail of test sendmail <h1><p>'+url+item.token+'</p>'
                //html: `<table> Dear ` + item.name + `</table>
                            // <table style="margin-right:50px;"> Please  <a href=`+ url +`> Click Here </a> to mark your attendence. </table>
                            // <table style="margin-right:50px;"><a href=`+ config.dailyAttendanceMailUrl + item.token +`> Click Here </a> to mark your attendence.</table>
                            // <table style="margin-right:50px;"> <b>You should be logged in to VPN to mark your attendence.</b> </table>`
                html: `<table> Dear ` + item.name + `</table>
                <table style="margin-right:50px;">Mark your attendence for Today.<br/>Please <a href=`+ config.dailyAttendanceMailUrl + item.token + shiftEmp + `> Click here </a> <br/><b>You should be logged in to VPN to mark your attendence.</b>
                `
            },  function (err,  reply) {
                console.log(err  &&  err.stack);
                console.dir(reply);
            })
        }
    });
}

function sendDailyAttendanceCustom() {
    var sortbyData = { curdate: 1 };
  Report.find({
    curdate: dateFormat(new Date(), "d"),
    curmonth: dateFormat(new Date(), "mmm"),
    curyear: dateFormat(new Date(), "yyyy"),
    status : ''
  })
    .populate("user", "sme team name token shift", User)
    .then(report => {
        //console.log(report);
        for (let item of report){
            //console.log(item.username+'-->'+item.token);
            //console.log(Math.floor(Math.random() * 10000000000))
            let randomVal = '&id='+Math.floor(Math.random() * 10000000000);
            var shiftEmp = '';
            if(item.user.shift == 1){
                shiftEmp = '&statusVal=shift';
            }
            //console.log(item.email); // Will display contents of the object inside the array
            const  sendmail  =  require('sendmail')({
                silent: true,
            })
            sendmail({
                from:  config.defaultMailer,
                //to:  item.email,
                to: 'mpanneerselvam@tnsi.com',
                subject:  'Attendance for ' + dateFormat(new Date(), "d") + `-` + dateFormat(new Date(), "mmm") + `-` + dateFormat(new Date(), "yyyy"),
                //html: '<h1>Mail of test sendmail <h1><p>'+url+item.token+'</p>'
                //html: `<table> Dear ` + item.name + `</table>
                            // <table style="margin-right:50px;"> Please  <a href=`+ url +`> Click Here </a> to mark your attendence. </table>
                            // <table style="margin-right:50px;"><a href=`+ config.dailyAttendanceMailUrl + item.token +`> Click Here </a> to mark your attendence.</table>
                            // <table style="margin-right:50px;"> <b>You should be logged in to VPN to mark your attendence.</b> </table>`
                html: `<table> Dear ` + item.user.name + `</table>
                <table style="margin-right:50px;">Mark your attendence for Today.<br/>Please <a href=`+ config.dailyAttendanceMailUrl + item.user.token + randomVal + shiftEmp + `> Click here </a> <br/><b>You should be logged in to VPN to mark your attendence.</b>
                `
            },  function (err,  reply) {
                console.log(err  &&  err.stack);
                console.dir(reply);
            })
        }
    })
    .catch(err => {
      console.log(err);
    });

}


new CronJob('01 10 * * 1-5', function () {
    //sendDailyAttendance();
}, null, true, 'Asia/Kolkata');

new CronJob('01,15 11 * * 1-5', function () {
    //sendReminderAttendanceMail();
}, null, true, 'Asia/Kolkata');


new CronJob('* * * * 1-5', function () {
    //sendDailyAttendance();
    //sendReminderAttendanceMail();
    //sendDailyAttendanceCustom();
}, null, true, 'Asia/Kolkata');

router.get("/custom", function(req, res) {
    console.log("object")
    //sendDailyAttendance()
    //sendReminderAttendanceMail();
    sendDailyAttendanceCustom();
    sendReminderAttendanceMail();
});



/** cron.schedule('* * * * 1-5', () => {
});**/


// To get all User
router.get('/', chkUser, function (req, res) {
    if (req.user.role == "admin" || req.user.role == "webadmin" || req.user.role == "posadmin") {
        User.find({role:"User"}).select("-password").sort('name')
            .then(users => {
                //console.log("Test");
                res.send(users);
            }).catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving Report."
                });
            });
    } else {
        res.status(500).send({
            message: "You need to Login as a Admin"
        });
    }

});

router.get('/users', chkUser, function (req, res) {
    if (req.user.role == "admin" || req.user.role == "webadmin" || req.user.role == "posadmin") {
        User.find({
            role: 'User', status:'1'
        }).select("-password")
            .then(users => {
                res.send(users);
            }).catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving Report."
                });
            });
    } else {
        res.status(500).send({
            message: err || "You need to Login as a Admin"
        });
    }
});

// To get User by ID
router.get('/:id', chkUser, function (req, res) {
    if (req.user.role == "admin" || req.user.role == "webadmin" || req.user.role == "posadmin") {
        User.find({ _id: req.params.id }).select("-password")
            .then(users => {
                res.send(users);
            }).catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving Report."
                });
            });
    } else {
        res.status(500).send({
            message: err || "You need to Login as a Admin"
        });
    }
});

// To Save Database
router.post('/', chkUser, function (req, res, err) {
    if (req.body.name && req.body.username && req.body.email && req.body.supervisoremail && req.body.sme && req.body.team && req.body.status && req.body.shift) {
        if (req.user.role == "admin" || req.user.role == "webadmin" || req.user.role == "posadmin") {
            //var hashedPassword = bcrypt.hashSync(req.body.password, 8);
            User.find({ $or: [{ username: req.body.username }, { email: req.body.email }] }, function (err, item) {
                if (err) throw (err);
                if (item.length > 0) {
                    res.status(500).send({
                        message: "Username or Email alerady exist"
                    });
                } else if (item.length == 0) {
                    User.create({
                        name: req.body.name,
                        email: req.body.email,
                        username: req.body.username,
                        //password: hashedPassword,
                        role: req.body.role,
                        supervisor: req.body.supervisoremail,
                        sme: req.body.sme,
                        team: req.body.team,
                        status: req.body.status,
                        shift: req.body.shift,
                        token: ''
                    },
                        function (err, user) {
                            if (err) return res.status(500).send("There was a problem registering the user.")
                            var token = jwt.sign({ id: user._id }, config.secret);
                            var cusToken = token
                            User.findOneAndUpdate({ _id: user._id }, { $set: { token: cusToken } }, { upsert: true }, function (err, doc) {
                                if (err) { throw err; }
                                else {
                                    //console.log("Updated");
                                }
                            });
                            res.status(200).send({ auth: true, token: token });

                        });
                }
            });

        } else {
            res.status(500).send({
                message: err || "You need to Login as a Admin"
            });
        }
    } else {
        res.status(500).send({
            message: "You need Send all Fields"
        });
    }
});

router.put('/:id', chkUser, function (req, res) {
    if (req.body.name && req.body.username && req.body.email && req.body.supervisor && req.body.sme && req.body.team && req.body.status && req.body.shift) {
        if (req.user.role == "admin" || req.user.role == "webadmin" || req.user.role == "posadmin") {
            User.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true }).select("-password")
                .then(users => {
                    res.send(users);
                }).catch(err => {
                    res.status(500).send({
                        message: err.message || "Some error occurred while retrieving Report."
                    });
                });
        } else {
            res.status(500).send({
                message: err || "You need to Login as a Admin"
            });
        }
    } else {
        res.status(500).send({
            message: "You need Send all Fields"
        });
    }
});

/** router.delete('/:id', chkUser, function (req, res) {
    if (req.user.role == "admin" || req.user.role == "webadmin" || req.user.role == "posadmin") {
        User.findByIdAndDelete(req.params.id)
            .then(users => {
                res.send(users);
            }).catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving Report."
                });
            });
    } else {
        res.status(500).send({
            message: err || "You need to Login as a Admin"
        });
    }
}); **/


module.exports = router;