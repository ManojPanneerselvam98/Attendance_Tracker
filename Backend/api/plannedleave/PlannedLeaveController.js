var express = require('express'),
    jwt = require('jsonwebtoken'),
    router = express.Router(),
    config = require('../../config'),
    user = require('../user/User'),
    PlannedLeave = require('../plannedleave/PlannedLeave'),
    VerifyToken = require('../auth/VerifyToken'),
    Report = require('../report/Report'),
    custom = require('../auth/custom'),
    bcrypt = require('bcryptjs'),
    dateFormat = require('dateformat'),
    //now = new Date(),
    chkUser = [VerifyToken, custom];

// router.get('/', chkUser, function (req, res) {
//     if (req.user.role == "admin" || req.user.role == "webadmin" || req.user.role == "posadmin") {
//         PlannedLeave.find({curmonth: dateFormat(new Date(), "mmm")}).sort('curdate')
//             .then(users => {
//                 res.send(users);
//             }).catch(err => {
//                 res.status(500).send({
//                     message: err.message || "Some error occurred while retrieving Report."
//                 });
//             });
//     } else {
//         res.status(500).send({
//             message: err || "You need to Login as a Admin"
//         });
//     }

// });

router.get('/', chkUser, function (req, res) {
    PlannedLeave. find({curmonth: dateFormat(new Date(), "mmm")}).
    populate({ path: 'user', select: 'name' }).sort('curdate')
    .exec(function(error, users) {
      // Won't work, foreign field `band` is not selected in the projection
      res.send(users)
    });

});

router.get('/prevreport', chkUser, function (req, res) {
    PlannedLeave. find({curmonth: req.query.month,curyear: req.query.year}).
    populate({ path: 'user', select: 'name' }).sort('curdate')
    .exec(function(error, users) {
      // Won't work, foreign field `band` is not selected in the projection
      res.send(users)
    });

});

// router.get('/prevreport', chkUser, function (req, res) {
//     //console.log(req.query)
//     if (req.user.role == "admin" || req.user.role == "webadmin" || req.user.role == "posadmin") {
//         PlannedLeave.find({
//             /*curdate: dateFormat(new Date(), "d"),*/
//             //curmonth: dateFormat(new Date(), "mmm"),
//             curmonth: req.query.month,
//             curyear: req.query.year
//         }).sort('curdate')
//             .then(report => {
//                 res.send(report);
//             }).catch(err => {
//                 res.status(500).send({
//                     message: err.message || "Some error occurred while retrieving Report."
//                 });
//             });
//     } else {
//         res.status(500).send({
//             message: err || "You need to Login as a Admin"
//         });
//     }
// });
router.post('/', chkUser, function (req, res, err) {
    //res.send("Manoj Kothari......")
    const PlannedLeaveData = new PlannedLeave({
        username: req.body.username,
        curdate: req.body.curdate,
        curmonth: req.body.curmonth,
        curyear: req.body.curyear,
        status:'PL',
        type:'Planned Vacation',
        reason:'Planned Vacation'
    });
    PlannedLeaveData.save()
        .then(data => {
            res.send(data);
        }). catch(err =>{
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Report."
            }); 
        })
    
});

router.delete('/:id', chkUser, function (req, res) {
    if (req.user.role == "admin" || req.user.role == "webadmin" || req.user.role == "posadmin") {
        PlannedLeave.findByIdAndDelete(req.params.id)
            .then(users => {
                res.send(users);
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



module.exports = router;