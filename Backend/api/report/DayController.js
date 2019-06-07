var express = require('express'),
    jwt = require('jsonwebtoken'),
    router = express.Router(),
    config = require('../../config'),
    User = require('../user/User'),
    Report = require('../report/Report'),
    VerifyToken = require('../auth/VerifyToken'),
    dateFormat = require('dateformat'),
    custom = require('../auth/custom'),
    //now = new Date(),
    chkUser = [VerifyToken, custom];

router.post('/', chkUser, function (req, res) {
    var currYear = dateFormat(new Date(), "yyyy");
    var currMonth = dateFormat(new Date(), "m");
    var currMonthCount = new Date(currYear, currMonth, 0).getDate();
    Report.find({
        username: req.user.username,
        curdate: dateFormat(new Date(), "d"),
        curmonth: dateFormat(new Date(), "mmm"),
        curyear: dateFormat(new Date(), "yyyy")
    })
        .then(report => {
            for ($i = 0; $i < currMonthCount; $i++) {
                const reportData = new Report({
                    username: req.user.username,
                    user: req.user._id,
                    userId: req.user._id,
                    curdate: $i + 1,
                    curmonth: dateFormat(new Date(), "mmm"),
                    curyear: dateFormat(new Date(), "yyyy"),
                    status:'',
                    type:'',
                    reason:''
                });
                reportData.save()
                    .then(data => {
                        res.send(data);
                    }).catch(err => {
                        res.status(500).send({
                            message: err.message || "Some error occurred while creating the Note."
                        });
                    });
            }

        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Report."
            });
        });
});

module.exports = router;