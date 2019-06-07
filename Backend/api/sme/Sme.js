var mongoose = require('mongoose');  
var SmeSchema = new mongoose.Schema({  
  name: String,
  createdAt : { type: Date, default: Date.now },
  updatedAt : { type: Date, default: Date.now }
});
mongoose.model('Sme', SmeSchema);

module.exports = mongoose.model('Sme');