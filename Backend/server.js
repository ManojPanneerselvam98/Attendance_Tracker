var express = require('express'),
    app = require('./app'),
    port = process.env.PORT || 3000,
    db = require('./db');


var server = app.listen(port, function() {
    console.log('Express server listening on port ' + port);
});