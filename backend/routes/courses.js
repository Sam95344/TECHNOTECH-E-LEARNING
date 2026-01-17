const express = require('express');
const Course = require('../models/Course');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all courses with filters
router.get('/', async (req, res) => {
  try {
    const { category, level, search } = req.query;
    let query = {};
    if (category) query.category = category;
    if (level) query.level = level;
    if (search) query.title = { $regex: search, $options: 'i' };

    const courses = await Course.find(query).populate('instructor', 'name').sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get course by ID
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('instructor', 'name bio');
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create course (instructor only)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'instructor') return res.status(403).json({ error: 'Access denied' });

  try {
    const course = new Course({ ...req.body, instructor: req.user.id });
    await course.save();
    await User.findByIdAndUpdate(req.user.id, { $push: { createdCourses: course._id } });
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add rating and review
router.post('/:id/rating', auth, async (req, res) => {
  try {
    const { rating, review } = req.body;
    const course = await Course.findById(req.params.id);

    if (!course) return res.status(404).json({ error: 'Course not found' });

    // Check if user is enrolled
    const enrollment = await require('../models/Enrollment').findOne({
      user: req.user.id,
      course: req.params.id
    });

    if (!enrollment) return res.status(403).json({ error: 'Must be enrolled to rate' });

    // Remove existing rating if any
    course.ratings = course.ratings.filter(r => r.user.toString() !== req.user.id);

    // Add new rating
    course.ratings.push({ user: req.user.id, rating, review });

    // Calculate average rating
    const totalRating = course.ratings.reduce((sum, r) => sum + r.rating, 0);
    course.averageRating = totalRating / course.ratings.length;

    await course.save();
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;