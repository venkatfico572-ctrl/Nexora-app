const express = require('express');
const path = require('path');
const userSystem = require('./userSystem');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Public static files (Frontend) connect చేయడం
app.use(express.static(path.join(__dirname, '../frontend')));

// User System API Routes
app.post('/api/user/register', userSystem.register);
app.post('/api/user/login', userSystem.login);
app.post('/api/user/address', userSystem.addAddress);
app.get('/api/user/profile/:userId', userSystem.getProfile);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Product System API Routes
const productSystem = require('./productSystem');
app.get('/api/products', productSystem.getAllProducts);
app.get('/api/products/:id', productSystem.getProductById);
