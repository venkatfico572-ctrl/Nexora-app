const fs = require('fs');
const path = require('path');

const ORDERS_FILE = path.join(__dirname, 'orders.json');

function getOrders() {
  if (!fs.existsSync(ORDERS_FILE)) {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify([]));
  }
  return JSON.parse(fs.readFileSync(ORDERS_FILE));
}

function saveOrders(orders) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
}

module.exports = {
  // Place Order
  placeOrder: (req, res) => {
    const { userId, items, totalAmount, deliveryAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty!' });
    }

    const orders = getOrders();
    const newOrder = {
      orderId: 'NEX_' + Date.now(),
      userId,
      items,
      totalAmount,
      deliveryAddress,
      paymentMethod,
      status: 'ORDER_PLACED', // Placed, Packed, Shipped, Out for Delivery, Delivered
      orderDate: new Date().toLocaleString(),
      estimatedDelivery: '3-5 Business Days'
    };

    orders.push(newOrder);
    saveOrders(orders);

    res.json({
      success: true,
      message: 'Order placed successfully!',
      order: newOrder
    });
  },

  // Get Orders for User
  getUserOrders: (req, res) => {
    const { userId } = req.params;
    const orders = getOrders();
    const userOrders = orders.filter(o => o.userId === userId);
    res.json({ success: true, orders: userOrders });
  }
};
