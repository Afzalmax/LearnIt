const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstname:{
    type:String,
    required:true
  },
  lastname:{
    type:String,
    required:true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type:String,
    required:true,
    unique:true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type:Date,
    default:Date.now,

  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;