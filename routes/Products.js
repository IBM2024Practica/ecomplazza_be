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
  '/', 
  [auth, upload.single('image')],
  [
    check('name', 'Name is required').not().isEmpty(),
    check('price', 'Price is required').isNumeric(),
    check('brand', 'Brand is required').not().isEmpty(),
    check('category', 'Category is required').not().isEmpty(),
    check('subcategory', 'Subcategory is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('material', 'Material is required').not().isEmpty(),
    check('color', 'Color is required').not().isEmpty(),
    check('sizes.*.quantity', 'Sizes quantity is required').isNumeric(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, price, brand, category, subcategory, description, material, color, sizes } = req.body;
  //  const imageUrl = req.file ? req.file.path : '';

    try {
      const newProduct = new Product({
        name,
        price,
        brand,
        category,
        subcategory,
        description,
//        imageUrl,
        material,
        color,
        sizes,
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
    check('brand', 'Brand is required').not().isEmpty(),
    check('category', 'Category is required').not().isEmpty(),
    check('subcategory', 'Subcategory is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('material', 'Material is required').not().isEmpty(),
    check('color', 'Color is required').not().isEmpty(),
    check('sizes.*.quantity', 'Sizes quantity is required').isNumeric(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, price, brand, category, subcategory, description, material, color, sizes } = req.body;
    const imageUrl = req.file ? req.file.path : '';

    try {
      const product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(404).json({ msg: 'Product not found' });
      }

      product.name = name;
      product.price = price;
      product.brand = brand;
      product.category = category;
      product.subcategory = subcategory;
      product.description = description;
      product.material = material;
      product.color = color;
      product.sizes = sizes;

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


// routes/products.js
router.get('/products', async (req, res) => {
  try {
    const { category, subcategory } = req.query;
    const query = {};

    if (category) query.category = new RegExp(`^${category}$`, 'i');
    if (subcategory) query.subcategory = new RegExp(`^${subcategory}$`, 'i');

    const products = await Product.find(query);
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});



module.exports = router;
