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

router.get('/', chkUser, function (req, res) {
    console.log(req.query.role)
    var sortbyData = { curdate: 1 };
    if (req.user.role == "admin" || req.user.role == "webadmin" || req.user.role == "posadmin") {
        Report.find({
            /*curdate: dateFormat(new Date(), "d"),*/
            curmonth: dateFormat(new Date(), "mmm"),
            curyear: dateFormat(new Date(), "yyyy")
        }).sort(sortbyData).populate("user", "sme team name supervisor token status shift", User)
            .then(report => {
                //res.send(report);
                let team = '',
                    teamFilter = '';
                if(req.query.role == "webadmin") {
                    teamFilter = report.filter(e => e.user != null && e.user.team != null && e.user.team != "POS");
                }else if(req.query.role == "posadmin"){
                    teamFilter = report.filter(e => e.user != null && e.user.team != null && e.user.team == "POS");
                } else {
                    teamFilter = report.filter(e => e.user != null && e.user.team != null && (e.user.team == "POS" || e.user.team != "POS"));
                }
                result = teamFilter.reduce(function (r, a) {
                    r[a.user.name] = r[a.user.name] || [];
                    r[a.user.name].push(a);
                    return r;
                }, Object.create(null));
                res.send(result);
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

router.get('/prevreport', chkUser, function (req, res) {
    var sortbyData = { curdate: 1 };
    if (req.user.role == "admin" || req.user.role == "webadmin" || req.user.role == "posadmin") {
        Report.find({
            /*curdate: dateFormat(new Date(), "d"),*/
            //curmonth: dateFormat(new Date(), "mmm"),
            curmonth: req.query.month,
            curyear: req.query.year
        }).sort(sortbyData)
            .then(report => {
                //res.send(report);
                let team = '',
                    teamFilter = '';
                if(req.query.role == "webadmin") {
                    teamFilter = report.filter(e => e.user != null && e.user.team != null && e.user.team != "POS");
                }else if(req.query.role == "posadmin"){
                    teamFilter = report.filter(e => e.user != null && e.user.team != null && e.user.team == "POS");
                } else {
                    teamFilter = report.filter(e => e.user != null && e.user.team != null && (e.user.team == "POS" || e.user.team != "POS"));
                }
                result = teamFilter.reduce(function (r, a) {
                    r[a.username] = r[a.username] || [];
                    r[a.username].push(a);
                    return r;
                }, Object.create(null));
                res.send(result);
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

// Get by ID
router.get('/:id', chkUser, function (req, res) {
    if (req.user.role == "admin" || req.user.role == "webadmin" || req.user.role == "posadmin") {
        Report.find({
            /*curdate: dateFormat(new Date(), "d"),
            curmonth: dateFormat(new Date(), "mmm"),
            curyear: dateFormat(new Date(), "yyyy")*/
            _id: req.params.id
        })
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
router.put('/:id', chkUser, function (req, res) {
    if (req.body.timepick) {
        if (req.user.role == "admin" || req.user.role == "webadmin" || req.user.role == "posadmin") {
            var curtime = req.body.timepick,
                curstatus = req.body.status,
                ltype ='',
                lreason ='';
            /** if (curtime <= "10:00") {
                curstatus = 'P';
            } else {
                curstatus = 'D';
            } **/
            if(curstatus == "PL"){
                ltype = "Planned Vacation";
                lreason = "Planned Leave";
            }
            const reportData = {
                time: req.body.timepick,
                status: curstatus,
                type : ltype,
                reason : lreason
            }
            Report.findOneAndUpdate({ _id: req.params.id}, reportData)
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
            res.status(500).send({
                message: err || "You need to Login as a Admin"
            });
        }
    } else {
        return res.status(404).send('With out time we can not update');
    }
});


module.exports = router;