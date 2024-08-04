const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  date: { type: Date, default: Date.now },
  favourite: { type: Boolean, default: false },
  sizes: [
    {
      size: { type: String, required: true }, // XS, S, M, L, XL
      quantity: { type: Number, required: true, default: 0 } // Cantitatea pentru acea mărime
    }
  ]
});

module.exports = mongoose.model('Product', ProductSchema);
