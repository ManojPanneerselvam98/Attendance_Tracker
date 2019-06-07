var mongoose = require('mongoose');  
var TeamSchema = new mongoose.Schema({  
  name: String,
  createdAt : { type: Date, default: Date.now },
  updatedAt : { type: Date, default: Date.now }
});
mongoose.model('Team', TeamSchema);

module.exports = mongoose.model('Team');