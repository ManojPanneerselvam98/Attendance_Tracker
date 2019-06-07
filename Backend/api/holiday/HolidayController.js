var express = require("express"),
  jwt = require("jsonwebtoken"),
  router = express.Router(),
  config = require("../../config"),
  User = require("../user/User"),
  Holiday = require("../holiday/Holiday"),
  VerifyToken = require("../auth/VerifyToken"),
  custom = require("../auth/custom"),
  bcrypt = require("bcryptjs"),
  dateFormat = require("dateformat"),
  //now = new Date(),
  chkUser = [VerifyToken, custom];

router.get("/", chkUser, function(req, res) {
  if (
    req.user.role == "admin" ||
    req.user.role == "webadmin" ||
    req.user.role == "posadmin"
  ) {
    //Holiday.find({curmonth: dateFormat(new Date(), "mmm")}).sort('curdate')
    Holiday.find({})
      .sort("curdate")
      .then(data => {
        res.send(data);
      })
      .catch(err => {
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

router.get("/prevreport", chkUser, function(req, res) {
  //console.log(req.query)
  if (
    req.user.role == "admin" ||
    req.user.role == "webadmin" ||
    req.user.role == "posadmin"
  ) {
    Holiday.find({
      /*curdate: dateFormat(new Date(), "d"),*/
      //curmonth: dateFormat(new Date(), "mmm"),
      curmonth: req.query.month,
      curyear: req.query.year
    })
      .sort("curdate")
      .then(report => {
        res.send(report);
      })
      .catch(err => {
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



function Manoj(date, month, year){
    //return "1";
    Holiday.find({
        curdate: date,
        curmonth: month,
        curyear: year
      })
        .then(report => {
           ///res.send(report.length);
        //return report[0].length;
        //console.log(report);
        return report
        })
        .catch(err => {
            console.log(err)
        //   res.status(500).send({
        //     message: err.message || "Some error occurred while retrieving Report."
        //   });
        });
}
router.post("/", chkUser, function(req, res, err) {
    let data = Manoj(req.body.curdate, req.body.curmonth, req.body.curyear);
    console.log(data)
  //let data = chkHoliyday(req.body.curdate, req.body.curmonth, req.body.curyear);
  //console.log(data)
//   const HolidayData = new Holiday({
//     curdate: req.body.curdate,
//     curmonth: req.body.curmonth,
//     curyear: req.body.curyear,
//     status: "H",
//     type: "Holiday",
//     reason: req.body.holidayreason,
//     holidayreason: req.body.holidayreason
//   });
//   HolidayData.save()
//     .then(data => {
//       res.send(data);
//     })
//     .catch(err => {
//       res.status(500).send({
//         message: err.message || "Some error occurred while retrieving Report."
//       });
//     });
});

router.delete("/:id", chkUser, function(req, res) {
  if (
    req.user.role == "admin" ||
    req.user.role == "webadmin" ||
    req.user.role == "posadmin"
  ) {
    Holiday.findByIdAndDelete(req.params.id)
      .then(users => {
        res.send(users);
      })
      .catch(err => {
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

module.exports = router;
