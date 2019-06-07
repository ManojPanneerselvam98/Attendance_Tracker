var jwt = require('jsonwebtoken'),
    config = require('../../config'),
    User = require('../user/User');
function custom(req, res, next) {
    var token = req.headers['x-access-token'];
        decoded = jwt.verify(token, config.secret);
        User.findById(decoded.id, { password: 0 }, function (err, user) {
            if (err) return res.status(500).send("There was a problem finding the user.");
            if (!user) return res.status(404).send("No user found.");
            req.user = user;
            next();
        });
}

module.exports = custom;


