var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/final', { useNewUrlParser: true });
//mongoose.connect('mongodb://172.20.39.210 :27017/attendance_tracker', { useNewUrlParser: true });
mongoose.connection.once('open',function () {
    console.log('Connected');
}).on('error',function (error) {
    console.log('CONNECTION ERROR:',error);
});