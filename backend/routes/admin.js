const express = require('express');
const User = require('../models/User');
const Course = require('../models/Course');
const auth = require('../middleware/auth');

const router = express.Router();

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Get all users (admin only)
router.get('/users', auth, requireAdmin, async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all courses with enrollment data (admin only)
router.get('/courses', auth, requireAdmin, async (req, res) => {
  try {
    const courses = await Course.find({})
      .populate('instructor', 'name')
      .sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get platform statistics (admin only)
router.get('/stats', auth, requireAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCourses = await Course.countDocuments();

    // Calculate total revenue and enrollments
    const courses = await Course.find({});
    let totalRevenue = 0;
    let activeEnrollments = 0;

    courses.forEach(course => {
      const enrollments = course.enrolledStudents?.length || 0;
      totalRevenue += course.price * enrollments;
      activeEnrollments += enrollments;
    });

    res.json({
      totalUsers,
      totalCourses,
      totalRevenue,
      activeEnrollments
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete user (admin only)
router.delete('/users/:id', auth, requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Don't allow deleting admin users
    if (user.role === 'admin') {
      return res.status(403).json({ error: 'Cannot delete admin user' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete course (admin only)
router.delete('/courses/:id', auth, requireAdmin, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create course (admin only)
router.post('/courses', auth, requireAdmin, async (req, res) => {
  try {
    const { title, description, instructor, category, level, duration, price, thumbnail, videos } = req.body;
    const instructorId = instructor || req.user.id; // default to admin if not provided

    const course = new Course({
      title,
      description,
      instructor: instructorId,
      category,
      level,
      duration,
      price,
      thumbnail,
      videos: videos || []
    });

    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update course (admin only)
router.put('/courses/:id', auth, requireAdmin, async (req, res) => {
  try {
    const updates = req.body;
    const course = await Course.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;