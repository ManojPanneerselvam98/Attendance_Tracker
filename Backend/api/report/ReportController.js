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

// To get Reports by UserName using JWTToken
router.get('/', chkUser, function (req, res) {
    var sortbyData = { curdate: 1 };
    Report.find({
        username: req.user.username,
        //curdate: dateFormat(new Date(), "d"),
        curmonth: dateFormat(new Date(), "mmm"),
        curyear: dateFormat(new Date(), "yyyy")
    }).sort(sortbyData)
        .then(report => {
            result = report.reduce(function (r, a) {
                r[a.username] = r[a.username] || [];
                r[a.username].push(a);
                return r;
            }, Object.create(null));
            res.send(result);
        }).catch(err => {
            res.status(500).send({
                message: "Some error occurred while retrieving Report."
            });
        });
});
// To Save Database using JWTToken
router.post('/', chkUser, function (req, res) {
        var curtime = dateFormat(new Date(), "HH:MM:ss"),
            curstatus = '';
        if (curtime <= "11:00:00") {
            curstatus = 'P';
        } else {
            curstatus = 'D';
        }
        const reportData = new Report({
            username: req.user.username,
            userid: req.user._id,
            time: curtime,
            status: curstatus,
            curdate: dateFormat(new Date(), "d"),
            curmonth: dateFormat(new Date(), "mmm"),
            curyear: dateFormat(new Date(), "yyyy")
        });
        // Save to Database
        Report.find({
            username: req.user.username,
            time: curtime,
            status: curstatus,
            curdate: dateFormat(new Date(), "d"),
            curmonth: dateFormat(new Date(), "mmm"),
            curyear: dateFormat(new Date(), "yyyy")
        })
            .then(report => {
                if (report.length <= 0) {
                    reportData.save()
                        .then(data => {
                            res.send(data);
                        }).catch(err => {
                            res.status(500).send({
                                message: err.message || "Some error occurred while creating the Note."
                            });
                        });
                } else {
                    res.status(500).send({
                        message: "Report Already Exist on " + dateFormat(new Date(), "fullDate")
                    });
                }
            }).catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving Report."
                });
            });

});
router.put('/', chkUser, function (req, res) {
    /** var usaTime = new Date().toLocaleString("en-US", {timeZone: "America/New_York"});
    usaTime = new Date(usaTime);
    console.log('USA time: '+usaTime.toLocaleString());
    var indiaTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
    indiaTime = new Date(indiaTime);
    console.log('India time: '+indiaTime.toLocaleString()) **/

    var options = { hour12: false };
    var indTime = new Date().toLocaleTimeString("en-US", options,{timeZone: "Asia/Kolkata"});
    console.log(indTime);
    //var curtime = dateFormat(new Date(), "HH:MM"),
        curstatus = '';
    if (indTime <= "11:00:00") {
        curstatus = 'P';
    } else {
        curstatus = 'D';
    }
    const reportData = {
        username: req.user.username,
        time: indTime,
        status: curstatus
    }
    Report.findOneAndUpdate({ username: req.user.username, curdate: dateFormat(new Date(), "d"), curmonth: dateFormat(new Date(), "mmm"), curyear: dateFormat(new Date(), "yyyy") }, reportData)
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


module.exports = router;