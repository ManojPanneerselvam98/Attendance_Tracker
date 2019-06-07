var mongoose = require('mongoose');  
const Schema = mongoose.Schema;
var ReportSchema = new mongoose.Schema({  
  username : String,
  userId:{type: Schema.Types.ObjectId, ref: 'users'},
  user: {type: Schema.Types.ObjectId, ref: 'users'},
  time : String,
  status : String,
  curdate : Number,
  curmonth : String,
  curyear : Number,
  type:String,
  reason:String,
  createdAt : { type: Date, default: Date.now },
  updatedAt : { type: Date, default: Date.now }
});
mongoose.model('Report', ReportSchema);


module.exports = mongoose.model('Report');
