// AuthController.js
var express = require('express'),
    router = express.Router(),
    bodyParser = require('body-parser'),
    User = require('../user/User'),
    jwt = require('jsonwebtoken'),
    bcrypt = require('bcryptjs'),
    config = require('../../config'),
    VerifyToken = require('./VerifyToken');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post('/register', function (req, res) {
    var hashedPassword = bcrypt.hashSync(req.body.password, 8);
    User.create({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: hashedPassword,
        role: req.body.role,
        token:''
    },
        function (err, user) {
            if (err) return res.status(500).send("There was a problem registering the user.")
            // create a token
            // var token = jwt.sign({ id: user._id }, config.secret, {
            //     expiresIn: 86400 // expires in 24 hours
            // });
            var token = jwt.sign({ id: user._id }, config.secret);
            var cusToken = token
            User.findOneAndUpdate({_id: user._id}, {$set: {token: cusToken}}, {upsert: true}, function(err,doc) {
                if (err) { throw err; }
                else { console.log("Updated"); }
              });  
            res.status(200).send({ auth: true, token: token });
            
        });
});

router.post('/login', function (req, res) {
    User.findOne({ username: req.body.username }, function (err, user) {
        if (err) return res.status(500).send('Error on the server.');
        if (!user) return res.status(404).send('No user found.');
        // var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        // if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
        var token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
        });
        res.status(200).send({ auth: true, token: token });
    });
});

router.post('/admin/login', function (req, res) {
    if (req.body.username && req.body.password) {
        User.findOne({ username: req.body.username }, function (err, user) {
            if (err) return res.status(500).send('Error on the server.');
            if (!user) return res.status(404).send('No user found.');
            var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
            //console.log(passwordIsValid);
            if (!passwordIsValid || passwordIsValid != true) return res.status(401).send({ auth: false, token: null });
            var token = jwt.sign({ id: user._id }, config.secret, {
                expiresIn: 86400 // expires in 24 hours
            });
            res.status(200).send({ auth: true, token: token });
        });
    } else {
        return res.status(404).send('Username or Password Missing');
    }
});

router.get('/logout', VerifyToken, function (req, res) {
    res.status(200).send({ auth: false, token: null });
});

router.get('/me', function (req, res, next) {
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, config.secret, function (err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

        User.findById(decoded.id,
            { password: 0 }, // projection
            function (err, user) {
                if (err) return res.status(500).send("There was a problem finding the user.");
                if (!user) return res.status(404).send("No user found.");
                // res.status(200).send(user); Comment this out!
                next(user); // add this line
            });
    });
});
// add the middleware function
router.use(function (user, req, res, next) {
    res.status(200).send(user);
});


module.exports = router;