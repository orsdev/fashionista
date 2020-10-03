const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  order: [
    {
      product: {
        type: Object,
        required: true
      },
      quantity: {
        type: Number,
        required: true
      }
    }
  ],

  user: {
    userName: {
      type: String,
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    }
  },

}, {
  timestamps: true
});

orderSchema.methods.postOrder = async function (req) {
  if (req.session.user && req.session.isAuthenticated) {
    const userCart = await req.user.populate('cart.items.productId').execPopulate();
    // Get items from cart by destructing
    const {
      cart: {
        items
      }
    } = userCart;

    for (const keys of items) {
      this.order.push({
        product: { ...keys.productId._doc },
        quantity: keys.quantity
      });
    }

    return this.save();
  }
};

const Order = mongoose.model('Order', orderSchema);

class OrderClass {
  static addToOrders(req) {
    return req.order.postOrder(req);
  }

  static getAllOrders(req, res) {
    const order = Order.find({ 'user.userId': req.user._id });
    return order;
  }
}

module.exports = {
  Order,
  OrderClass
};
