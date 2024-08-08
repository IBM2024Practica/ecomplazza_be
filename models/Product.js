const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  brand: {type: String, required: true},
  category: { type: String, required: true },
  subcategory : {type : String, required : true},
  description: { type: String, required: true },
  imageUrl: { type: String, required: true }, // Adăugat câmpul pentru imagine
  material:  {type : String, required : true}, 
  color : {type : String, required : true},  
  favourite: { type: Boolean, default: false },
  sizes: [
    {
      size: { type: String, required: false }, // XS, S, M, L, XL
      quantity: { type: Number, required: true, default: 0 } // Cantitatea pentru acea mărime
    }
  ],
  favouritedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] 
});

module.exports = mongoose.model('Product', ProductSchema);
