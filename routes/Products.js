const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage: storage });

// Add Product
router.post(
  '/', // endpoint la pagina de home 
  [auth, upload.single('image')],
  [
    check('name', 'Name is required').not().isEmpty(),
    check('price', 'Price is required').isNumeric(),
    check('category', 'Category is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('quantity', 'Quantity is required').isNumeric(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, price, category, description, quantity } = req.body;
    const imageUrl = req.file ? req.file.path : '';

    try {
      const newProduct = new Product({
        name,
        price,
        category,
        description,
        imageUrl,
        quantity,
      });

      const product = await newProduct.save();
      res.json(product);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// Update Product
router.put(
  '/:id',
  [auth, upload.single('image')],
  [
    check('name', 'Name is required').not().isEmpty(),
    check('price', 'Price is required').isNumeric(),
    check('category', 'Category is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('quantity', 'Quantity is required').isNumeric(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, price, category, description, quantity } = req.body;
    const imageUrl = req.file ? req.file.path : '';

    try {
      const product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(404).json({ msg: 'Product not found' });
      }

      product.name = name;
      product.price = price;
      product.category = category;
      product.description = description;
      product.quantity = quantity;
      if (imageUrl) {
        product.imageUrl = imageUrl;
      }

      await product.save();
      res.json(product);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// Get Products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;