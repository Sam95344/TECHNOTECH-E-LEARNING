const express = require('express');
const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');
const Course = require('../models/Course');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all quizzes (admin only)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const quizzes = await Quiz.find().populate('course', 'title').populate('createdBy', 'name');
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get quizzes for a specific course (students)
router.get('/course/:courseId', auth, async (req, res) => {
  try {
    const quizzes = await Quiz.find({
      course: req.params.courseId,
      isActive: true
    }).select('title description duration passingScore createdAt');

    // Check if student has already attempted each quiz
    const attempts = await QuizAttempt.find({
      student: req.user.id,
      quiz: { $in: quizzes.map(q => q._id) }
    });

    const quizzesWithAttempts = quizzes.map(quiz => {
      const attempt = attempts.find(a => a.quiz.toString() === quiz._id.toString());
      return {
        ...quiz.toObject(),
        attempted: !!attempt,
        score: attempt ? attempt.score : null,
        passed: attempt ? attempt.passed : null
      };
    });

    res.json(quizzesWithAttempts);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all available quizzes for student's enrolled courses
router.get('/student', auth, async (req, res) => {
  try {
    // Get student's enrolled courses
    const Enrollment = require('../models/Enrollment');
    // Enrollment schema uses `user` field, not `student`
    const enrollments = await Enrollment.find({ user: req.user.id }).select('course');
    const enrolledCourseIds = enrollments.map(e => e.course);

    // Get active quizzes for enrolled courses
    const quizzes = await Quiz.find({
      course: { $in: enrolledCourseIds },
      isActive: true
    }).populate('course', 'title');

    // Check if student has already attempted each quiz
    const attempts = await QuizAttempt.find({
      student: req.user.id,
      quiz: { $in: quizzes.map(q => q._id) }
    });

    const quizzesWithAttempts = quizzes.map(quiz => {
      const attempt = attempts.find(a => a.quiz.toString() === quiz._id.toString());
      return {
        ...quiz.toObject(),
        attempted: !!attempt,
        score: attempt ? attempt.score : null,
        passed: attempt ? attempt.passed : null
      };
    });

    // Filter out already attempted quizzes
    const availableQuizzes = quizzesWithAttempts.filter(quiz => !quiz.attempted);

    res.json(availableQuizzes);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create quiz (admin only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { title, description, course, questions, duration, passingScore } = req.body;

    // Validate questions
    if (!questions || questions.length === 0) {
      return res.status(400).json({ error: 'At least one question is required' });
    }

    for (const question of questions) {
      if (!question.question || !question.options || question.options.length !== 4 || question.correctAnswer === undefined) {
        return res.status(400).json({ error: 'Each question must have a question text, 4 options, and a correct answer index' });
      }
    }

    const quiz = new Quiz({
      title,
      description,
      course,
      questions,
      duration: duration || 30,
      passingScore: passingScore || 70,
      createdBy: req.user.id
    });

    await quiz.save();
    await quiz.populate('course', 'title');
    await quiz.populate('createdBy', 'name');

    res.status(201).json(quiz);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get quiz by ID (for taking quiz)
router.get('/:id', auth, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('course', 'title');

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // Check if student has already attempted this quiz
    const existingAttempt = await QuizAttempt.findOne({
      student: req.user.id,
      quiz: req.params.id
    });

    if (existingAttempt) {
      return res.status(400).json({
        error: 'Quiz already attempted',
        score: existingAttempt.score,
        passed: existingAttempt.passed
      });
    }

    // For students, don't send correct answers
    const quizData = {
      ...quiz.toObject(),
      questions: quiz.questions.map(q => ({
        question: q.question,
        options: q.options
      }))
    };

    res.json(quizData);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Submit quiz attempt
router.post('/:id/submit', auth, async (req, res) => {
  try {
    const { answers } = req.body;

    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // Check if student has already attempted this quiz
    const existingAttempt = await QuizAttempt.findOne({
      student: req.user.id,
      quiz: req.params.id
    });

    if (existingAttempt) {
      return res.status(400).json({ error: 'Quiz already attempted' });
    }

    // Calculate score
    let correctAnswers = 0;
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / quiz.questions.length) * 100);
    const passed = score >= quiz.passingScore;

    // Save attempt
    const attempt = new QuizAttempt({
      student: req.user.id,
      quiz: req.params.id,
      answers,
      score,
      totalQuestions: quiz.questions.length,
      correctAnswers,
      passed
    });

    await attempt.save();

    res.json({
      score,
      totalQuestions: quiz.questions.length,
      correctAnswers,
      passed,
      passingScore: quiz.passingScore
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update quiz (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    const { title, description, questions, duration, passingScore, isActive } = req.body;

    if (title) quiz.title = title;
    if (description !== undefined) quiz.description = description;
    if (questions) quiz.questions = questions;
    if (duration) quiz.duration = duration;
    if (passingScore) quiz.passingScore = passingScore;
    if (isActive !== undefined) quiz.isActive = isActive;

    await quiz.save();
    await quiz.populate('course', 'title');
    await quiz.populate('createdBy', 'name');

    res.json(quiz);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete quiz (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    await Quiz.findByIdAndDelete(req.params.id);
    await QuizAttempt.deleteMany({ quiz: req.params.id });

    res.json({ message: 'Quiz deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get quiz attempts for a student
router.get('/:id/attempts', auth, async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({
      student: req.user.id,
      quiz: req.params.id
    }).sort({ completedAt: -1 });

    res.json(attempts);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;