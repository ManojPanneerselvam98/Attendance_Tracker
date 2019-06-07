var express = require('express'),
    router = express.Router(),
    config = require('../../../config'),
    Report = require('../../report/Report'),
    dateFormat = require('dateformat');
    //now = new Date();

router.get('/', function (req, res) {
    if(config.mail == req.query.key){
        var sortbyData = { curdate: 1 };
        Report.find({
            /*curdate: dateFormat(new Date(), "d"),*/
            curmonth: dateFormat(new Date(), "mmm"),
            curyear: dateFormat(new Date(), "yyyy")
        }).sort(sortbyData)
            .then(report => {
                //res.send(report);
                result = report.reduce(function (r, a) {
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
            message: "Your Parameter key is Wrong"
        });
    }

});



module.exports = router;