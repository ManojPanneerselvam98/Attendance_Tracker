var express = require('express'),
    jwt = require('jsonwebtoken'),
    router = express.Router(),
    config = require('../../config'),
    User = require('../user/User'),
    Team = require('../team/Team'),
    VerifyToken = require('../auth/VerifyToken'),
    custom = require('../auth/custom'),
    bcrypt = require('bcryptjs'),
    dateFormat = require('dateformat'),
    //now = new Date(),
    chkUser = [VerifyToken, custom];

router.get('/', chkUser, function (req, res) {
    if (req.user.role == "admin" || req.user.role == "webadmin" || req.user.role == "posadmin") {
        Team.find({}).select("-password")
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

router.get('/:id', chkUser, function (req, res) {
    if (req.user.role == "admin" || req.user.role == "webadmin" || req.user.role == "posadmin") {
        Team.find({ _id: req.params.id }).select("-password")
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

router.post('/', chkUser, function (req, res, err) {
    if (req.body.name) {
        if (req.user.role == "admin" || req.user.role == "webadmin" || req.user.role == "posadmin") {
            Team.find({ name: req.body.name }, function (err, item) {
                if (err) throw (err);
                if (item.length > 0) {
                    res.status(500).send({
                        message: "Team alerady exist"
                    });
                } else if (item.length == 0) {
                    Team.create({
                        name: req.body.name,
                    },
                        function (err, user) {
                            if (err) return res.status(500).send("There was a problem registering the user.")
                            res.status(200).send(user); 
                        });
                }
            });
        } else {
            res.status(500).send({
                message: err || "You need to Login as a Admin"
            });
        }
    } else {
        res.status(500).send({
            message: "You need Send all Fields"
        });
    }
});

router.put('/:id', chkUser, function (req, res) {
    if (req.body.name) {
        if (req.user.role == "admin" || req.user.role == "webadmin" || req.user.role == "posadmin") {
            Team.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true })
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
    } else {
        res.status(500).send({
            message: "You need Send all Fields"
        });
    }
});

router.delete('/:id', chkUser, function (req, res) {
    if (req.user.role == "admin" || req.user.role == "webadmin" || req.user.role == "posadmin") {
        Team.findByIdAndDelete(req.params.id)
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