var mongoose = require('mongoose'); 
const Schema = mongoose.Schema; 
var HolidaySchema = new mongoose.Schema({  
    // username : String,
    // userId:{type: Schema.Types.ObjectId, ref: 'users'},
    // user: {type: Schema.Types.ObjectId, ref: 'users'},
    status : String,
    curdate : Number,
    curmonth : String,
    curyear : Number,
    type:String,
    reason:String,
    holidayreason: String
});
mongoose.model('Holiday', HolidaySchema);

module.exports = mongoose.model('Holiday');