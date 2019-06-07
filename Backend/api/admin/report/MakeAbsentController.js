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
        //var sortbyData = { curdate: 1 };
        if (req.user.role == "admin" || req.user.role == "webadmin" || req.user.role == "posadmin") {
            Report.find({
                curdate: dateFormat(new Date(), "d"),
                curmonth: dateFormat(new Date(), "mmm"),
                curyear: dateFormat(new Date(), "yyyy"),
                status:''
            }).populate('user', 'sme team name', User)
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
        console.log("object")
        const reportData = {
            time: indTime,
            status: "A",
            type: req.body.type,
            reason: req.body.reason,
            curdate:req.body.curdate,
            curmonth:req.body.curmonth,
            curyear:req.body.curyear
        }

        console.log(reportData)
        Report.findOneAndUpdate({ username: req.body.username, curdate:req.body.curdate , curmonth:req.body.curmonth , curyear:req.body.curyear }, reportData)
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