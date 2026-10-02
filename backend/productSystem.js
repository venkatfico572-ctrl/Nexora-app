const fs = require('fs');
const path = require('path');

const PRODUCTS_FILE = path.join(__dirname, 'products.json');

// Sample Products Initialization
function getProducts() {
  if (!fs.existsSync(PRODUCTS_FILE)) {
    const sampleProducts = [
      {
        id: 'PROD_1',
        title: 'Nexora Wireless Headphones',
        category: 'Electronics',
        price: 2499,
        originalPrice: 4999,
        discount: '50% OFF',
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
        description: 'High quality active noise cancelling wireless headphones with 30-hour battery life.',
        stock: 15
      },
      {
        id: 'PROD_2',
        title: 'Smart Fitness Watch Series X',
        category: 'Electronics',
        price: 1999,
        originalPrice: 3999,
        discount: '50% OFF',
        rating: 4.3,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
        description: 'HD Display, Heart Rate Sensor, SpO2 Monitor & IP68 Waterproof.',
        stock: 8
      },
      {
        id: 'PROD_3',
        title: 'Classic Denim Jacket',
        category: 'Fashion',
        price: 1499,
        originalPrice: 2999,
        discount: '50% OFF',
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500',
        description: 'Premium cotton fabric classic stylish denim jacket for everyday comfort.',
        stock: 20
      }
    ];
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(sampleProducts, null, 2));
  }
  return JSON.parse(fs.readFileSync(PRODUCTS_FILE));
}

module.exports = {
  // Get all products
  getAllProducts: (req, res) => {
    const products = getProducts();
    res.json({ success: true, products });
  },

  // Get single product details
  getProductById: (req, res) => {
    const products = getProducts();
    const product = products.find(p => p.id === req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  }
};
