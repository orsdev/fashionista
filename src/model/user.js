const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const flashError = require('../utils/flashError');
const { capitalizeFirstLetters } = require('../utils/lodashHelper');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    trim: true,
    required: true,
  },
  userAddress: {
    type: String,
    required: true,
    trim: true
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
  cart: {
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Products',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      }
    ]
  }
}, {
  timestamps: true,
});

// Hash Password
userSchema.pre('save', async function (next) {
  const user = this;

  if (user.isModified('userPassword')) {
    const { userPassword } = user;
    const salt = bcrypt.genSaltSync(12);
    const hash = bcrypt.hashSync(userPassword, salt);

    // update password
    user.userPassword = hash;

  }

  next();

});

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.userPassword;
  delete userObject.createdAt;
  delete userObject.updatedAt;

  return userObject;
};

userSchema.methods.addToCart = function (productId, quantity) {
  const user = this;

  const cartItemIndex = user.cart.items.findIndex((prod) => prod.productId.toString() === productId.toString());

  if (cartItemIndex >= 0) {
    user.cart.items[cartItemIndex].quantity = Number(quantity);
  } else {
    const cartItem = {
      productId,
      quantity: Number(quantity)
    };

    user.cart.items.push(cartItem);
  }

  return user.save();
};

// For not populated cart productId
userSchema.methods.removeFromCart = function (productId) {
  const user = this;
  const removeProduct = user.cart.items.filter((prod) => prod.productId.toString() !== productId.toString());
  user.cart.items = removeProduct;
  return user.save();
};

// Delete every items in cart
userSchema.methods.removeAllCartItems = function () {
  const user = this;
  user.cart.items = [];
  return user.save();
};

const User = mongoose.model('User', userSchema);

class UserClass {

  static async postAddUser(req, res, cb) {

    try {
      const { body } = req;

      const findUser = await User.findOne({ userEmail: body.userEmail });

      if (findUser) {
        const errMessage = 'Email already in use';
        return flashError(req, res, errMessage, '/register');
      }

      const capitalizeFullName = capitalizeFirstLetters(body.fullName);

      const newBody = {
        ...body,
        fullName: capitalizeFullName,
        cart: {
          items: []
        }
      };

      cb(new User(newBody));

    } catch (err) {
      const errMessage = 'Registration failed. Please try again later.';
      return flashError(req, res, errMessage, '/register');
    }

  }

  static async getUserCredentials(req, res, email, password) {
    const user = await User.findOne({ userEmail: email });

    if (!user) {
      const errMessage = 'Email or Password incorrect';
      return flashError(req, res, errMessage, '/login');
    }

    const isMatchedPassword = bcrypt.compareSync(password, user.userPassword);

    if (!isMatchedPassword) {
      const errMessage = 'Email or Password incorrect';
      return flashError(req, res, errMessage, '/login');
    }

    if (user && isMatchedPassword) {
      // Set cookie session
      req.session.isAuthenticated = true;
      req.session.user = user;

      // Make sure session is saved
      return req.session.save((err) => {
        if (err) {
          console.log(`Session cannot be saved!-${err}`);
        }
        return res.redirect('/home');
      });
    }
  }

  static addToCart(req, res, next) {

    const { productId, quantity } = req.body;
    req.user.addToCart(productId, quantity)
      .then((response) => {
        if (!response) {
          return res.redirect('/404');
        }
        return res.redirect('/cart');
      })
      .catch(() => {
        const error = new Error('Adding product to cart failed.');
        return next(error);
      });
  }

  static removeCartProduct(req, res, next) {

    const { productId } = req.body;
    req.user.removeFromCart(productId)
      .then(() => res.redirect('/cart'))
      .catch(() => {
        const error = new Error('Removing product from cart failed.');
        return next(error);
      });
  }

  static getCartItems(req, res) {
    return req.user;
  }
}

module.exports = {
  User,
  UserClass,
};
