const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
// const Stripe = require('stripe');
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const enrollRoutes = require('./routes/enroll');
const adminRoutes = require('./routes/admin');
const quizRoutes = require('./routes/quiz');
const translateRoutes = require('./routes/translate');
// const checkoutRoutes = require('./routes/checkout');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
console.log('PORT:', PORT);

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  console.log('MongoDB connected');
  
  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/courses', courseRoutes);
  app.use('/api/enroll', enrollRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/quiz', quizRoutes);
  app.use('/api/translate', translateRoutes);
  // app.use('/api/checkout', checkoutRoutes);

  // Test route
  app.get('/api/test', (req, res) => {
    res.json({ message: 'Server is running' });
  });

  // Serve static files from the React app build directory
  // app.use(express.static(path.join(__dirname, '../frontend/dist')));

  // Catch all handler: send back React's index.html file for any non-API routes
  // app.use((req, res, next) => {
  //   // Skip API routes
  //   if (req.path.startsWith('/api/')) {
  //     return next();
  //   }
  //   res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  // });

  // Start server only after DB connection
  console.log('Starting server...');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  }).on('error', (err) => {
    console.error('Server error:', err);
    process.exit(1);
  });
})
.catch(err => {
  console.log('MongoDB connection error:', err);
  process.exit(1);
});