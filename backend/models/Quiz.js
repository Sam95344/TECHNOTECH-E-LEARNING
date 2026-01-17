const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  // Week number within the course (for weekly assessments)
  weekNumber: { type: Number, default: 1 },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  questions: [{
    question: { type: String, required: true },
    options: [{ type: String, required: true }], // Array of 4 options
    correctAnswer: { type: Number, required: true }, // Index of correct answer (0-3)
    explanation: { type: String } // Optional explanation
  }],
  duration: { type: Number, default: 30 }, // Duration in minutes
  passingScore: { type: Number, default: 70 }, // Minimum passing score
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);