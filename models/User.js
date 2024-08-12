// Modelul User cu schema corectă pentru cart
const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  selectedSize: { type: String, required: true },
  selectedColor: { type: String, required: true },
  quantity: { type: Number, default: 1 },
});

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'distributor', 'customer'], default: 'customer' },
  date: { type: Date, default: Date.now },
  log: { type: Boolean, default: false },
  cart: [CartItemSchema],  // Coșul de cumpărături
  favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]  // Produse favorite
});

module.exports = mongoose.model('User', UserSchema);