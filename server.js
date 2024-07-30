const express = require('express');
const app = express();
const port = 5000;

// Middleware pentru a parsea cererile de tip JSON
app.use(express.json());

// Definirea unui endpoint simplu
app.get('/', (req, res) => {
  res.send('Salutare de la serverul nostru Node.js și Express!');
});

// Pornirea serverului
app.listen(port, () => {
  console.log(`Serverul rulează la http://localhost:${port}`);
});
