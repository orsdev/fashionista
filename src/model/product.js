const mongoose = require('mongoose');

const productsShema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true,
  },
  tag: {
    type: String,
    required: true
  },
  description: {
    type: String,
    trim: true,
    required: true,
  },
  feature: {
    type: String,
    trim: true,
    default: 'no'
  },
  price: {
    type: Number,
    required: true
  },
  productImage: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const ProductsSchema = mongoose.model('Products', productsShema);

class ProductClass {

  static async getFeaturedProducts(req, res, limit = 5) {
    const products = await ProductsSchema.find({ feature: 'yes' })
      .limit(limit)
      .sort({ updatedAt: -1 });

    return products;
  }

  static async getHomeProducts(req, res, limit = 12) {

    const products = await ProductsSchema.find({ feature: 'no' })
      .limit(limit)
      .sort('updatedAt');

    return products;
  }

  static async getAllProducts(req, res, skipNumber, limit = 10) {
    const products = await ProductsSchema.find({})
      .limit(limit)
      .sort({ updatedAt: -1 })
      .skip(skipNumber);

    return products;
  }

  static async getSingleProduct(req, res) {
    const { productId } = req.params;
    const product = await ProductsSchema.findById(productId);
    return product;
  }

  static async postUpdateProduct(req, res) {
    const { productId } = req.body;
    const product = await ProductsSchema.findById(productId);
    return product;
  }

  static deleteProduct(req) {
    const { productId } = req.body;
    const product = ProductsSchema.findByIdAndDelete(productId);
    return product;
  }
}

module.exports = {
  ProductsSchema,
  ProductClass
};
