const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }],
  total: { type: Number, required: true },
  date: { type: Date, default: Date.now }, 
  adress: {type: String, required: true }
});

module.exports = mongoose.model('Order', OrderSchema);

