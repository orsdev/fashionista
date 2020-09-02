const mongoose = require('mongoose');
const { capitalizeFirstLetters, capitalizeFirstLetter } = require('../utils/lodashHelper');

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
  imageUrl: {
    type: String
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

  static postProduct(req, res) {
    const { body } = req;

    const capitalizeTitle = capitalizeFirstLetters(body.title);
    const capitalizeTag = capitalizeFirstLetters(body.tag);
    const capitalizeDescription = capitalizeFirstLetter(body.description);

    const newBody = {
      ...body,
      price: Number(body.price),
      title: capitalizeTitle,
      tag: capitalizeTag,
      description: capitalizeDescription,
      userId: req.user._id
    };

    const product = new ProductsSchema(newBody);
    return product;
  }

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

  static async getAllProducts(req, res, limit = 20) {
    const products = await ProductsSchema.find({})
      .limit(limit)
      .sort({ updatedAt: -1 });

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
