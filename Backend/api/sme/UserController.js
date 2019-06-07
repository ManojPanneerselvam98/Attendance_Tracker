var express = require('express'),
    jwt = require('jsonwebtoken'),
    router = express.Router(),
    config = require('../../../config'),
    User = require('../../user/User'),
    Report = require('../../report/Report'),
    VerifyToken = require('../../auth/VerifyToken'),
    bcrypt = require('bcryptjs'),
    dateFormat = require('dateformat'),
    //now = new Date(),
    cron = require('node-cron');

    function sendReminderAttendanceMail(){    
        Report.find({curdate: dateFormat(new Date(), "d"),curmonth: dateFormat(new Date(), "mmm"),curyear: dateFormat(new Date(), "yyyy"),status:''}, function (err, reports) {
            if (err) return res.status(500).send("There was a problem finding the users.");
            for(let reportData of reports){
                //console.log(reportData.username)
                User.find({username:reportData.username}, function (err, users) {
                    if (err) return res.status(500).send("There was a problem finding the users.");
                   // console.log(users);

                    for (let item of users) {
                        //console.log("Test"+item.supervisor); // Will display contents of the object inside the array
                        const sendmail = require('sendmail')({
                            silent:true, 
                        })
                        var url = "http://localhost:3000/api/attendanceLink?token=";
                        sendmail({
                            from: 'no-reply@tnsi.com',
                            to: item.email,
                            cc: item.supervisor,
                            subject: 'Attendance of the Day',
                            html: 'Not yet mark Attendance'
                            }, function(err, reply) {
                            console.log(err && err.stack);
                            console.dir(reply);
                        }) 
                    }
                });
            }
        });
    }

    function sendDailyAttendance(){
        User.find({}, function (err, users) {
            if (err) return res.status(500).send("There was a problem finding the users.");
            //res.status(200).send(users);
            for (let item of users) {
                //console.log(item.email); // Will display contents of the object inside the array
                const sendmail = require('sendmail')({
                    silent:true, 
                })
                var url = "http://localhost:3000/api/attendanceLink?token=";
                sendmail({
                    from: 'no-reply@tnsi.com',
                    to: item.email,
                    subject: 'Attendance of the Day',
                    //html: '<h1>Mail of test sendmail <h1><p>'+url+item.token+'</p>'
                    html: `<table width="100%" cellpadding="2" cellspacing="0" style="border-style:solid; border-width:1px; border-color:#000000;">
                            <tr width="100%" cellpadding="2" cellspacing="0">
                                <th style="text-align:center; border-bottom:1px solid #000; padding:10px;border-right:1px solid #000">Name</th>
                                <th style="text-align:center; border-bottom:1px solid #000; padding:10px;border-right:1px solid #000">Date</th> 
                                <th style="text-align:center; border-bottom:1px solid #000; padding:10px;border-right:1px solid #000">Action</th>
                            </tr>
                            <tr width="100%" cellpadding="2" cellspacing="0">
                                <td style="text-align:center;padding:10px;border-right:1px solid #000">`+item.name+`</td>
                                <td style="text-align:center;padding:10px;border-right:1px solid #000">`+dateFormat(new Date(), "d" )+`-`+dateFormat(new Date(), "mmm") + `-`+dateFormat(new Date(), "yyyy") +`</td> 
                                <td style="text-align:center;padding:10px;border-right:1px solid #000"><a href=`+url+item.token+`>Link</a></td>
                            </tr>
                        </table>`
                    }, function(err, reply) {
                    console.log(err && err.stack);
                    console.dir(reply);
                }) 
            }
        });
    }

    cron.schedule('* * * * *', () => {
        //test();
        //sendDailyAttendance();
        //sendReminderAttendanceMail();
    });
  

// To get all User
router.get('/', VerifyToken, function (req, res) {
    var token = req.headers['x-access-token'];
    decoded = jwt.verify(token, config.secret);
    User.findById(decoded.id, { password: 0 }, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
        if (user.role == "admin") {
            User.find({}).select("-password")
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

});

// To get User by ID
router.get('/:id', VerifyToken, function (req, res) {
    var token = req.headers['x-access-token'];
    decoded = jwt.verify(token, config.secret);
    User.findById(decoded.id, { password: 0 }, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
        if (user.role == "admin") {
            User.find({ _id: req.params.id }).select("-password")
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
});

// To Save Database
router.post('/', VerifyToken, function (req, res, err) {
    var token = req.headers['x-access-token'];
    if (req.body.name && req.body.username && req.body.email && req.body.password && req.body.supervisoremail) {
        decoded = jwt.verify(token, config.secret);
        User.findById(decoded.id, { password: 0 }, function (err, user) {
            if (err) return res.status(500).send("There was a problem finding the user.");
            if (!user) return res.status(404).send("No user found.");
            if (user.role == "admin") {
                var hashedPassword = bcrypt.hashSync(req.body.password, 8);
                User.find({ $or: [{ username: req.body.username }, { email: req.body.email }] }, function (err, item) {
                    if (err) throw (err);
                    if (item.length > 0) {
                        res.status(500).send({
                            message: "Username or Email alerady exist"
                        });
                    } else if (item.length == 0) {
                        // User.create({
                        //     name: req.body.name,
                        //     email: req.body.email,
                        //     username: req.body.username,
                        //     password: hashedPassword,
                        //     role: "User",
                        //     token: ''
                        // },
                        //     function (err, users) {
                        //         if (err) return res.status(500).send("There was a problem adding the information to the database.");
                        //         var token = jwt.sign({ id: user._id }, config.secret);
                        //         var cusToken = token
                        //         User.findByIdAndUpdate({_id: user._id}, {$set: {token: cusToken}}, {upsert: true}, function(err,doc) {
                        //             if (err) { throw err; }
                        //             else { console.log("Updated"); }
                        //           });    
                        //         res.status(200).send(users);
                        //     });

                        User.create({
                            name: req.body.name,
                            email: req.body.email,
                            username: req.body.username,
                            password: hashedPassword,
                            role: req.body.role,
                            supervisor: req.body.supervisoremail,
                            token:''
                        },
                            function (err, user) {
                                if (err) return res.status(500).send("There was a problem registering the user.")
                                var token = jwt.sign({ id: user._id }, config.secret);
                                var cusToken = token
                                User.findOneAndUpdate({_id: user._id}, {$set: {token: cusToken}}, {upsert: true}, function(err,doc) {
                                    if (err) { throw err; }
                                    else { 
                                        //console.log("Updated");
                                    }
                                  });  
                                res.status(200).send({ auth: true, token: token });
                                
                            });
                    }
                });

            } else {
                res.status(500).send({
                    message: err || "You need to Login as a Admin"
                });
            }

        });
    } else {
        res.status(500).send({
            message: "You need Send all Fields"
        });
    }
});

router.put('/:id', VerifyToken, function (req, res) {
    if (req.body.name && req.body.username && req.body.email && req.body.role) {
        var token = req.headers['x-access-token'];
        decoded = jwt.verify(token, config.secret);
        User.findById(decoded.id, { password: 0 }, function (err, user) {
            if (err) return res.status(500).send("There was a problem finding the user.");
            if (!user) return res.status(404).send("No user found.");
            if (user.role == "admin") {
                User.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true }).select("-password")
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
    } else {
        res.status(500).send({
            message: "You need Send all Fields"
        });
    }
});

router.delete('/:id', VerifyToken, function (req, res) {
    var token = req.headers['x-access-token'];
    decoded = jwt.verify(token, config.secret);
    User.findById(decoded.id, { password: 0 }, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
        if (user.role == "admin") {
            // User.findByIdAndDelete(req.params.id, function (err, user) {
            //     if (err) return res.status(500).send("There was a problem deleting the user.");
            //     res.status(200).send("User: " + user.name + " was deleted.");
            //     res.send(user);
            // });

            User.findByIdAndDelete(req.params.id)
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
});


module.exports = router;