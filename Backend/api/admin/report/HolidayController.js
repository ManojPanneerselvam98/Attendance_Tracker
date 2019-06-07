var express = require('express'),
    jwt = require('jsonwebtoken'),
    router = express.Router(),
    config = require('../../../config'),
    User = require('../../user/User'),
    Report = require('../../report/Report'),
    VerifyToken = require('../../auth/VerifyToken'),
    dateFormat = require('dateformat'),
    custom = require('../../auth/custom'),
    //now = new Date(),
    chkUser = [VerifyToken, custom];

router.put('/', chkUser, function (req, res) {
    var options = { hour12: false };
    var indTime = new Date().toLocaleTimeString("en-US", options,{timeZone: "Asia/Kolkata"});
    console.log(indTime);
    const reportData = {
        time: indTime,
        status: "H"
    }
    //req.body = ['mpanneerselvam','msubbian']
    console.log(req.body);
    //console.log(req.body.curdate);
    for (var a in req.body.username){
        //console.log(req.body[a])
        Report.findOneAndUpdate({ username: a, curdate: 1, curmonth: dateFormat(new Date(), "mmm"), curyear: dateFormat(new Date(), "yyyy") }, reportData)
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