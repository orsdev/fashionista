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
    ref: "User",
    required: true
  }
}, {
  timestamps: true
});

const ProductsSchema = mongoose.model('Products', productsShema);

class ProductClass {

  static postProduct = (req, res) => {
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

  static getFeaturedProducts = async (req, res, limit = 5) => {
    const products = await ProductsSchema.find({ feature: 'yes' })
      .limit(limit)
      .sort('updatedAt');

    return products;
  }

  static getHomeProducts = async (req, res, limit = 12) => {

    const products = await ProductsSchema.find({ feature: 'no' })
      .limit(limit)
      .sort('updatedAt');

    return products;
  }

  static getAllProducts = async (req, res, limit = 20) => {
    const products = await ProductsSchema.find({})
      .limit(limit)
      .sort('updatedAt');

    return products;
  }

  static getSingleProduct = async (req, res) => {
    const { productId } = req.params;
    const product = await ProductsSchema.findById(productId);
    return product;
  }

  static postUpdateProduct = async (req, res) => {
    const { productId } = req.body;
    const product = await ProductsSchema.findById(productId);
    return product;
  }

  static deleteProduct = async (req, res) => {
    const id = req.params.productId;

    try {
      await ProductsSchema.findByIdAndDelete(id);
      return res.send('Product deleted successfully');
    } catch (e) {
      return res.status(500).send({ error: 'Bad Request.' });
    }
  }
}

module.exports = {
  ProductsSchema,
  ProductClass
}