var express = require('express'),
    jwt = require('jsonwebtoken'),
    router = express.Router(),
    config = require('../../../config'),
    User = require('../../user/User'),
    Report = require('../../report/Report'),
    VerifyToken = require('../../auth/VerifyToken'),
    custom = require('../../auth/custom'),
    dateFormat = require('dateformat'),
    //now = new Date(),
    chkUser = [VerifyToken, custom];

    router.get('/', chkUser, function (req, res) {
        var sortbyData = { curdate: 1 };
        if (req.user.role == "admin") {
            Report.find({
                /*curdate: dateFormat(new Date(), "d"),*/
                curmonth: dateFormat(new Date(), "mmm"),
                curyear: dateFormat(new Date(), "yyyy"),
                status: "PL"
            }).sort(sortbyData)
                .then(report => {
                    res.send(report);
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

router.put('/', chkUser, function (req, res) {
        var options = { hour12: false };
        var indTime = new Date().toLocaleTimeString("en-US", options,{timeZone: "Asia/Kolkata"});
        console.log(indTime);
        //var curtime = dateFormat(new Date(), "HH:MM");
        var curDate = dateFormat(new Date(), "d");
        //if (curDate <= req.body.date){
        const reportData = {
            time: indTime,
            status: "PL",
            type: "Planned Leave",
            reason: "Planned Vacation"
        }
        Report.findOneAndUpdate({ username: req.body.username, curdate: req.body.date, curmonth: dateFormat(new Date(), "mmm"), curyear: dateFormat(new Date(), "yyyy") }, reportData)
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
    // } else {
    //     return res.status(500).send({
    //         message: "Past date you can't apply"
    //     });
    // }
});


router.put('/cancelPL', chkUser, function (req, res) {
    //var curtime = dateFormat(new Date(), "HH:MM");
    var options = { hour12: false };
    var indTime = new Date().toLocaleTimeString("en-US", options,{timeZone: "Asia/Kolkata"});
    console.log(indTime);
    var curDate = dateFormat(new Date(), "d");
    if (curDate < req.body.date){
    const reportData = {
        time: indTime,
        status: "",
        type: "",
        reason: ""
    }
    Report.findOneAndUpdate({ username: req.body.username, curdate: req.body.date, curmonth: dateFormat(new Date(), "mmm"), curyear: dateFormat(new Date(), "yyyy") }, reportData)
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
            message: "Already taken this day as a Leave"
        });
    }
});


module.exports = router;