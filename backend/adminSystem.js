const fs = require('fs');
const path = require('path');

const PRODUCTS_FILE = path.join(__dirname, 'products.json');
const ORDERS_FILE = path.join(__dirname, 'orders.json');

function getData(file) {
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file));
}

function saveData(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

module.exports = {
  // Add New Product
  addProduct: (req, res) => {
    const { title, price, originalPrice, discount, rating, image, category } = req.body;
    if (!title || !price) {
      return res.status(400).json({ success: false, message: 'Title and Price are required!' });
    }

    const products = getData(PRODUCTS_FILE);
    const newProduct = {
      id: 'p' + (products.length + 1) + '_' + Date.now(),
      title,
      price: Number(price),
      originalPrice: Number(originalPrice || price),
      discount: discount || '0% OFF',
      rating: Number(rating || 4.5),
      image: image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
      category: category || 'General'
    };

    products.push(newProduct);
    saveData(PRODUCTS_FILE, products);

    res.json({ success: true, message: 'Product added successfully!', product: newProduct });
  },

  // Update Order Status
  updateOrderStatus: (req, res) => {
    const { orderId, status } = req.body;
    const orders = getData(ORDERS_FILE);
    const order = orders.find(o => o.orderId === orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found!' });
    }

    order.status = status;
    saveData(ORDERS_FILE, orders);

    res.json({ success: true, message: 'Order status updated successfully!', order });
  },

  // Get All Orders for Admin
  getAllOrders: (req, res) => {
    const orders = getData(ORDERS_FILE);
    res.json({ success: true, orders });
  }
};
