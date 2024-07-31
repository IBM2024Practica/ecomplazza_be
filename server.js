// server.js
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

const productsData = {
  women: {
    'basic-tees': [
      {
        name: 'Women Basic Tee 1',
        imageSrc: 'https://tailwindui.com/img/ecommerce-images/mega-menu-category-02.jpg',
        imageAlt: 'Close up of Basic Tee fall bundle with off-white, ochre, olive, and black tees.',
        description: 'Description for Women Basic Tee 1',
      },
      // alte produse pentru categoria Women Basic Tees
    ],
    'new-arrivals': [
      {
        name: 'Women New Arrival 1',
        imageSrc: 'https://tailwindui.com/img/ecommerce-images/mega-menu-category-01.jpg',
        imageAlt: 'Models sitting back to back, wearing Basic Tee in black and bone.',
        description: 'Description for Women New Arrival 1',
      },
      // alte produse pentru categoria Women New Arrivals
    ],
    'accessories': [
      {
        name: 'Women Accessory 1',
        imageSrc: 'https://tailwindui.com/img/ecommerce-images/mega-menu-category-03.jpg',
        imageAlt: 'Model wearing minimalist watch with black wristband and white watch face.',
        description: 'Description for Women Accessory 1',
      },
      // alte produse pentru categoria Women Accessories
    ],
  },
  men: {
    'basic-tees': [
      {
        name: 'Men Basic Tee 1',
        imageSrc: 'https://tailwindui.com/img/ecommerce-images/mega-menu-01-men-category-02.jpg',
        imageAlt: 'Model wearing light heather gray t-shirt.',
        description: 'Description for Men Basic Tee 1',
      },
      // alte produse pentru categoria Men Basic Tees
    ],
    'new-arrivals': [
      {
        name: 'Men New Arrival 1',
        imageSrc: 'https://tailwindui.com/img/ecommerce-images/mega-menu-01-men-category-01.jpg',
        imageAlt: 'Hats and sweaters on wood shelves next to various colors of t-shirts on hangers.',
        description: 'Description for Men New Arrival 1',
      },
      // alte produse pentru categoria Men New Arrivals
    ],
    'accessories': [
      {
        name: 'Men Accessory 1',
        imageSrc: 'https://tailwindui.com/img/ecommerce-images/mega-menu-01-men-category-03.jpg',
        imageAlt: 'Grey 6-panel baseball hat with black brim, black mountain graphic on front, and light heather gray body.',
        description: 'Description for Men Accessory 1',
      },
      // alte produse pentru categoria Men Accessories
    ],
  },
};

app.get('/api/products', (req, res) => {
  const { category, subcategory } = req.query;
  if (category && subcategory && productsData[category] && productsData[category][subcategory]) {
    res.json(productsData[category][subcategory]);
  } else {
    res.status(404).json({ error: 'Products not found' });
  }
});
app.get('/status', (req, res) => {
    res.send('Server is running and accessible.');
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

