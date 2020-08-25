const mongoose = require('mongoose');

const productsShema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true,
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
    ref: "User"
  }
}, {
  timestamps: true
});

const ProductsSchema = mongoose.model('Products', productsShema);

class ProductClass {

  static postProduct = (req, res) => {
    const { body } = req;
    const product = new ProductsSchema(body);
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

  static patchUpdateProduct = async (req, res) => {
    const id = req.params.productId;
    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'description', 'price', 'feature'];
    const invalidUpdates = updates.every(value => allowedUpdates.includes(value));

    if (!invalidUpdates) {
      return res.status(400).send({ message: 'Invalid update.' });
    };

    try {
      const product = await ProductsSchema.findById(id);

      if (!product) {
        return res.status(404).send({ message: 'Product not found.' });
      }

      updates.forEach((update) => {
        product[update] = req.body[update];
      });

      await product.save();
      return res.send('Product updated successfully.');
    } catch (e) {
      const errorMessage = "Unable to update product.";
      return res.status(500).send({ error: errorMessage });
    }

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