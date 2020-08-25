const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: {
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

userSchema.methods.removeFromCart = function (productId) {
  const user = this;

  const removeProduct = user.cart.items.filter((prod) => prod.productId.toString() !== productId.toString());

  user.cart.items = removeProduct;

  return user.save();
};

const User = mongoose.model('User', userSchema);

class UserClass {
  static postAddUser(req, res, cb) {
    const { body } = req;

    const findUser = User.findOne({ userEmail: body.userEmail });

    findUser.then((user) => {

      if (user) {
        req.flash('error', 'Email already in use.');
        req.session.save(() => res.redirect('/register'));
      } else {

        body.cart = {
          items: []
        };

        cb(new User(body));
      }

    });
  }

  static async getUserCredentials(req, res, email, password) {
    const user = await User.findOne({ userEmail: email });

    if (!user) {
      req.flash('error', 'Email or Password incorrect');
      return req.session.save(() => res.redirect('/login'));
    }

    const isMatchedPassword = bcrypt.compareSync(password, user.userPassword);

    if (!isMatchedPassword) {
      req.flash('error', 'Email or Password incorrect');
      return req.session.save(() => res.redirect('/login'));
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

  static addToCart(req, res) {
    const { productId, quantity } = req.body;
    req.user.addToCart(productId, quantity)
      .then(() => res.redirect('/cart'))
      .catch(() => res.redirect('/home'));
  }

  static removeCartProduct(req, res) {
    const { productId } = req.body;
    req.user.removeFromCart(productId)
      .then(() => res.redirect('/cart'))
      .catch(() => res.redirect('/cart'));
  }

  static getCartItems(req, res) {
    return req.user;
  }
}

module.exports = {
  User,
  UserClass,
};