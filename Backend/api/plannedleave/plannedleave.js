var mongoose = require('mongoose'); 
const Schema = mongoose.Schema; 

var PlannedLeaveSchema = new mongoose.Schema({  
    username : String,
    status : String,
    curdate : Number,
    curmonth : String,
    curyear : Number,
    type:String,
    reason:String
}, { toJSON: { virtuals: true } });

PlannedLeaveSchema.virtual('user', {
    ref: 'User', // The model to use
    localField: 'username', // Find people where `localField`
    foreignField: 'username', // is equal to `foreignField`
    // If `justOne` is true, 'members' will be a single doc as opposed to
    // an array. `justOne` is false by default.
    justOne: true,
    options: {  } // Query options, see http://bit.ly/mongoose-query-options
  });



mongoose.model('PlannedLeave', PlannedLeaveSchema);

module.exports = mongoose.model('PlannedLeave');