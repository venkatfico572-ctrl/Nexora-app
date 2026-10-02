const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('frontend/public'));

// Dynamic In-Memory Store Database
let products = [
  {
    id: 'p1',
    name: 'Nexora Smart Helmet',
    price: 4999,
    category: 'Wearables',
    modelUrl: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb'
  },
  {
    id: 'p2',
    name: 'Astro Cyber Helmet V2',
    price: 8499,
    category: 'Gear',
    modelUrl: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb'
  },
  {
    id: 'p3',
    name: 'Nexora Core Cube',
    price: 2999,
    category: 'Tech Gadget',
    modelUrl: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Box/glTF-Binary/Box.glb'
  }
];

let orders = [];

app.get('/api/health', (req, res) => {
  res.json({ status: 'online', app: 'Nexora AR Platform', version: '1.0.0' });
});

// Get All Products
app.get('/api/products', (req, res) => {
  res.json({ success: true, count: products.length, data: products });
});

// Add New Product (Admin API)
app.post('/api/products', (req, res) => {
  const { name, price, category, modelUrl } = req.body;
  if (!name || !price || !category || !modelUrl) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  const newProduct = {
    id: 'p' + (products.length + 1),
    name,
    price: Number(price),
    category,
    modelUrl
  };

  products.push(newProduct);
  res.json({ success: true, message: 'Product added successfully!', data: newProduct });
});

// Payment & Order API
app.post('/api/pay', (req, res) => {
  const { cartItems, totalAmount, paymentMethod } = req.body;
  if (!cartItems || cartItems.length === 0) {
    return res.status(400).json({ success: false, message: 'Cart is empty!' });
  }

  const orderId = 'NEX-' + Math.floor(100000 + Math.random() * 900000);
  const txnId = 'TXN-' + Date.now();
  const orderDate = new Date().toLocaleString();

  const newOrder = { orderId, txnId, cartItems, totalAmount, paymentMethod, date: orderDate };
  orders.push(newOrder);

  res.json({
    success: true,
    message: 'Payment Successful!',
    orderId,
    txnId,
    totalAmount,
    timestamp: orderDate
  });
});

// Admin Analytics API
app.get('/api/admin/stats', (req, res) => {
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  res.json({
    success: true,
    totalProducts: products.length,
    totalOrders: orders.length,
    totalRevenue: totalRevenue,
    recentOrders: orders.slice(-5).reverse()
  });
});

app.listen(PORT, () => {
  console.log(`\n=================================`);
  console.log(`🚀 Nexora Server Running on Port ${PORT}`);
  console.log(`🌐 Local Link: http://localhost:${PORT}`);
  console.log(`=================================\n`);
});
