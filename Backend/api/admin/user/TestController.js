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



module.exports.test = function(){
	console.log("Test from User Controller");
}

module.exports.dailyStatusMail = function(){
//function dailyStatusMail(){
    var sortbyData = { curdate: 1 };
    //if (user.role == "admin") {
        Report.find({
            curmonth: dateFormat(new Date(), "mmm"),
            curyear: dateFormat(new Date(), "yyyy")
        }).sort(sortbyData)
            .then(report => {
                //res.send(report);
                var htmlHead="",
                    htmlBody="",
                    htmlVal="",
                    htmlHeadStatus="",
                    htmlBodyStatus="";
                let date = new Date();
                let days = daysInMonth(date.getMonth() + 1, date.getFullYear());
                this.headers = Array(days).fill(0).map((x, i) => i + 1);
                htmlHead = htmlHead +`<td style="text-align:center;border-bottom:1px solid #000;margin:2px;border-right:1px solid #000;font-size: 11px;background:gray;">`+dateFormat(new Date(), "mmm") 
                for (var i of this.headers) {
                    htmlHead = htmlHead + `<td style="text-align:center;border-bottom:1px solid #000;margin:2px;font-size: 11px;background:gray;">` + i+`</td>`
                }
                htmlHead = htmlHead +"</td>"
                result = report.reduce(function (r, a) {
                    r[a.username] = r[a.username] || [];
                    r[a.username].push(a);
                    return r;
                }, Object.create(null));
                for (var key in result) {
                    htmlBody = htmlBody + `<tr width="100%" style="border-collapse: collapse;border-spacing: 0;"><td style="text-align:center;margin:2px;border-right:1px solid #000;font-size: 11px;padding:0;">`+key+`</td>`;
                    let status = result[key];
                    for (item of status) {
                        var style = '';
                        if(item.status =="PL"){
                            style ='background:green';
                        }
                        if(item.status == "A"){
                            style ='background:red'
                        }
                        if(item.status == "W"){
                            style ='background:blue'
                        }
                        if(item.status == "D"){
                            style ='color:orange'
                        }
                        if(item.status == "O"){
                            style ='background:gray;color:gray'
                          
                        }
                        //if(item.stack != "WO"){
                            htmlBody = htmlBody + `<td style="text-align:center;margin:2px;font-size: 11px;`+style+` " >`+ item.status + `</td>`
                        //}
                    }
                    htmlBody = htmlBody + "</tr>" ;
                }

                htmlHeadStatus = htmlHeadStatus + `<td style="text-align:center;border-bottom:1px solid #000;margin:2px;font-size: 11px;border-right:1px solid #000;"> SWAT / Project</td>`
                htmlHeadStatus = htmlHeadStatus + `<td style="text-align:center;border-bottom:1px solid #000;margin:2px;font-size: 11px;border-right:1px solid #000;"> Resource </td>`
                htmlHeadStatus = htmlHeadStatus + `<td style="text-align:center;border-bottom:1px solid #000;margin:2px;font-size: 11px;border-right:1px solid #000;"> Activity </td>`
                htmlHeadStatus = htmlHeadStatus + `<td style="text-align:center;border-bottom:1px solid #000;margin:2px;font-size: 11px;border-right:1px solid #000;"> Start Date </td>`
                htmlHeadStatus = htmlHeadStatus + `<td style="text-align:center;border-bottom:1px solid #000;margin:2px;font-size: 11px;border-right:1px solid #000;"> Target Date </td>`
                htmlHeadStatus = htmlHeadStatus + `<td style="text-align:center;border-bottom:1px solid #000;margin:2px;font-size: 11px;border-right:1px solid #000;"> Duration </td>`
                htmlHeadStatus = htmlHeadStatus + `<td style="text-align:center;border-bottom:1px solid #000;margin:2px;font-size: 11px;border-right:1px solid #000;"> TMS (hours) </td>`
                htmlHeadStatus = htmlHeadStatus + `<td style="text-align:center;border-bottom:1px solid #000;margin:2px;font-size: 11px;border-right:1px solid #000;"> Comp Status </td>`
                htmlHeadStatus = htmlHeadStatus + `<td style="text-align:center;border-bottom:1px solid #000;margin:2px;font-size: 11px;border-right:1px solid #000;"> Status </td>`

                axios.get('http://172.20.39.210:9000/report/?key=admin')
                    .then(response => {
                        for(var statusData of response.data){
                            //if (statusData.status =='WIP'){
                                htmlBodyStatus = htmlBodyStatus + `<tr style="text-align:center;border-bottom:1px solid #000;margin:2px;font-size: 11px;">` ;
                                //console.log("Manoj"+statusData.resourceName)
                                    htmlBodyStatus = htmlBodyStatus + `<td style="text-align:center;margin:2px;font-size: 11px;border-bottom:1px solid #000;border-right:1px solid #000;">`+ statusData.task + `</td>`
                                    htmlBodyStatus = htmlBodyStatus + `<td style="text-align:center;margin:2px;font-size: 11px;border-bottom:1px solid #000;border-right:1px solid #000;">`+ statusData.resourceName + `</td>`
                                    htmlBodyStatus = htmlBodyStatus + `<td style="text-align:center;margin:2px;font-size: 11px;border-bottom:1px solid #000;border-right:1px solid #000;">`+ statusData.activity + `</td>`
                                    htmlBodyStatus = htmlBodyStatus + `<td style="text-align:center;margin:2px;font-size: 11px;border-bottom:1px solid #000;border-right:1px solid #000;">`+ statusData.startDate + `</td>`
                                    htmlBodyStatus = htmlBodyStatus + `<td style="text-align:center;margin:2px;font-size: 11px;border-bottom:1px solid #000;border-right:1px solid #000;">`+ statusData.endDate + `</td>`
                                    htmlBodyStatus = htmlBodyStatus + `<td style="text-align:center;margin:2px;font-size: 11px;border-bottom:1px solid #000;border-right:1px solid #000;">`+ statusData.duration + `</td>`
                                    htmlBodyStatus = htmlBodyStatus + `<td style="text-align:center;margin:2px;font-size: 11px;border-bottom:1px solid #000;border-right:1px solid #000;">`+ statusData.tms + `</td>`
                                    htmlBodyStatus = htmlBodyStatus + `<td style="text-align:center;margin:2px;font-size: 11px;border-bottom:1px solid #000;border-right:1px solid #000;">`+ statusData.completionStatus + `</td>`
                                    htmlBodyStatus = htmlBodyStatus + `<td style="text-align:center;margin:2px;font-size: 11px;border-bottom:1px solid #000;border-right:1px solid #000;">`+ statusData.status + `</td>`
                                htmlBodyStatus = htmlBodyStatus + `</tr>` ;
                            //}

                        }
                        
                   // console.log(response.data);
                    htmlVal = `<table style="margin-bottom:25px"> Hi All, </table><table style="margin-bottom:25px">Please find the updated status ,</table><table width="75%" style="border-style:solid; border-width:1px; border-color:#000000;border-collapse: collapse;border-spacing: 0;">
                    <tr width="100%" style="border-collapse: collapse;border-spacing: 0;">`+ htmlHead + `</tr>` +htmlBody+`</table>
                    <table style="margin-bottom:25px"></table><table style="margin-bottom:25px"></table><table style="margin-bottom:25px"></table>
                    </table><table width="75%" style="border-style:solid; border-width:1px; border-color:#000000;border-collapse: collapse;border-spacing: 0;">
                    <tr width="100%" style="background:yellow">`+ htmlHeadStatus + `</tr>` +htmlBodyStatus+`</table>`
                const  sendmail  =  require('sendmail')({
                    silent: true,
                })
                var email = [];
                User.find({role:'User'}, function (err, users) {
                    if (err) return res.status(500).send("There was a problem finding the users.");
                    for (let item of users) {
                        email.push(item.email)
                    }
                
                sendmail({
                    from:  config.defaultMailer,
                    to:  'mpanneerselvam@tnsi.com',
                    //to: email,
                    cc: config.managerMail,
                    subject:  'Team Status',
                    html: htmlVal
                },  function (err,  reply) {
                    console.log(err  &&  err.stack);
                    console.dir(reply);
                })
            });
                    
                })
                .catch(error => {
                    console.log(error);
                });

                
                
            //console.log(result);
            }).catch(err => {
                // res.status(500).send({
                //     message: err.message || "Some error occurred while retrieving Report."
                // });
                console.log(err);
            });
}





module.exports.clientMail = function(){
var sortbyData = { curdate: 1 };
    Report.find({
        curdate: dateFormat(new Date(), "d"),
        curmonth: dateFormat(new Date(), "mmm"),
        curyear: dateFormat(new Date(), "yyyy"),
        $or: [{ status: 'A' }, { status: 'PL' }]
    }).populate('user', 'sme team name', User)
        .then(report => {
            //res.send(report);
            console.log(report.length);
            var htmlBody="",
                htmlVal="";
            if (report.length > 0) {
                for (let item of report) {
                    htmlBody = htmlBody + `<tr width="100%" cellpadding="2" cellspacing="0">
                        <td style="text-align:center;padding:10px;border-right:1px solid #000;border-bottom:1px solid #000">`+ item.user.name + `</td>
                        <td style="text-align:center;padding:10px;border-right:1px solid #000; border-bottom:1px solid #000">`+ item.user.sme + `</td>
                        <td style="text-align:center;padding:10px;border-right:1px solid #000; border-bottom:1px solid #000">`+ item.user.team + `</td>
                        <td style="text-align:center;padding:10px;border-right:1px solid #000; border-bottom:1px solid #000">`+ dateFormat(new Date(), "d") + `-` + dateFormat(new Date(), "mmm") + `-` + dateFormat(new Date(), "yyyy") + `</td>
                        <td style="text-align:center;padding:10px;border-right:1px solid #000; border-bottom:1px solid #000">1</td>
                        <td style="text-align:center;padding:10px;border-right:1px solid #000; border-bottom:1px solid #000">`+ item.type + `</td>
                        <td style="text-align:center;padding:10px;border-bottom:1px solid #000">`+ item.reason + `</td>
                    </tr>`
                }

                htmlVal = `<table style="margin-bottom: 30px;"><tr><td>Please find the planned/unplanned absence details of PSD offshore network group for <b>` + dateFormat(new Date(), "d") + `-` + dateFormat(new Date(), "mmm") + `-` + dateFormat(new Date(), "yyyy") + `</b></td></tr></table>
                <table width="75%" cellpadding="2" cellspacing="0" style="border-style:solid; border-width:1px; border-color:#000000;border-bottom:none">
                <tr width="100%" cellpadding="2" cellspacing="0">
                    <th style="text-align:center; border-bottom:1px solid #000; padding:10px;border-right:1px solid #000;background-color:rgb(0,180, 200)">Resource Name</th>
                    <th style="text-align:center; border-bottom:1px solid #000; padding:10px;border-right:1px solid #000;background-color:rgb(0,180, 200)">TNS SME</th> 
                    <th style="text-align:center; border-bottom:1px solid #000; padding:10px;border-right:1px solid #000;background-color:rgb(0,180, 200)">Module</th>
                    <th style="text-align:center; border-bottom:1px solid #000; padding:10px;border-right:1px solid #000;background-color:rgb(0,180, 200)">Leave Date</th>
                    <th style="text-align:center; border-bottom:1px solid #000; padding:10px;border-right:1px solid #000;background-color:rgb(0,180, 200)">Leave Duration (days)</th>
                    <th style="text-align:center; border-bottom:1px solid #000; padding:10px;border-right:1px solid #000;background-color:rgb(0,180, 200)">Type of Absence</th>
                    <th style="text-align:center; border-bottom:1px solid #000; padding:10px;background-color:rgb(0,180, 200)">Reason for Absence</th>
                </tr>`
                    + htmlBody +
                    `</table><table style="margin-bottom: 10px;margin-top: 30px;"><tr><td>Regards</td></tr><tr><td style="color:blue">` + config.managerSignature + `</td></tr></table>`;
            } else {
                htmlVal = `<table style="margin-bottom: 30px;"><tr><td>There were no planned/unplanned absence in PSD offshore network group for <b>` + dateFormat(new Date(), "d") + `-` + dateFormat(new Date(), "mmm") + `-` + dateFormat(new Date(), "yyyy") + `</b></td></tr></table>
                <table style="margin-bottom: 10px;margin-top: 30px;"><tr><td>Regards</td></tr><tr><td style="color:blue">`+ config.managerSignature + `</td></tr></table>`;
            }
            const  sendmail  =  require('sendmail')({
                silent: true,
            })
            sendmail({
                //from:  'no-reply@tnsi.com',
                from: config.managerMail,
                //to:  config.clientReportTo,
                //cc: config.clientReportCC,
                to: 'mpanneerselvam@tnsi.com',
                subject:  'TNS Offshore Network Group: Absence Intimation ' + dateFormat(new Date(), "d") + `-` + dateFormat(new Date(), "mmm") + `-` + dateFormat(new Date(), "yyyy"),
                html: htmlVal
            },  function (err,  reply) {
                console.log(err  &&  err.stack);
                console.dir(reply);
            })
            //res.send(report);
           // console.log(report);
        }).catch(err => {
            // res.status(500).send({
            //     message: err.message || "Some error occurred while retrieving Report."
            // });
            console.log(err);
        });
}

module.exports.remindPOCMail = function(){
    var sortbyData = { curdate: 1 };
    Report.find({
        curdate: dateFormat(new Date(), "d"),
        curmonth: dateFormat(new Date(), "mmm"),
        curyear: dateFormat(new Date(), "yyyy"),
        status: '' 
    }).populate('user', 'sme team name supervisor token', User)
        .then(report => {
        var htmlBody="",
            htmlVal="";
        if (report.length > 0) {
            for (let item of report) {
                //console.log(report);
                htmlBody = htmlBody + `<tr width="100%" cellpadding="2" cellspacing="0">
<td style="text-align:center;padding:10px;border-right:1px solid #000;border-bottom:1px solid #000">`+ item.user.name + `</td>
<td style="text-align:center;padding:10px;border-right:1px solid #000;border-bottom:1px solid #000"> 
<br/><span><a href=`+ config.dailyAttendanceMailUrl + item.user.token + `> Present </a></span> <br/>
<span><a href=`+ config.dailyAttendanceMailUrl + item.user.token + `&statusVal=W> Work From Home </a></span> <br/>
<span><a href=`+ config.dailyAttendanceMailUrl + item.user.token + `&statusVal=US> Sick Leave </a></span><br/>    
<span><a href=`+ config.dailyAttendanceMailUrl + item.user.token + `&statusVal=UE> Emergency Personal Leave </a></span> </br>
</td>
</tr>`
            }
            htmlVal = `<table style="margin-bottom: 30px;"><tr><td>Below Users have not marked attendance on <b>` + dateFormat(new Date(), "d") + `-` + dateFormat(new Date(), "mmm") + `-` + dateFormat(new Date(), "yyyy") + `</b></td></tr></table>
<table width="50%" cellpadding="2" cellspacing="0" style="border-style:solid; border-width:1px; border-color:#000000;">
<tr width="100%" cellpadding="2" cellspacing="0">
<th style="text-align:center; border-bottom:1px solid #000; padding:10px;border-right:1px solid #000;background-color:rgb(0,180, 200)">Resource Name</th>
<th style="text-align:center; border-bottom:1px solid #000; padding:10px;border-right:1px solid #000;background-color:rgb(0,180, 200)">Mark Attendance</th>
</tr>`
                + htmlBody +
                `</table><table style="margin-bottom: 10px;margin-top: 30px;"><tr><td>Regards</td></tr><tr><td style="color:blue">` + config.managerSignature + `</td></tr></table>`;

            const  sendmail  =  require('sendmail')({
                silent: true,
            })
            sendmail({
                from: config.defaultMailer,
                //to:'mpanneerselvam@tnsi.com',
                to:  config.pocMail,
                cc: config.managerMail,
                subject:  'Not Marked Attendance ' + dateFormat(new Date(), "d") + `-` + dateFormat(new Date(), "mmm") + `-` + dateFormat(new Date(), "yyyy"),
                html: htmlVal
            },  function (err,  reply) {
                console.log(err  &&  err.stack);
                console.dir(reply);
            })
        } else {
            // res.send(report);
            //console.log(report);
        }
        //res.send(report);
        console.log(report);
    }).catch(err => {
        // res.status(500).send({
        //     message: err.message || "Some error occurred while retrieving Report."
        // });
        console.log(err);
    });

}
module.exports.sendReminderAttendanceMail = function(){
    Report.find({ curdate: dateFormat(new Date(), "d"), curmonth: dateFormat(new Date(), "mmm"), curyear: dateFormat(new Date(), "yyyy"), status: '' }, function (err, reports) {
        if (err) return res.status(500).send("There was a problem finding the users.");
        for (let reportData of reports) {
            User.find({ username: reportData.username }, function (err, users) {
                if (err) return res.status(500).send("There was a problem finding the users.");

                for (let item of users) {
                    //console.log(item.username +' --> '+item.token)
                    const  sendmail  =  require('sendmail')({
                        silent: true,
                    })
                    sendmail({
                        from:  config.defaultMailer,
                        //to: 'mpanneerselvam@tnsi.com',
                        to:  item.email,
                        cc: item.supervisor,
                        subject:   'Attendance Reminder for ' + dateFormat(new Date(), "d") + `-` + dateFormat(new Date(), "mmm") + `-` + dateFormat(new Date(), "yyyy"),
                        html: `<table> Dear ` + item.name + `</table>
                              <table style="margin-right:50px;">Your have not marked your attendence for Today.<br/>Please <a href=`+ config.dailyAttendanceMailUrl + item.token + `> Click here </a> to mark your attendance.
                              <br/>
                              <br/>
                             <b> Dear Supervisor</b>,
                              <br/>
                                  Please mark appropriate attendance in case of absence/WFH.<br/>
                                  <table style="margin-right:50px;"><a href=`+ config.dailyAttendanceMailUrl + item.token +`&statusVal=W> Work From Home </a><br/></table>
                                  <table style="margin-right:50px;"><a href=`+ config.dailyAttendanceMailUrl + item.token +`&statusVal=US> Sick Leave </a><br/></table>
                                  <table style="margin-right:50px;"><a href=`+ config.dailyAttendanceMailUrl + item.token +`&statusVal=UE> Emergency Leave </a></table>
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
module.exports.sendDailyAttendance = function(){
    User.find({ role: 'User' }, function (err, users) {
        if (err) return res.status(500).send("There was a problem finding the users.");
        //res.status(200).send(users);
        for (let item of users) {
            //console.log(item.username+'-->'+item.token);
            
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
                <table style="margin-right:50px;">Mark your attendence for Today.<br/>Please <a href=`+ config.dailyAttendanceMailUrl + item.token + `> Click here </a> <br/><b>You should be logged in to VPN to mark your attendence.</b>
                `
            },  function (err,  reply) {
                console.log(err  &&  err.stack);
                console.dir(reply);
            })
        }
    });
}


