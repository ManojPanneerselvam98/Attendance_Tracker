var express = require("express"),
    jwt = require("jsonwebtoken"),
    router = express.Router(),
    config = require("../../config"),
    User = require("../user/User"),
    Report = require("../report/Report"),
    VerifyToken = require("../auth/VerifyToken"),
    custom = require("../auth/custom"),
    dateFormat = require("dateformat"),
    //now  = new Date(),
    chkUser = [VerifyToken, custom],
    async = require("async"),
	fs = require('fs');


function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

router.get("/", function(req, res) {
    var token = req.query.token;
    var statusVal = req.query.statusVal;
    var currYear = dateFormat(new Date(), "yyyy");
    var currMonth = dateFormat(new Date(), "m");
    var currMonthCount = new Date(currYear, currMonth, 0).getDate();
    decoded = jwt.verify(token, config.secret);
    User.findById(decoded.id, { password: 0 }, function(err, user) {
        if (err)
            return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
        // Insert Date
        Report.find({
            username: user.username,
            curdate: dateFormat(new Date(), "d"),
            curmonth: dateFormat(new Date(), "mmm"),
            curyear: dateFormat(new Date(), "yyyy")
        })
            .then(report => {
            //console.log(report.length);
            // No date in Current Month
            if (report.length == 0) {
                for ($i = 0; $i < currMonthCount; $i++) {
                    const reportData = new Report({
                        username: user.username,
						user: user._id,
                        userId: user._id,
                        curdate: $i + 1,
                        curmonth: dateFormat(new Date(), "mmm"),
                        curyear: dateFormat(new Date(), "yyyy"),
                        status: "",
                        type: "",
                        reason: ""
                    });
                    reportData
                        .save()
                        .then(data => {
                        //res.send(data);
                        //res.send("Your attendance has been marked");
                        var options = { hour12: false };
                        var indTime = new Date().toLocaleTimeString("en-US",{ timeZone: "Asia/Kolkata" });
                        //console.log(indTime);
                        const reportData = {
                            time: indTime,
                            status: "O"
                        };
                        var d = new Date();
                        var getTot = daysInMonth(d.getMonth() + 1, d.getFullYear());
                        var sat = new Array();
                        var sun = new Array();
                        var WO = new Array();
                        for (var i = 1; i <= getTot; i++) {
                            var newDate = new Date(d.getFullYear(), d.getMonth(), i);
                            if (newDate.getDay() == 0) {
                                WO.push(i);
                            }
                            if (newDate.getDay() == 6) {
                                WO.push(i);
                            }
                        }
                        //console.log(WO);
                        req.body = WO;
                        for (var a in req.body) {
                            Report.findOneAndUpdate(
                                {
                                    username: user.username,
                                    curdate: req.body[a],
                                    curmonth: dateFormat(new Date(), "mmm"),
                                    curyear: dateFormat(new Date(), "yyyy")
                                },
                                reportData
                            )
                                .then(report => {
                                //res.send(report);
                                var options = { hour12: false };
                                var indTime = new Date().toLocaleTimeString("en-US",{ timeZone: "Asia/Kolkata" });
                                //console.log(indTime);
                                //var curtime = dateFormat(new Date(), "HH:MM"),

                                var lType ='',
                                lReason = '';
                                if(statusVal =='US'){
                                    statusVal = 'A';
                                    lType = 'Sick Leave';
                                    lReason = 'Sick Leave';
                                } 
                                else if (statusVal == 'UE'){
                                    statusVal = 'A';
                                    lType = 'Emergencey Personal Leave';
                                    lReason = 'Emergencey Personal Leave';
                                } else if(statusVal =="PL"){
                                    statusVal = 'PL';
                                    lType = 'Planned Leave';
                                    lReason = 'Planned Vacation';
                                } else if(statusVal == 'shift'){
                                    statusVal = 'P';
                                }
                                curstatus = "";
                                if(statusVal){
                                    curstatus = statusVal
                                } else {
                                    if(statusVal == 'shift'){
                                        curstatus = "P";
                                    }else {
                                        if (indTime <= "11:00:00 AM") {
                                            curstatus = "P";
                                        } else {
                                            curstatus = "D";
                                        }
                                    }
                                }
                                const reportData = {
                                    username: user.username,
                                    time: indTime,
                                    status: curstatus
                                };
                                Report.findOneAndUpdate(
                                    {
                                        username: user.username,
                                        curdate: dateFormat(new Date(), "d"),
                                        curmonth: dateFormat(new Date(), "mmm"),
                                        curyear: dateFormat(new Date(), "yyyy")
                                    },
                                    reportData
                                ).populate('user', 'sme team name', User)
                                    .then(report => {
                                    if (!report) {
                                        return res.status(404).send({
                                            message:
                                            "Report not found with Username " +
                                            user.username
                                        });
                                    }
                                    //res.send(report);
                                    //res.send("Your attendance has been marked");
                                    let val = '';
									if(curstatus== "P"){
										val = "Attendance for "+report.user.name +" has been marked as Present";
									}else if(curstatus== "D"){
										val = "Attendance for "+report.user.name +" has been marked as Delay";
									} else if(curstatus =="A" && lReason =="Emergencey Personal Leave"){
										val = "Attendance for "+report.user.name +" has been marked as Emergencey Personal Leave";
									} else if(curstatus=="A" && lReason  =="Sick Leave"){
										val = "Attendance for "+report.user.name +" has been marked as Sick Leave";
									} else if(curstatus == "W"){
										val = "Attendance for "+report.user.name +" has been marked as Work From Home";
									} else if(curstatus == "PL"){
                                        val = "Attendance for "+report.user.name +" has been marked as Planned Vacation";
                                    }
									//console.log("else loop"+val)
									//res.send(report);
									res.redirect('/markattendance?val='+val);
									//const html = fs.readFileSync( __dirname + '/AttendanceReport.html' );
									//res.json(val);
                                })
                                    .catch(err => {
                                    if (err.kind === "ObjectId") {
                                        return res.status(404).send({
                                            message:
                                            "Report not found with Username " +
                                            user.username
                                        });
                                    }
                                    return res.status(500).send({
                                        message:
                                        "Error updating report with Username " +
                                        user.username
                                    });
                                });
                            })
                                .catch(err => {
                                if (err.kind === "ObjectId") {
                                    return res.status(404).send({
                                        message:
                                        "Report not found with Username " + user.username
                                    });
                                }
                            });
                        }
                    })
                        .catch(err => {
                        res.status(500).send({
                            message: "Some error occurred while creating the Note."
                        });
                    });
                }
            } else {
                var options = { hour12: false };
                var indTime = new Date().toLocaleTimeString("en-US",{ timeZone: "Asia/Kolkata" });
                //console.log(indTime);
                //var curtime = dateFormat(new Date(), "HH:MM"),
                var lType ='',
                    lReason = '';
                if(statusVal =='US'){
                    statusVal = 'A';
                    lType = 'Sick Leave';
                    lReason = 'Sick Leave';
                } 
                else if (statusVal == 'UE'){
                    statusVal = 'A';
                    lType = 'Emergencey Personal Leave';
                    lReason = 'Emergencey Personal Leave';
                } else if(statusVal =="PL"){
                    statusVal = 'PL';
                    lType = 'Planned Leave';
                    lReason = 'Planned Vacation';
                } else if(statusVal == 'shift'){
                    statusVal = 'P';
                }
                curstatus = "";
                if(statusVal){
                    curstatus = statusVal
                } else {
                    if(statusVal == 'shift'){
                        curstatus = "P";
                    }else {
                        if (indTime <= "11:00:00 AM") {
                            curstatus = "P";
                        } else {
                            curstatus = "D";
                        }
                    }
                }
                const reportData = {
                    username: user.username,
                    time: indTime,
                    status: curstatus,
                    type: lType,
                    reason: lReason
                };
                Report.findOneAndUpdate(
                    {
                        username: user.username,
                        curdate: dateFormat(new Date(), "d"),
                        curmonth: dateFormat(new Date(), "mmm"),
                        curyear: dateFormat(new Date(), "yyyy")
                    },
                    reportData
                ).populate('user', 'sme team name', User)
                    .then(report => {
				
                    if (!report) {
                        return res.status(404).send({
                            message: "Report not found with Username " + user.username
                        });
                    }
                    let val = '';
                    if(curstatus== "P"){
						val = "Attendance for "+report.user.name +" has been marked as Present";
					}else if(curstatus== "D"){
                        val = "Attendance for "+report.user.name +" has been marked as Delay";
                    } else if(curstatus =="A" && lReason =="Emergencey Personal Leave"){
                        val = "Attendance for "+report.user.name +" has been marked as Emergencey Personal Leave";
                    } else if(curstatus=="A" && lReason  =="Sick Leave"){
                        val = "Attendance for "+report.user.name +" has been marked as Sick Leave";
                    } else if(curstatus == "W"){
                        val = "Attendance for "+report.user.name +" has been marked as Work From Home";
                    } else if(curstatus == "PL"){
                        val = "Attendance for "+report.user.name +" has been marked as Planned Vacation";
                    }
					
                    //console.log("else loop"+val)
                    //res.send(report);
                    res.redirect('/markattendance?val='+val);
                    //const html = fs.readFileSync( __dirname + '/AttendanceReport.html' );
                    //res.json(val);
                })
                    .catch(err => {
                    if (err.kind === "ObjectId") {
                        return res.status(404).send({
                            message: "Report not found with Username " + user.username
                        });
                    }
                    return res.status(500).send({
                        message: "Error updating report with Username " + user.username
                    });
                });
            }
        })
            .catch(err => {
            res.status(500).send({
                message: "Some error occurred while retrieving Report."
            });
        });
    });
});



module.exports = router;
