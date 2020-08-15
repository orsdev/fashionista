const mongoose = require('mongoose');

const userShema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
    required: true,
  },
  lastName: {
    type: String,
    trim: true,
    required: true,
  },
  userEmail: {
    type: String,
    trim: true,
    unique: true,
    lowercase: true,
    required: true,
  },
  userPassword: {
    type: String,
    required: true,
  },
  cart: [{
    items: {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  },
  ],
  activated: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

const User = mongoose.model('User', userShema);

class UserClass {
  static postAddUser(req, res) {
    const { body } = req;
    const user = new User(body);
    return user;
  }
}

module.exports = {
  User,
  UserClass,
};
