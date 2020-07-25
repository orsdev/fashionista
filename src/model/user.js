const mongoose = require('mongoose');

const userShema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
    required: true
  },
  lastName: {
    type: String,
    trim: true,
    required: true
  },
  userAddress: {
    type: String,
    trim: true,
    required: true
  },
  userEmail: {
    type: String,
    trim: true,
    unique: true,
    lowercase: true,
    required: true
  },
  userPassword: {
    type: String,
    required: true
  },
  activated: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});


const User = mongoose.model(userShema);

module.exports = User;