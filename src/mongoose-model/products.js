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
  }
}, {
  timestamps: true
})

const ProductsSchema = mongoose.model('Products', productsShema);

module.exports = ProductsSchema;