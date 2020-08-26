const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
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


const Order = mongoose.model('Order', orderSchema);

class OrderClass {
  static addToOrders = (req, res, body, cb) => {

    cb(new Order(body));
  };

  static async removeOrder(req, res, productId) {
    try {
      await Order.findByIdAndDelete(productId);
    } catch (e) {
      return res.send('something went wrong');
    }
  }

}

module.exports = {
  OrderClass
}