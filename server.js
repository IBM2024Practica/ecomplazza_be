// server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

dotenv.config();

const productRoutes = require('./routes/Products');
const userRoutes = require('./routes/Users');
const orderRoutes = require('./routes/Orders');


const app = express();
const PORT = process.env.PORT || 5000;


console.log('MONGO_URI:', process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors({
  origin: 'https://ecomplazza-fe.vercel.app', // sau URL-ul frontend-ului tău
  credentials: true
}));
app.use(cookieParser());
app.use(express.json()); // For parsing JSON request bodies

app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});


// Use routes
app.use('/api/products', productRoutes); // Products route
app.use('/api/users', userRoutes);       // Users route
app.use('/api/orders', orderRoutes);     // Orders route

app.use(express.static('public'));


app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Express!' });
});
app.get('/status', (req, res) => {
    res.send('Server is running and accessible.');
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

