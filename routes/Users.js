const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
require('dotenv').config();

// Register User
router.post(
  '/register',
  [
    check('username', 'Username is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, role } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: 'User already exists' });
      }

      user = new User({
        username,
        email,
        password,
        role,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id,
          role: user.role,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '5d' },
        (err, token) => {
          if (err) throw err;
          res.status(201).json({ token, user: payload.user });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Authenticate User
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email }).populate('cart.productId').populate('favourites');
      if (!user) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

      const payload = {
        user: {
          id: user.id,
          name: user.username,
          role: user.role,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '5d' },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({ token, user: payload.user, cart: user.cart, favourites: user.favourites });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Verify Session
router.get('/verifySession', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('cart.productId').populate('favourites');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json({ user: { id: user.id, username: user.username, role: user.role }, cart: user.cart, favourites: user.favourites });
  } catch (err) {
    console.error(err.message);
    res.status(401).json({ msg: 'Token is invalid' });
  }
});

// Get User's Cart
router.get('/cart', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('cart.productId');
    res.json(user.cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add to Cart
router.post('/cart', auth, async (req, res) => {
  const { productId, selectedSize, selectedColor, quantity } = req.body;

  try {
    const user = await User.findById(req.user.id);
    const existingItemIndex = user.cart.findIndex(
      (item) => item.productId.toString() === productId && item.selectedSize === selectedSize && item.selectedColor === selectedColor
    );

    if (existingItemIndex !== -1) {
      user.cart[existingItemIndex].quantity += quantity;
    } else {
      user.cart.push({ productId, selectedSize, selectedColor, quantity });
    }

    await user.save();
    res.json(user.cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Remove from Cart
router.delete('/cart/:itemId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.cart = user.cart.filter(item => item._id.toString() !== req.params.itemId);
    await user.save();
    res.json(user.cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get User's Favourites
router.get('/favourites', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('favourites');
    res.json(user.favourites);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add/Remove Favourites
router.post('/favourites', auth, async (req, res) => {
  const { productId } = req.body;

  try {
    const user = await User.findById(req.user.id);
    const isFavourite = user.favourites.includes(productId);

    if (isFavourite) {
      user.favourites = user.favourites.filter(fav => fav.toString() !== productId);
    } else {
      user.favourites.push(productId);
    }

    await user.save();
    res.json(user.favourites);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all users
router.get('/get', auth, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user role
router.put('/:id/role', auth, async (req, res) => {
  const { role } = req.body;

  try {
    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.json({ msg: 'Logged out successfully' });
});

module.exports = router;
