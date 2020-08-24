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

    //update password
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
}

userSchema.methods.addToCart = function (productId) {
  const user = this;

  const cartItemIndex = user.cart.items.findIndex((prod) => {
    return prod.productId.toString() === productId.toString();
  });

  if (cartItemIndex >= 0) {
    let getCartItem = user.cart.items[cartItemIndex];
    let getQuantity = getCartItem.quantity;
    let updateCartQuantity = getQuantity + 1;

    user.cart.items[cartItemIndex].quantity = updateCartQuantity;
  } else {
    let cartItem = {
      productId: productId,
      quantity: 1
    };

    user.cart.items.push(cartItem);
  }

  return user.save();
}

const User = mongoose.model('User', userSchema);

class UserClass {
  static postAddUser(req, res, cb) {
    const { body } = req;

    const findUser = User.findOne({ userEmail: body.userEmail });

    findUser.then((user) => {

      if (user) {
        req.flash('error', 'Email already in use.');
        req.session.save(() => {
          return res.redirect('/register');
        })
      } else {

        body.cart = {
          items: []
        }

        cb(new User(body));
      }

    });
  };

  static async getUserCredentials(req, res, email, password) {
    const user = await User.findOne({ userEmail: email });

    if (!user) {
      req.flash('error', 'Email or Password incorrect');
      req.session.save(() => {
        return res.redirect('/login');
      });
    };


    const isMatchedPassword = bcrypt.compareSync(password, user.userPassword);

    if (!isMatchedPassword) {
      req.flash('error', 'Email or Password incorrect');
      req.session.save(() => {
        return res.redirect('/login');
      });
    }

    if (user && isMatchedPassword) {
      // Set cookie session
      req.session.isAuthenticated = true;
      req.session.user = user;

      // Make sure session is saved
      req.session.save((err) => {
        if (err) {
          console.log('Session cannot be saved!-' + err);
        };
        return res.redirect('/home');
      });
    }
  }

  static async addToCart(req, res) {
    const { productId } = req.body;
    req.user.addToCart(productId)
      .then((response) => {
        return res.redirect('/home');
      })
      .catch((err) => {
        return res.redirect('/home');
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
