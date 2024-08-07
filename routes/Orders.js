const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');

// Place Order
router.post('/', auth, async (req, res) => {
  const { products, total, address } = req.body; 

  try {
    const newOrder = new Order({
      user: req.user.id,
      products,
      total,
      address, 
    });

    const order = await newOrder.save();
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get Orders
// routes/orders.js
router.get('/', auth, async (req, res) => {
  try {
    let orders;
    if (req.user.role === 'admin' || req.user.role === 'distributor') {
      orders = await Order.find().populate('user products');
    } else {
      orders = await Order.find({ user: req.user.id }).populate('products');
    }
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


module.exports = router;
