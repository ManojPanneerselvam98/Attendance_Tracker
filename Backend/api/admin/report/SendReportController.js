var express = require("express"),
  jwt = require("jsonwebtoken"),
  router = express.Router(),
  config = require("../../../config"),
  Report = require("../../report/Report"),
  Holiday = require("../../holiday/Holiday"),
  User = require("../../user/User"),
  VerifyToken = require("../../auth/VerifyToken"),
  dateFormat = require("dateformat"),
  //now = new Date(),
  cron = require("node-cron"),
  CronJob = require("cron").CronJob,
  axios = require("axios");
fetch = require("node-fetch");

function daysInMonth(month, year) {
  return new Date(year, month, 0).getDate();
}

router.get("/custom", function(req, res) {
  //console.log("object");
  dailyStatusMail();
  //remindPOCMail();
  //dailyStatusMail();
  //clientHolidayMail();
  //clientMail();
  //clientReportMail();
  //clientHolidayMailAdvance()
});


new CronJob(
  "45 11 * * 0-5",
  function() {
    //dailyStatusMail();
  },
  null,
  true,
  "Asia/Kolkata"
);

new CronJob(
  "20,30,40 11 * * 1-5",
  function() {
    //remindPOCMail();
  },
  null,
  true,
  "Asia/Kolkata"
);

new CronJob(
  "0 12 * * 1-5",
  function() {
    //clientReportMail();
  },
  null,
  true,
  "Asia/Kolkata"
);

new CronJob(
  "0 20 * * 0-5",
  function() {
    //clientHolidayMailAdvance();
  },
  null,
  true,
  "Asia/Kolkata"
);

function sendStatusMail(report, team) {
  var htmlHead = "",
    htmlBody = "",
    htmlVal = "",
    htmlHeadStatus = "",
    htmlBodyStatus = "",
    htmlBodyStatusComp = "",
    email = [];
  let date = new Date();
  let days = daysInMonth(date.getMonth() + 1, date.getFullYear());
  this.headers = Array(days)
    .fill(0)
    .map((x, i) => i + 1);
  htmlHead =
    htmlHead +
    `<td style="text-align:center;border-bottom:1px solid #000;margin:2px;border-right:1px solid #000;font-size: 11px;background:gray;">` +
    dateFormat(new Date(), "mmm");
  for (var i of this.headers) {
    htmlHead =
      htmlHead +
      `<td style="text-align:center;border-bottom:1px solid #000;margin:2px;font-size: 11px;background:gray;">` +
      i +
      `</td>`;
  }
  htmlHead = htmlHead + "</td>";
  result = report.reduce(function(r, a) {
    r[a.user.name] = r[a.user.name] || [];
    r[a.user.name].push(a);
    return r;
  }, Object.create(null));
  for (var key in result) {
    htmlBody =
      htmlBody +
      `<tr width="100%" style="border-collapse: collapse;border-spacing: 0;"><td style="text-align:center;margin:2px;border-right:1px solid #000;font-size: 11px;padding:0;">` +
      key +
      `</td>`;
    let status = result[key];
    for (item of status) {
      email.push(item.user.email);
      //console.log(item.user.status)
      var style = "";
      if (item.status == "PL") {
        style = "background:green";
      }
      if (item.status == "A") {
        style = "background:red";
      }
      if (item.status == "W") {
        style = "background:blue";
      }
      if (item.status == "D") {
        style = "color:orange";
      }
      if (item.status == "O") {
        style = "background:gray;color:gray";
      }
      if (item.status == "" && item.user.status == "0") {
        style = "background:gray;color:gray";
      }
      htmlBody =
        htmlBody +
        `<td style="text-align:center;margin:2px;font-size: 11px;` +
        style +
        ` " >` +
        item.status +
        `</td>`;
    }
    htmlBody = htmlBody + "</tr>";
  }

  htmlHeadStatus =
    htmlHeadStatus +
    `<td style="text-align:center;border-bottom:1px solid #000;margin:2px;font-size: 11px;border-right:1px solid #000;"> SWAT / Project</td>`;
  htmlHeadStatus =
    htmlHeadStatus +
    `<td style="text-align:center;border-bottom:1px solid #000;margin:2px;font-size: 11px;border-right:1px solid #000;"> Resource </td>`;
  htmlHeadStatus =
    htmlHeadStatus +
    `<td style="text-align:center;border-bottom:1px solid #000;margin:2px;font-size: 11px;border-right:1px solid #000;"> Activity </td>`;
  htmlHeadStatus =
    htmlHeadStatus +
    `<td style="text-align:center;border-bottom:1px solid #000;margin:2px;font-size: 11px;border-right:1px solid #000;"> Start Date </td>`;
  htmlHeadStatus =
    htmlHeadStatus +
    `<td style="text-align:center;border-bottom:1px solid #000;margin:2px;font-size: 11px;border-right:1px solid #000;"> Target Date </td>`;
  htmlHeadStatus =
    htmlHeadStatus +
    `<td style="text-align:center;border-bottom:1px solid #000;margin:2px;font-size: 11px;border-right:1px solid #000;"> Duration </td>`;
  htmlHeadStatus =
    htmlHeadStatus +
    `<td style="text-align:center;border-bottom:1px solid #000;margin:2px;font-size: 11px;border-right:1px solid #000;"> TMS (hours) </td>`;
  htmlHeadStatus =
    htmlHeadStatus +
    `<td style="text-align:center;border-bottom:1px solid #000;margin:2px;font-size: 11px;border-right:1px solid #000;"> Comp Status </td>`;
  htmlHeadStatus =
    htmlHeadStatus +
    `<td style="text-align:center;border-bottom:1px solid #000;margin:2px;font-size: 11px;border-right:1px solid #000;"> Status </td>`;
  var statusFlag = "";
  fetch("http://172.20.39.210:9000/report/?key=admin")
    .then(res => res.json())
    .then(task => {
      let response = [];
      //console.log(e.user.team)
      if (team == "POS")
        response = task.filter(e => e.user[0] && e.user[0].team == "TNS POS");
      else
        response = task.filter(e => e.user[0] && e.user[0].team != "TNS POS");
      for (var statusData of response) {
        if (statusData.status == "Completed") {
          statusFlag = true;
          htmlBodyStatusComp =
            htmlBodyStatusComp +
            `<tr style="text-align:center;border-bottom:1px solid #000;margin:2px;font-size: 11px;">`;
          //console.log("Manoj"+statusData.resourceName)
          htmlBodyStatusComp =
            htmlBodyStatusComp +
            `<td style="text-align:center;margin:2px;font-size: 11px;border-bottom:1px solid #000;border-right:1px solid #000;">` +
            statusData.task +
            `</td>`;
          htmlBodyStatusComp =
            htmlBodyStatusComp +
            `<td style="text-align:center;margin:2px;font-size: 11px;border-bottom:1px solid #000;border-right:1px solid #000;">` +
            statusData.resourceName +
            `</td>`;
          htmlBodyStatusComp =
            htmlBodyStatusComp +
            `<td style="text-align:center;margin:2px;font-size: 11px;border-bottom:1px solid #000;border-right:1px solid #000;">` +
            statusData.activity +
            `</td>`;
          htmlBodyStatusComp =
            htmlBodyStatusComp +
            `<td style="text-align:center;margin:2px;font-size: 11px;border-bottom:1px solid #000;border-right:1px solid #000;">` +
            statusData.startDate +
            `</td>`;
          htmlBodyStatusComp =
            htmlBodyStatusComp +
            `<td style="text-align:center;margin:2px;font-size: 11px;border-bottom:1px solid #000;border-right:1px solid #000;">` +
            statusData.endDate +
            `</td>`;
          htmlBodyStatusComp =
            htmlBodyStatusComp +
            `<td style="text-align:center;margin:2px;font-size: 11px;border-bottom:1px solid #000;border-right:1px solid #000;">` +
            statusData.duration +
            `</td>`;
          htmlBodyStatusComp =
            htmlBodyStatusComp +
            `<td style="text-align:center;margin:2px;font-size: 11px;border-bottom:1px solid #000;border-right:1px solid #000;">` +
            statusData.tms +
            `</td>`;
          htmlBodyStatusComp =
            htmlBodyStatusComp +
            `<td style="text-align:center;margin:2px;font-size: 11px;border-bottom:1px solid #000;border-right:1px solid #000;">` +
            statusData.completionStatus +
            `</td>`;
          htmlBodyStatusComp =
            htmlBodyStatusComp +
            `<td style="text-align:center;margin:2px;font-size: 11px;border-bottom:1px solid #000;border-right:1px solid #000;">` +
            statusData.status +
            `</td>`;
          htmlBodyStatusComp = htmlBodyStatusComp + `</tr>`;
        } else {
          htmlBodyStatus =
            htmlBodyStatus +
            `<tr style="text-align:center;border-bottom:1px solid #000;margin:2px;font-size: 11px;">`;
          //console.log("Manoj"+statusData.resourceName)
          htmlBodyStatus =
            htmlBodyStatus +
            `<td style="text-align:center;margin:2px;font-size: 11px;border-bottom:1px solid #000;border-right:1px solid #000;">` +
            statusData.task +
            `</td>`;
          htmlBodyStatus =
            htmlBodyStatus +
            `<td style="text-align:center;margin:2px;font-size: 11px;border-bottom:1px solid #000;border-right:1px solid #000;">` +
            statusData.resourceName +
            `</td>`;
          htmlBodyStatus =
            htmlBodyStatus +
            `<td style="text-align:center;margin:2px;font-size: 11px;border-bottom:1px solid #000;border-right:1px solid #000;">` +
            statusData.activity +
            `</td>`;
          htmlBodyStatus =
            htmlBodyStatus +
            `<td style="text-align:center;margin:2px;font-size: 11px;border-bottom:1px solid #000;border-right:1px solid #000;">` +
            statusData.startDate +
            `</td>`;
          htmlBodyStatus =
            htmlBodyStatus +
            `<td style="text-align:center;margin:2px;font-size: 11px;border-bottom:1px solid #000;border-right:1px solid #000;">` +
            statusData.endDate +
            `</td>`;
          htmlBodyStatus =
            htmlBodyStatus +
            `<td style="text-align:center;margin:2px;font-size: 11px;border-bottom:1px solid #000;border-right:1px solid #000;">` +
            statusData.duration +
            `</td>`;
          htmlBodyStatus =
            htmlBodyStatus +
            `<td style="text-align:center;margin:2px;font-size: 11px;border-bottom:1px solid #000;border-right:1px solid #000;">` +
            statusData.tms +
            `</td>`;
          htmlBodyStatus =
            htmlBodyStatus +
            `<td style="text-align:center;margin:2px;font-size: 11px;border-bottom:1px solid #000;border-right:1px solid #000;">` +
            statusData.completionStatus +
            `</td>`;
          htmlBodyStatus =
            htmlBodyStatus +
            `<td style="text-align:center;margin:2px;font-size: 11px;border-bottom:1px solid #000;border-right:1px solid #000;">` +
            statusData.status +
            `</td>`;
          htmlBodyStatus = htmlBodyStatus + `</tr>`;
        }
      }
      // console.log(response.data);
      //if (statusFlag == true) {
      htmlVal =
        `<table style="margin-bottom:25px"> Hi All, </table><table style="margin-bottom:25px">Please find the updated status ,</table> <table><b> Resource Availability:</b></table><table width="75%" style="border-style:solid; border-width:1px; border-color:#000000;border-collapse: collapse;border-spacing: 0;">
            <tr width="100%" style="border-collapse: collapse;border-spacing: 0;">` +
        htmlHead +
        `</tr>` +
        htmlBody +
        `</table>
            <table style="margin-bottom:25px"></table><table style="margin-bottom:25px"></table><table style="margin-bottom:25px"></table>
            </table>
            <table><b> In Progress Task:</b></table>
            <table width="75%" style="margin-bottom:50px;border-style:solid; border-width:1px; border-color:#000000;border-collapse: collapse;border-spacing: 0;">
            <tr width="100%" style="background:yellow">` +
        htmlHeadStatus +
        `</tr>` +
        htmlBodyStatus +
        `</table>
            <br/><br/><br/>
            <table><b> Completed Task:</b></table>
            <table width="75%" style="border-style:solid; border-width:1px; border-color:#000000;border-collapse: collapse;border-spacing: 0;">
            <tr width="100%" style="background:yellow">` +
        htmlHeadStatus +
        `</tr>` +
        htmlBodyStatusComp +
        `</table>`;
      //   } else {
      //     htmlVal =
      //       `<table style="margin-bottom:25px"> Hi All, </table><table style="margin-bottom:25px">Please find the updated status ,</table> <table><b> Resource Availability:</b></table><table width="75%" style="border-style:solid; border-width:1px; border-color:#000000;border-collapse: collapse;border-spacing: 0;">
      //         <tr width="100%" style="border-collapse: collapse;border-spacing: 0;">` +
      //       htmlHead +
      //       `</tr>` +
      //       htmlBody +
      //       `</table>
      //         <table style="margin-bottom:25px"></table><table style="margin-bottom:25px"></table><table style="margin-bottom:25px"></table>
      //         </table>
      //         <table><b> In Progress Task:</b></table>
      //         <table width="75%" style="margin-bottom:50px;border-style:solid; border-width:1px; border-color:#000000;border-collapse: collapse;border-spacing: 0;">
      //         <tr width="100%" style="background:yellow">` +
      //       htmlHeadStatus +
      //       `</tr>` +
      //       htmlBodyStatus +
      //       `</table>
      //         <br/><br/><br/>`;
      //   }

      const sendmail = require("sendmail")({
        silent: true
      });
      let email = [];
      filter = "";
      if (team == "POS") {
        filter = { role: "User", team: "POS", status:'1'};
      }
      if (team == "Web") {
        filter = { role: "User", team: { $ne: "POS" }, status:'1' };
      }
      User.find(filter, function(err, users) {
        if (err)
          return res.status(500).send("There was a problem finding the users.");
        for (let item of users) {
          //console.log(item)
          email.push(item.email);
        }
        //console.log(email)

        sendmail(
          {
            from: config.defaultMailer,
            to:  'mpanneerselvam@tnsi.com',
            to: email,
            //cc: config.managerMail,
            //bcc: "mpanneerselvam@tnsi.com, msubbian@tnsi.com",
            subject:
              team +
              " Team Status on " +
              dateFormat(new Date(), "d") +
              `-` +
              dateFormat(new Date(), "mmm") +
              `-` +
              dateFormat(new Date(), "yyyy"),
            html: htmlVal
          },
          function(err, reply) {
            console.log(err && err.stack);
            console.dir(reply);
          }
        );
      });
    })
    .catch(error => {
      console.log(error);
    });
}

function dailyStatusMail() {
  var sortbyData = { curdate: 1 };
  Report.find({
    curmonth: dateFormat(new Date(), "mmm"),
    curyear: dateFormat(new Date(), "yyyy")
  })
    .sort(sortbyData)
    .populate("user", "sme team name email status", User)
    .then(report => {
      //res.send(report);
	  //console.log(report);
      let POS = report.filter(e => e.user != null && e.user.team != null && e.user.team == "POS");
      let Web = report.filter(e => e.user !=null && e.user.team != null &&  e.user.team != "POS"); 
	  /** let POS = report.filter(e => e.user.team == "POS");
      let Web = report.filter(e => e.user.team != "POS"); **/

        Holiday.find({
          curdate: dateFormat(new Date(), "d"),
          curmonth: dateFormat(new Date(), "mmm"),
          curyear: dateFormat(new Date(), "yyyy")
        })
          .then(data => {
            console.log(data.length);
            if (data.length) console.log("Holiday")
            else {
              sendStatusMail(POS, "POS");
              sendStatusMail(Web, "Web");
            }
          })
          .catch(err => {
            console.log(err)
          });
      
    })
    .catch(err => {
      console.log(err);
    });
}

function clientHolidayMailAdvance() {
  let year = dateFormat(new Date(), "yyyy"),
      month = dateFormat(new Date(), "mm"),
      date = dateFormat(new Date(), "d"),
      fulldate = year+"-"+month+"-"+date;
      d = new Date(fulldate)
      d.setDate(d.getDate() + 1)
      console.log(d.getDate());
  Holiday.find({
    curdate: d.getDate(),
    //curdate: 30,
    curmonth: dateFormat(new Date(), "mmm"),
    curyear: year
  })

    .then(data => {
      if(data.length){
      var htmlVal = "";
      //res.send(data);
      console.log(data);
      htmlVal =
        `<table style="margin-bottom: 30px;"><tr><td>Hi, <br/><br/>Tomorrow (` +
        d.getDate() +
        `-` +
        dateFormat(new Date(), "mmm") +
        `-` +
        dateFormat(new Date(), "yyyy") +
        `) is Public Holiday due to ` +
        data[0].holidayreason +
        `</td></tr></table>
            <table style="margin-bottom: 10px;margin-top: 30px;"><tr><td>Regards</td></tr><tr><td style="color:blue">` +
        config.managerSignature +
        `</td></tr></table>`;
      const sendmail = require("sendmail")({
        silent: true
      });
      sendmail(
        {
          //from:  'no-reply@tnsi.com',
          from: config.managerMail,
          //to: config.clientReportTo,
          //cc: config.clientReportCC,
          to: 'mpanneerselvam@tnsi.com',
          subject:
            "TNS Offshore Network Group: Holiday Intimation on " +
            d.getDate() +
            `-` +
            dateFormat(new Date(), "mmm") +
            `-` +
            dateFormat(new Date(), "yyyy"),
          html: htmlVal
        },
        function(err, reply) {
          console.log(err && err.stack);
          console.dir(reply);
        }
      );
    }
    })
    .catch(err => {
      // res.status(500).send({
      //   message: err.message || "Some error occurred while retrieving Report."
      // });
      console.log(err)
    });
}

function clientHolidayMail() {
  Holiday.find({
    curdate: dateFormat(new Date(), "d"),
    //curdate: 30,
    curmonth: dateFormat(new Date(), "mmm"),
    curyear: dateFormat(new Date(), "yyyy"),
    status: "H"
  })
    .then(data => {
      var htmlVal = "";
      //res.send(data);
      //console.log(data[0].holidayreason);
      htmlVal =
        `<table style="margin-bottom: 30px;"><tr><td>it's Holiday due to ` +
        data[0].holidayreason +
        `<b> ` +
        dateFormat(new Date(), "d") +
        `-` +
        dateFormat(new Date(), "mmm") +
        `-` +
        dateFormat(new Date(), "yyyy") +
        `</b></td></tr></table>
            <table style="margin-bottom: 10px;margin-top: 30px;"><tr><td>Regards</td></tr><tr><td style="color:blue">` +
        config.managerSignature +
        `</td></tr></table>`;
      const sendmail = require("sendmail")({
        silent: true
      });
      sendmail(
        {
          //from:  'no-reply@tnsi.com',
          from: config.managerMail,
          //to: config.clientReportTo,
          //cc: config.clientReportCC,
          to: 'mpanneerselvam@tnsi.com',
          subject:
            "TNS Offshore Network Group: Holiday Intimation on" +
            dateFormat(new Date(), "d") +
            `-` +
            dateFormat(new Date(), "mmm") +
            `-` +
            dateFormat(new Date(), "yyyy"),
          html: htmlVal
        },
        function(err, reply) {
          console.log(err && err.stack);
          console.dir(reply);
        }
      );
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Report."
      });
    });
}

function clientReportMail() {
  Holiday.find({
    curdate: dateFormat(new Date(), "d"),
    //curdate: 30,
    curmonth: dateFormat(new Date(), "mmm"),
    curyear: dateFormat(new Date(), "yyyy")
    ///status:"H"
  })
    .then(data => {
      console.log(data.length);
      if (data.length) console.log("No Holiday")//clientHolidayMail();
      else clientMail();
    })
    .catch(err => {
      // res.status(500).send({
      //   message: err.message || "Some error occurred while retrieving Report."
      // });
      console.log(err)
    });
}

function clientMail() {
  var sortbyData = { curdate: 1 };
  Report.find({
    curdate: dateFormat(new Date(), "d"),
    curmonth: dateFormat(new Date(), "mmm"),
    curyear: dateFormat(new Date(), "yyyy"),
    $or: [{ status: "A" }, { status: "PL" }],
    $and: [{ status: { $ne: "H" } }]
  })
    .populate("user", "sme team name", User)
    .then(report => {
      //res.send(report);
      //console.log(report.length);
      var htmlBody = "",
        htmlVal = "";
      if (report.length > 0) {
        for (let item of report) {
          htmlBody =
            htmlBody +
            `<tr width="100%" cellpadding="2" cellspacing="0">
                        <td style="text-align:center;padding:10px;border-right:1px solid #000;border-bottom:1px solid #000">` +
            item.user.name +
            `</td>
                        <td style="text-align:center;padding:10px;border-right:1px solid #000; border-bottom:1px solid #000">` +
            item.user.sme +
            `</td>
                        <td style="text-align:center;padding:10px;border-right:1px solid #000; border-bottom:1px solid #000">` +
            item.user.team +
            `</td>
                        <td style="text-align:center;padding:10px;border-right:1px solid #000; border-bottom:1px solid #000">` +
            dateFormat(new Date(), "d") +
            `-` +
            dateFormat(new Date(), "mmm") +
            `-` +
            dateFormat(new Date(), "yyyy") +
            `</td>
                        <td style="text-align:center;padding:10px;border-right:1px solid #000; border-bottom:1px solid #000">1</td>
                        <td style="text-align:center;padding:10px;border-right:1px solid #000; border-bottom:1px solid #000">` +
            item.type +
            `</td>
                        <td style="text-align:center;padding:10px;border-bottom:1px solid #000">` +
            item.reason +
            `</td>
                    </tr>`;
        }

        htmlVal =
          `<table style="margin-bottom: 30px;"><tr><td>Please find the planned/unplanned absence details of PSD offshore network group for <b>` +
          dateFormat(new Date(), "d") +
          `-` +
          dateFormat(new Date(), "mmm") +
          `-` +
          dateFormat(new Date(), "yyyy") +
          `</b></td></tr></table>
                <table width="75%" cellpadding="2" cellspacing="0" style="border-style:solid; border-width:1px; border-color:#000000;border-bottom:none">
                <tr width="100%" cellpadding="2" cellspacing="0">
                    <th style="text-align:center; border-bottom:1px solid #000; padding:10px;border-right:1px solid #000;background-color:rgb(0,180, 200)">Resource Name</th>
                    <th style="text-align:center; border-bottom:1px solid #000; padding:10px;border-right:1px solid #000;background-color:rgb(0,180, 200)">TNS SME</th> 
                    <th style="text-align:center; border-bottom:1px solid #000; padding:10px;border-right:1px solid #000;background-color:rgb(0,180, 200)">Module</th>
                    <th style="text-align:center; border-bottom:1px solid #000; padding:10px;border-right:1px solid #000;background-color:rgb(0,180, 200)">Leave Date</th>
                    <th style="text-align:center; border-bottom:1px solid #000; padding:10px;border-right:1px solid #000;background-color:rgb(0,180, 200)">Leave Duration (days)</th>
                    <th style="text-align:center; border-bottom:1px solid #000; padding:10px;border-right:1px solid #000;background-color:rgb(0,180, 200)">Type of Absence</th>
                    <th style="text-align:center; border-bottom:1px solid #000; padding:10px;background-color:rgb(0,180, 200)">Reason for Absence</th>
                </tr>` +
          htmlBody +
          `</table><table style="margin-bottom: 10px;margin-top: 30px;"><tr><td>Regards</td></tr><tr><td style="color:blue">` +
          config.managerSignature +
          `</td></tr></table>`;
      } else {
        htmlVal =
          `<table style="margin-bottom: 30px;"><tr><td>There were no planned/unplanned absence in PSD offshore network group for <b>` +
          dateFormat(new Date(), "d") +
          `-` +
          dateFormat(new Date(), "mmm") +
          `-` +
          dateFormat(new Date(), "yyyy") +
          `</b></td></tr></table>
                <table style="margin-bottom: 10px;margin-top: 30px;"><tr><td>Regards</td></tr><tr><td style="color:blue">` +
          config.managerSignature +
          `</td></tr></table>`;
      }
      const sendmail = require("sendmail")({
        silent: true
      });
      sendmail(
        {
          //from:  'no-reply@tnsi.com',
          from: config.managerMail,
          //to: config.clientReportTo,
          //cc: config.clientReportCC,
          to: 'mpanneerselvam@tnsi.com',
          subject:
            "TNS Offshore Network Group: Absence Intimation " +
            dateFormat(new Date(), "d") +
            `-` +
            dateFormat(new Date(), "mmm") +
            `-` +
            dateFormat(new Date(), "yyyy"),
          html: htmlVal
        },
        function(err, reply) {
          console.log(err && err.stack);
          console.dir(reply);
        }
      );
      //res.send(report);
      // console.log(report);
    })
    .catch(err => {
      // res.status(500).send({
      //     message: err.message || "Some error occurred while retrieving Report."
      // });
      console.log(err);
    });
}

function remindPOCMail() {
  var sortbyData = { curdate: 1 };
  Report.find({
    curdate: dateFormat(new Date(), "d"),
    curmonth: dateFormat(new Date(), "mmm"),
    curyear: dateFormat(new Date(), "yyyy"),
    status: ""
  })
    .populate("user", "sme team name supervisor token status shift", User)
    .then(report => {
      /** let POS = report.filter(e => e.user.team == "POS");
      let Web = report.filter(e => e.user.team != "POS"); **/
	    let POS = report.filter(e => e.user != null && e.user.team != null && (e.user.team == "POS" && e.user.status == 1));
      let Web = report.filter(e => e.user !=null && e.user.team != null &&  (e.user.team != "POS" && e.user.status == 1)); 
      sendPOCMail(POS, "POS");
      sendPOCMail(Web, "Web");
    })
    .catch(err => {
      // res.status(500).send({
      //     message: err.message || "Some error occurred while retrieving Report."
      // });
      console.log(err);
    });
}

function sendPOCMail(report, team) {
  //console.log(team)
  var htmlBody = "",
    htmlVal = "";
  if (report.length > 0) {
    for (let item of report) {
      //console.log(item)
      var shiftEmp = '';
        if(item.user.shift == 1){
            shiftEmp = '&statusVal=shift';
        }
	//if(item.user.status == '1'){
      //console.log(report);
      htmlBody =
        htmlBody +
        `<tr width="100%" cellpadding="2" cellspacing="0">
<td style="text-align:center;padding:10px;border-right:1px solid #000;border-bottom:1px solid #000">` +
        item.user.name +
        `</td>
<td style="text-align:center;padding:10px;border-right:1px solid #000;border-bottom:1px solid #000"> 
<span><a href=` +
        config.dailyAttendanceMailUrl +
        item.user.token + shiftEmp +
        `> Present </a></span> <br/>
<span><a href=` +
        config.dailyAttendanceMailUrl +
        item.user.token +
        `&statusVal=W> Work From Home </a></span> <br/>
<span><a href=` +
        config.dailyAttendanceMailUrl +
        item.user.token +
        `&statusVal=US> Sick Leave </a></span><br/>    
<span><a href=` +
        config.dailyAttendanceMailUrl +
        item.user.token +
        `&statusVal=UE> Emergency Personal Leave </a></span> </br>
<span><a href=` +
        config.dailyAttendanceMailUrl +
        item.user.token +
        `&statusVal=PL> Planned Vacation </a></span> </br>
</td>
</tr>`;
//}
    }
    htmlVal =
      `<table style="margin-bottom: 30px;"><tr><td>Below Users have not marked attendance on <b>` +
      dateFormat(new Date(), "d") +
      `-` +
      dateFormat(new Date(), "mmm") +
      `-` +
      dateFormat(new Date(), "yyyy") +
      `</b></td></tr></table>
<table width="50%" cellpadding="2" cellspacing="0" style="border-style:solid; border-width:1px; border-color:#000000;">
<tr width="100%" cellpadding="2" cellspacing="0">
<th style="text-align:center; border-bottom:1px solid #000; padding:10px;border-right:1px solid #000;background-color:rgb(0,180, 200)">Resource Name</th>
<th style="text-align:center; border-bottom:1px solid #000; padding:10px;border-right:1px solid #000;background-color:rgb(0,180, 200)">Mark Attendance</th>
</tr>` +
      htmlBody +
      `</table><table style="margin-bottom: 10px;margin-top: 30px;"><tr><td>Regards</td></tr><tr><td style="color:blue">` +
      config.managerSignature +
      `</td></tr></table>`;
    let sendPOC = "";
    if (team == "POS") {
      sendPOC = config.POSpocMail;
    } else {
      sendPOC = config.pocMail;
    }
    const sendmail = require("sendmail")({
      silent: true
    });
    sendmail(
      {
        from: config.defaultMailer,
        //to: sendPOC,
        to:'mpanneerselvam@tnsi.com',
        //cc: config.managerMail,
        subject:
          "Not Marked Attendance " +
          dateFormat(new Date(), "d") +
          `-` +
          dateFormat(new Date(), "mmm") +
          `-` +
          dateFormat(new Date(), "yyyy"),
        html: htmlVal
      },
      function(err, reply) {
        console.log(err && err.stack);
        console.dir(reply);
      }
    );
  } else {
    // res.send(report);
    //console.log(report);
  }
  //res.send(report);
  //console.log(report);
}

module.exports = router;
