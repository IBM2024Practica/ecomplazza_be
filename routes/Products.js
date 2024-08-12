const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, '../uploads');
    cb(null, dir);
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
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    try {
      const newProduct = new Product({
        name,
        price,
        brand,
        category,
        subcategory,
        description,
        imageUrl,
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
// routes/products.js
router.get('/products', async (req, res) => {
  try {
    const { category, subcategory, minPrice, maxPrice, material } = req.query;
    const query = {};

    console.log('Category:', category); // Verificăm ce categorie ajunge aici

    if (category) query.category = new RegExp(`^${category}$`, 'i'); // Case-insensitive regex
    if (subcategory) query.subcategory = { $in: subcategory.split(',') };
    if (minPrice) query.price = { $gte: Number(minPrice) };
    if (maxPrice) query.price = { ...query.price, $lte: Number(maxPrice) };
    if (material) query.material = { $in: material.split(',') };

    const products = await Product.find(query);
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


// Add to Favourites
router.post('/favourites/add/:productId', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.productId;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    // Add product to user's favourites
    await User.findByIdAndUpdate(userId, {
      $addToSet: { favourites: productId }
    });

    // Add user to product's favouritedBy list
    await Product.findByIdAndUpdate(productId, {
      $addToSet: { favouritedBy: userId }
    });

    res.json({ msg: 'Product added to favourites' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Remove from Favourites
router.post('/favourites/remove/:productId', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.productId;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    // Remove product from user's favourites
    await User.findByIdAndUpdate(userId, {
      $pull: { favourites: productId }
    });

    // Remove user from product's favouritedBy list
    await Product.findByIdAndUpdate(productId, {
      $pull: { favouritedBy: userId }
    });

    res.json({ msg: 'Product removed from favourites' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get User's Favourites
router.get('/favourites', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate('favourites'); // Populate the favourites field with product details

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(user.favourites);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});



module.exports = router;
