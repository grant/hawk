var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// For any user
var userSchema = new Schema({
  created_at: {
    // auto added user registration timestamp
    type: Date,
    default: Date.now
  },
  username: {
    type: String,
    unique: true
  },
  email: {
    type: String,
    unique: true,
    lowercase: true // force email lowercase
  },
  accessToken: {
    type: String
  },
  name: {
    type: String
  },
  friends: [],
  photo: {
    type: String
  },
  fbId: String
});


module.exports = mongoose.model('User', userSchema);