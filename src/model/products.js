const ProductsSchema = require('../mongoose-model/products');


module.exports = class Product {

  static postProduct = async (req, res, body) => {
    try {
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

    const products = await ProductsSchema.find({})
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
}
