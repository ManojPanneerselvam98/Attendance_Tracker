var express = require("express"),
  jwt = require("jsonwebtoken"),
  router = express.Router(),
  config = require("../../config"),
  User = require("../user/User"),
  Report = require("../report/Report"),
  VerifyToken = require("../auth/VerifyToken"),
  custom = require("../auth/custom"),
  dateFormat = require("dateformat"),
  //now = new Date(),
  chkUser = [VerifyToken, custom],
  async = require("async");


function daysInMonth(month, year) {
  return new Date(year, month, 0).getDate();
}

router.get("/", function(req, res) {
  var token = req.query.token;
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
                res.send("Your attendance has been marked");
              })
              .catch(err => {
                res.status(500).send({
                  message: "Some error occurred while creating the Note."
                });
              });
          }
        } else {
          var options = { hour12: false };
          var indTime = new Date().toLocaleTimeString("en-US", options, {
            timeZone: "Asia/Kolkata"
          });
          //console.log(indTime);
          //var curtime = dateFormat(new Date(), "HH:MM"),
          curstatus = "";
          if (indTime <= "10:00:00") {
            curstatus = "P";
          } else {
            curstatus = "D";
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
          )
            .then(report => {
              if (!report) {
                return res.status(404).send({
                  message: "Report not found with Username " + user.username
                });
              }
              //res.send(report);
              res.send("Your attendance has been marked");
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

// router.get("/custom", function(req, res) {

//     var token = req.query.token;
//     var currYear = dateFormat(new Date(), "yyyy");
//     var currMonth = dateFormat(new Date(), "m");
//     var currMonthCount = new Date(currYear, currMonth, 0).getDate();
//     decoded = jwt.verify(token, config.secret);
//     User.findById(decoded.id, { password: 0 }, function(err, user) {

  


// try {
//     var dateOfMonth = new Array();
//     for ($i = 0; $i < currMonthCount; $i++) {
//         var reportData = new Report({
//           username: user.username,
//           curdate: $i + 1,
//           curmonth: dateFormat(new Date(), "mmm"),
//           curyear: dateFormat(new Date(), "yyyy"),
//           status: "",
//           type: "",
//           reason: ""
//         });
//         //dateOfMonth.push(reportData);
//     }
//     console.log(dateOfMonth);
//     console.log('before save');
//     let saveUser = reportData.save(); //when fail its goes to catch
//     console.log(saveUser); //when success it print.
//     console.log('after save');
//     res.send(saveUser);
//   } catch (err) {
//     console.log('err' + err);
//     res.status(500).send(err);
//   }


// });
// });

module.exports = router;
