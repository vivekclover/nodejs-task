const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  fname: {
    type: String,
    required: true
  },
  
  password: {
    type: String,
    required: true
  },
  roll: {
    type: Number,
    required: true
  },
  salary: {
    type: Number,
    required: true
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
