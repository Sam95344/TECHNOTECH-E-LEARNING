const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ name, email, password: hashedPassword, role: 'student' });
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token, user: { id: user._id, name, email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { email: `"${email}"`, password: `"${password}"` }); // Debug log

    // Check for admin credentials from .env
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (email === adminEmail && password === adminPassword) {
      console.log('Admin credentials matched!'); // Debug log
      // Check if admin user exists, if not create one
      let adminUser = await User.findOne({ email: adminEmail });
      if (!adminUser) {
        console.log('Creating admin user...'); // Debug log
        const hashedPassword = await bcrypt.hash(adminPassword, 12);
        adminUser = new User({
          name: 'Admin',
          email: adminEmail,
          password: hashedPassword,
          role: 'admin'
        });
        await adminUser.save();
        console.log('Admin user created'); // Debug log
      }

      const token = jwt.sign({ id: adminUser._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return res.json({ token, user: { id: adminUser._id, name: 'Admin', email: adminEmail, role: 'admin' } });
    }

    console.log('Not admin, checking regular user...'); // Debug log
    // Regular user login
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, name: user.name, email, role: user.role } });
  } catch (err) {
    console.error('Login error:', err); // Debug log
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;