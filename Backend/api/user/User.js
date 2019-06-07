var mongoose = require('mongoose');  
var UserSchema = new mongoose.Schema({  
  name: String,
  email: String,
  username : String,
  password: String,
  token: String,
  supervisor:String,
  sme: String,
  team: String,
  status: String,
  shift: Number,
  role : {type: String, default: "User"},
  createdAt : { type: Date, default: Date.now },
  updatedAt : { type: Date, default: Date.now }
});
mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');