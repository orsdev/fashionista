const mongoose = require('mongoose');

const orderShema = new mongoose.Schema({
  products: [
    {
      product: { type: Object, required: true },
      quantity: { type: Number, required: true }
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
  }
}, {
  timestamps: true
});

const Order = mongoose.model('Order', orderShema);

class OrderClass {
  static addToOrders = (req, cb) => {
    const { body } = req;

    cb(new Order(body));
  }
}

module.exports = {
  OrderClass
}