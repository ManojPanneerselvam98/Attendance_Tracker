var express = require("express"),
  jwt = require("jsonwebtoken"),
  router = express.Router(),
  config = require("../../config"),
  User = require("../user/User"),
  Report = require("../report/Report"),
  Holiday = require("../holiday/Holiday"),
  PlannedLeave = require("../plannedleave/PlannedLeave"),
  VerifyToken = require("../auth/VerifyToken"),
  dateFormat = require("dateformat"),
  custom = require("../auth/custom"),
  //now = new Date(),
  chkUser = [VerifyToken, custom],
  CronJob = require("cron").CronJob;

new CronJob(
  "0 7 1 * *",
 //"* * * * *",
  function() {
    makeDay();
  },
  null,
  true,
  "Asia/Kolkata"
);

function daysInMonth(month, year) {
  return new Date(year, month, 0).getDate();
}

function chkHoliday(date) {
  return new Promise(function(resolve, reject) {
    Holiday.find({
      curdate: date,
      curmonth: dateFormat(new Date(), "mmm"),
      curyear: dateFormat(new Date(), "yyyy")
    }).then(
      data => {
        //res.send(users);

        if (data && data.length > 0) resolve("H");
        else resolve("");

        //res.send("H");
      },
      err => reject(err)
    );
  });
}
function chkPlannedLeave(date, name) {
  return new Promise(function(resolve, reject) {
    PlannedLeave.find({
      curdate: date,
      curmonth: dateFormat(new Date(), "mmm"),
      curyear: dateFormat(new Date(), "yyyy"),
      username: name
    }).then(
      data => {
        //res.send(users);
        //console.log(data);
        if (data && data.length > 0) {
          //console.log(name);
          //console.log(date);
          resolve("PL");
        } else resolve("");

        //res.send("H");
      },
      err => reject(err)
    );
  });
}
async function getStatus(date, name) {
  let statusObj = { date: date, status: "" };
  let data = await chkHoliday(date);
  //console.log("object" + data);
  if (data != "") {
    //  console.log("object" + date);
    statusObj.status = "H";
    statusObj.type = "";
    statusObj.reason = "";
  }
  if (statusObj.status != "H") {
    data = await chkPlannedLeave(date, name);
    if (data != "") {
      //  console.log("object" + date);
      statusObj.status = "PL";
      statusObj.type = "Planned Leave";
      statusObj.reason = "Planned Vacation";
    }
  }
  return statusObj;
}

function makeDay(req, res) {
  var currYear = dateFormat(new Date(), "yyyy");
  var currMonth = dateFormat(new Date(), "m");
  var currMonthCount = new Date(currYear, currMonth, 0).getDate(),
    indTime = new Date().toLocaleTimeString("en-US", {
      timeZone: "Asia/Kolkata"
    });
  User.find({role: 'User'})
    .select("-password")
    .then(users => {
      console.log(users)
      for (let user of users) {
        if(user.status == 1){
        let counter = 0;
        for ($i = 0; $i < currMonthCount; $i++) {
          getStatus($i + 1, user.username).then(data => {
            counter++;
            const reportData = new Report({
              username: user.username,
              user: user._id,
              userId: user._id,
              curdate: data.date,
              curmonth: dateFormat(new Date(), "mmm"),
              curyear: dateFormat(new Date(), "yyyy"),
              status: data.status,
              type: data.type,
              reason: data.reason,
              time:indTime
            });
            reportData
              .save()
              .then(data => {
                //res.send(data);
                //res.send(data);
                //res.send("Your attendance has been marked");
                var options = { hour12: false };
                var indTime = new Date().toLocaleTimeString("en-US", {
                  timeZone: "Asia/Kolkata"
                });
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
                body = WO;
                for (var a in body) {
                  Report.findOneAndUpdate(
                    {
                      username: user.username,
                      curdate: body[a],
                      curmonth: dateFormat(new Date(), "mmm"),
                      curyear: dateFormat(new Date(), "yyyy")
                    },
                    reportData
                  )
                    .then(report => {
                      //  res.send(report);
                    })
                    .catch(err => {
                      // res.status(500).send({
                      // message:
                      //  "Some error occurred while creating the Note."
                      //});
                    });
                }
              })
              .catch(err => {
                //   res.status(500).send({
                //   message:
                //   err.message ||
                // "Some error occurred while creating the Note."
                //});
              });
          });
        }
      }
      }
    })
    .catch(err => {
      //res.status(500).send({
      //message:
      //err.message || "Some error occurred while retrieving Report."
      // });
      //});
    })
    .catch(err => {
      //res.status(500).send({
      //message: err.message || "Some error occurred while retrieving Report."
    });
  console.log("Done");
  //res.send("Hello!");
}

router.post("/", function(req, res) {
  var currYear = dateFormat(new Date(), "yyyy");
  var currMonth = dateFormat(new Date(), "m");
  var currMonthCount = new Date(currYear, currMonth, 0).getDate();
  User.find({ role: "User" })
    .select("-password")
    .then(users => {
      for (let user of users) {
        let counter = 0;
        for ($i = 0; $i < currMonthCount; $i++) {
          getStatus($i + 1, user.username).then(data => {
            counter++;
            const reportData = new Report({
              username: user.username,
              user: user._id,
              userId: user._id,
              curdate: data.date,
              curmonth: dateFormat(new Date(), "mmm"),
              curyear: dateFormat(new Date(), "yyyy"),
              status: data.status,
              type: "",
              reason: ""
            });
            reportData
              .save()
              .then(data => {
                //res.send(data);
                //res.send(data);
                //res.send("Your attendance has been marked");
                var options = { hour12: false };
                var indTime = new Date().toLocaleTimeString("en-US", {
                  timeZone: "Asia/Kolkata"
                });
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
                      //  res.send(report);
                    })
                    .catch(err => {
                      // res.status(500).send({
                      // message:
                      //  "Some error occurred while creating the Note."
                      //});
                    });
                }
              })
              .catch(err => {
                //   res.status(500).send({
                //   message:
                //   err.message ||
                // "Some error occurred while creating the Note."
                //});
              });
          });
        }
      }
    })
    .catch(err => {
      //res.status(500).send({
      //message:
      //err.message || "Some error occurred while retrieving Report."
      // });
      //});
    })
    .catch(err => {
      //res.status(500).send({
      //message: err.message || "Some error occurred while retrieving Report."
    });

  res.send("Hello!");
});

module.exports = router;
