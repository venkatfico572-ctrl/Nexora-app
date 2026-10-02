const fs = require('fs');
const path = require('path');

const USERS_FILE = path.join(__dirname, 'users.json');

// Helper to read users
function getUsers() {
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([]));
  }
  const data = fs.readFileSync(USERS_FILE);
  return JSON.parse(data);
}

// Helper to save users
function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

module.exports = {
  // Register User
  register: (req, res) => {
    const { name, email, password, phone } = req.body;
    const users = getUsers();
    
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ success: false, message: 'Email already registered!' });
    }

    const newUser = {
      id: 'USR_' + Date.now(),
      name,
      email,
      password, // In production, hash this with bcrypt
      phone,
      addresses: [],
      walletBalance: 0,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);
    res.json({ success: true, message: 'Account created successfully!', user: newUser });
  },

  // Login User
  login: (req, res) => {
    const { email, password } = req.body;
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password!' });
    }

    res.json({ success: true, message: 'Login successful!', user });
  },

  // Add/Update Address (Home, Work, etc.)
  addAddress: (req, res) => {
    const { userId, address } = req.body; // address: { name, street, city, state, pincode, phone, type }
    const users = getUsers();
    const user = users.find(u => u.id === userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found!' });
    }

    address.id = 'ADDR_' + Date.now();
    user.addresses.push(address);
    saveUsers(users);

    res.json({ success: true, message: 'Address saved successfully!', addresses: user.addresses });
  },

  // Get Profile
  getProfile: (req, res) => {
    const { userId } = req.params;
    const users = getUsers();
    const user = users.find(u => u.id === userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found!' });
    }

    res.json({ success: true, user });
  }
};
