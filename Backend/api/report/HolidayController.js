var express = require('express'),
    jwt = require('jsonwebtoken'),
    router = express.Router(),
    config = require('../../config'),
    User = require('../user/User'),
    Report = require('../report/Report'),
    VerifyToken = require('../auth/VerifyToken'),
    custom = require('../auth/custom'),
    dateFormat = require('dateformat'),
    //now = new Date(),
    chkUser = [VerifyToken, custom];

router.get('/', chkUser, function (req, res) {
    var sortbyData = { curdate: 1 };
    Report.find({
        username: req.user.username,
        curmonth: dateFormat(new Date(), "mmm"),
        curyear: dateFormat(new Date(), "yyyy"),
        status: "H"
    }).sort(sortbyData).then(report => {
                res.send(report);
            // result = report.reduce(function (r, a) {
            //     r[a.username] = r[a.username] || [];
            //     r[a.username].push(a);
            //     return r;
            // }, Object.create(null));
            // res.send(result);
            // console.log(result);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Report."
            });
        });
});

router.put('/', chkUser, function (req, res) {
    var options = { hour12: false };
    var indTime = new Date().toLocaleTimeString("en-US", options,{timeZone: "Asia/Kolkata"});
    console.log(indTime);
    const reportData = {
        time: indTime,
        status: "H"
    }
    Report.findOneAndUpdate({ username: req.user.username, curdate: req.body.curdate, curmonth: dateFormat(new Date(), "mmm"), curyear: dateFormat(new Date(), "yyyy") }, reportData)
        .then(report => {
            if (!report) {
                return res.status(404).send({
                    message: "Report not found with Username " + user.username
                });
            }
            res.send(report);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Report not found with Username " + user.username
                });
            }
            return res.status(500).send({
                message: "Error updating report with Username " + user.username
            });
        });

});

router.put('/cancelHL', chkUser, function (req, res) {
    var curDate = dateFormat(new Date(), "d");
    var options = { hour12: false };
    var indTime = new Date().toLocaleTimeString("en-US", options,{timeZone: "Asia/Kolkata"});
    console.log(indTime);
    if (curDate < req.body.curdate){
    const reportData = {
        time: indTime,
        status: ""
    }
    Report.findOneAndUpdate({ username: req.user.username, curdate: req.body.curdate, curmonth: dateFormat(new Date(), "mmm"), curyear: dateFormat(new Date(), "yyyy") }, reportData)
        .then(report => {
            if (!report) {
                return res.status(404).send({
                    message: "Report not found with Username " + user.username
                });
            }
            res.send(report);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Report not found with Username " + user.username
                });
            }
            return res.status(500).send({
                message: "Error updating report with Username " + user.username
            });
        });
    } else {
        return res.status(500).send({
            message: "You Already taken this day as a Leave"
        });
    }
});

router.put('/weekoff', chkUser, function (req, res) {
    var options = { hour12: false };
    var indTime = new Date().toLocaleTimeString("en-US", options,{timeZone: "Asia/Kolkata"});
    console.log(indTime);
    const reportData = {
        time: indTime,
        status: "O"
    }
    //console.log(req.body);
    for (var a in req.body){
        Report.findOneAndUpdate({ username: req.user.username, curdate: req.body[a], curmonth: dateFormat(new Date(), "mmm"), curyear: dateFormat(new Date(), "yyyy") }, reportData)
            .then(report => {
                if (!report) {
                    return res.status(404).send({
                        message: "Report not found with Username " + user.username
                    });
                }
                res.send(report);
            }).catch(err => {
                if (err.kind === 'ObjectId') {
                    return res.status(404).send({
                        message: "Report not found with Username " + user.username
                    });
                }
                return res.status(500).send({
                    message: "Error updating report with Username " + user.username
                });
            });
    }
});



module.exports = router;