const express = require('express');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Enroll in course
router.post('/', auth, async (req, res) => {
  try {
    const { courseId } = req.body;
    const existing = await Enrollment.findOne({ user: req.user.id, course: courseId });
    if (existing) return res.status(400).json({ error: 'Already enrolled' });

    const enrollment = new Enrollment({ user: req.user.id, course: courseId });
    await enrollment.save();

    await User.findByIdAndUpdate(req.user.id, { $push: { enrolledCourses: courseId } });
    await Course.findByIdAndUpdate(courseId, { $push: { enrolledStudents: req.user.id } });

    res.status(201).json(enrollment);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's enrollments
router.get('/', auth, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user.id }).populate('course');
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update progress
router.put('/:enrollmentId/progress', auth, async (req, res) => {
  try {
    const { progress, completedLessons } = req.body;
    const enrollment = await Enrollment.findById(req.params.enrollmentId);

    if (!enrollment || enrollment.user.toString() !== req.user.id) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    enrollment.progress = progress;
    if (completedLessons) {
      enrollment.completedLessons = completedLessons;
    }

    // Check if course is completed
    if (progress === 100 && !enrollment.completedAt) {
      enrollment.completedAt = new Date();
      // Generate certificate URL (in real app, this would generate a PDF)
      enrollment.certificate = `certificate-${enrollment._id}.pdf`;
    }

    await enrollment.save();
    res.json(enrollment);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get certificate
router.get('/:enrollmentId/certificate', auth, async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.enrollmentId).populate('course user');

    if (!enrollment || enrollment.user._id.toString() !== req.user.id) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    if (enrollment.progress !== 100) {
      return res.status(400).json({ error: 'Course not completed' });
    }

    res.json({
      certificate: enrollment.certificate,
      course: enrollment.course.title,
      user: enrollment.user.name,
      completedAt: enrollment.completedAt
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Unenroll from course
router.delete('/:enrollmentId', auth, async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.enrollmentId);

    if (!enrollment || enrollment.user.toString() !== req.user.id) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    // Remove enrollment from database
    await Enrollment.findByIdAndDelete(req.params.enrollmentId);

    // Remove course from user's enrolledCourses array
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { enrolledCourses: enrollment.course }
    });

    // Remove user from course's enrolledStudents array
    await Course.findByIdAndUpdate(enrollment.course, {
      $pull: { enrolledStudents: req.user.id }
    });

    res.json({ message: 'Successfully unenrolled from course' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;