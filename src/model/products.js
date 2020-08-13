const ProductsSchema = require('../mongoose-model/products');


module.exports = class Product {

  static postProduct = async (req, res) => {
    try {
      const body = req.body;
      const product = new ProductsSchema(body);
      await product.save();
      return res.send({ message: 'Product upload successfull' });
    } catch (e) {
      return res.status(400).send({ error: e.message });
    }
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
    const id = req.params.productId;
    const product = await ProductsSchema.findById(id);
    return product;
  }

  static patchUpdateProduct = async (req, res) => {
    const id = req.params.productId;
    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'description', 'price', 'feature'];
    const invalidUpdates = updates.every(value => allowedUpdates.includes(value));

    if (!invalidUpdates) {
      return res.status(400).send({ error: 'Invalid update.' });
    };

    try {
      const product = await ProductsSchema.findById(id);

      if (!product) {
        return res.status(404).send({ error: 'Product not found.' });
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
