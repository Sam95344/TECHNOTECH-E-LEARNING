const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], required: true },
  duration: { type: String, required: true },
  price: { type: Number, required: true },
  thumbnail: { type: String },
  videos: [{
    title: String,
    url: String,
    duration: String,
    type: { type: String, enum: ['recorded', 'live'], default: 'recorded' }
  }],
  liveClasses: [{
    title: String,
    description: String,
    scheduledDate: Date,
    duration: String,
    meetingLink: String,
    isActive: { type: Boolean, default: true }
  }],
  recordedSessions: [{
    title: String,
    url: String,
    duration: String,
    uploadDate: { type: Date, default: Date.now }
  }],
  assignments: [{
    title: String,
    description: String,
    dueDate: Date,
  }],
  enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  ratings: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: Number,
    review: String,
  }],
  averageRating: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);