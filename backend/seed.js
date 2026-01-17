const mongoose = require('mongoose');
const Course = require('./models/Course');
const User = require('./models/User');
require('dotenv').config();

const dummyCourses = [
  {
    title: "Complete Web Development Bootcamp",
    description: "Learn HTML, CSS, JavaScript, React, Node.js, and MongoDB from scratch. Build real-world projects and deploy them to production.",
    category: "Programming",
    level: "Beginner",
    duration: "40 hours",
    price: 99,
    videos: [
      { title: "Introduction to HTML", url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4", duration: "15 min", type: "recorded" },
      { title: "CSS Fundamentals", url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4", duration: "25 min", type: "recorded" },
      { title: "JavaScript Basics", url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4", duration: "30 min", type: "recorded" },
      { title: "React Components", url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_10mb.mp4", duration: "45 min", type: "recorded" },
      { title: "Node.js Backend", url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_20mb.mp4", duration: "50 min", type: "recorded" }
    ],
    liveClasses: [
      {
        title: "Live Q&A Session - Week 1",
        description: "Join us for an interactive Q&A session to clarify your doubts about HTML and CSS basics.",
        scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        duration: "60 min",
        meetingLink: "https://zoom.us/j/example123",
        isActive: true
      },
      {
        title: "Live Coding Session - React Project",
        description: "Live coding demonstration of building a React application from scratch.",
        scheduledDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
        duration: "90 min",
        meetingLink: "https://zoom.us/j/example456",
        isActive: true
      }
    ],
    recordedSessions: [
      {
        title: "Previous Live Session - HTML Deep Dive",
        url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
        duration: "75 min"
      },
      {
        title: "Previous Live Session - JavaScript Interview Questions",
        url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
        duration: "60 min"
      }
    ],
    ratings: [
      { user: null, rating: 5, review: "Excellent course! Very comprehensive and well-structured." },
      { user: null, rating: 4, review: "Great content, but could use more advanced topics." }
    ],
    averageRating: 4.5
  },
  {
    title: "Advanced React Development",
    description: "Master advanced React concepts including hooks, context, performance optimization, and state management with Redux.",
    category: "Programming",
    level: "Advanced",
    duration: "25 hours",
    price: 149,
    videos: [
      { title: "Advanced Hooks", url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4", duration: "35 min" },
      { title: "Context API Deep Dive", url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4", duration: "40 min" },
      { title: "Performance Optimization", url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4", duration: "55 min" }
    ],
    ratings: [
      { user: null, rating: 5, review: "Perfect for experienced developers looking to level up." }
    ],
    averageRating: 5.0
  },
  {
    title: "Digital Marketing Mastery",
    description: "Learn SEO, social media marketing, content marketing, email marketing, and analytics to grow your business online.",
    category: "Marketing",
    level: "Intermediate",
    duration: "30 hours",
    price: 89,
    videos: [
      { title: "SEO Fundamentals", url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4", duration: "45 min" },
      { title: "Social Media Strategy", url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4", duration: "50 min" },
      { title: "Content Marketing", url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4", duration: "40 min" }
    ],
    ratings: [
      { user: null, rating: 4, review: "Very practical and actionable content." },
      { user: null, rating: 5, review: "Helped me grow my business significantly." }
    ],
    averageRating: 4.5
  },
  {
    title: "UI/UX Design Principles",
    description: "Master the fundamentals of user interface and user experience design. Learn design thinking, prototyping, and user research.",
    category: "Design",
    level: "Beginner",
    duration: "35 hours",
    price: 79,
    videos: [
      { title: "Design Thinking Process", url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4", duration: "30 min" },
      { title: "Wireframing and Prototyping", url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4", duration: "45 min" },
      { title: "User Research Methods", url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4", duration: "40 min" }
    ],
    ratings: [
      { user: null, rating: 5, review: "Great foundation for aspiring designers." }
    ],
    averageRating: 5.0
  },
  {
    title: "Machine Learning with Python",
    description: "Learn machine learning algorithms, data preprocessing, model training, and deployment using Python and scikit-learn.",
    category: "AI",
    level: "Intermediate",
    duration: "45 hours",
    price: 199,
    videos: [
      { title: "Python for Data Science", url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4", duration: "60 min" },
      { title: "Supervised Learning", url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4", duration: "75 min" },
      { title: "Neural Networks", url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4", duration: "90 min" }
    ],
    ratings: [
      { user: null, rating: 4, review: "Challenging but rewarding course." },
      { user: null, rating: 5, review: "Excellent mathematical foundations." }
    ],
    averageRating: 4.5
  },
  {
    title: "Business Strategy and Management",
    description: "Learn strategic planning, financial management, leadership, and organizational behavior for business success.",
    category: "Business",
    level: "Intermediate",
    duration: "28 hours",
    price: 129,
    videos: [
      { title: "Strategic Planning", url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4", duration: "40 min" },
      { title: "Financial Management", url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4", duration: "50 min" },
      { title: "Leadership Skills", url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4", duration: "45 min" }
    ],
    ratings: [
      { user: null, rating: 4, review: "Very comprehensive business course." }
    ],
    averageRating: 4.0
  },
  {
    title: "Data Science Fundamentals",
    description: "Master data analysis, statistics, visualization, and machine learning basics with Python and popular libraries.",
    category: "Data Science",
    level: "Beginner",
    duration: "50 hours",
    price: 159,
    videos: [
      { title: "Statistics for Data Science", url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4", duration: "55 min" },
      { title: "Data Visualization", url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4", duration: "45 min" },
      { title: "Pandas and NumPy", url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4", duration: "65 min" }
    ],
    ratings: [
      { user: null, rating: 5, review: "Perfect starting point for data science." },
      { user: null, rating: 4, review: "Good balance of theory and practice." }
    ],
    averageRating: 4.5
  },
  {
    title: "Photography Masterclass",
    description: "Learn professional photography techniques, lighting, composition, post-processing, and build your photography portfolio.",
    category: "Photography",
    level: "Intermediate",
    duration: "32 hours",
    price: 109,
    videos: [
      { title: "Camera Settings and Exposure", url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4", duration: "35 min" },
      { title: "Lighting Techniques", url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4", duration: "50 min" },
      { title: "Post-Processing with Lightroom", url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4", duration: "60 min" }
    ],
    ratings: [
      { user: null, rating: 5, review: "Transformed my photography skills." }
    ],
    averageRating: 5.0
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing courses
    await Course.deleteMany({});
    console.log('Cleared existing courses');

    // Find or create an instructor
    let instructor = await User.findOne({ role: 'instructor' });
    if (!instructor) {
      instructor = new User({
        name: 'John Smith',
        email: 'instructor@example.com',
        password: 'password123',
        role: 'instructor'
      });
      await instructor.save();
      console.log('Created instructor user');
    }

    // Create courses with instructor reference
    for (const courseData of dummyCourses) {
      const course = new Course({
        ...courseData,
        instructor: instructor._id
      });
      await course.save();
      console.log(`Created course: ${course.title}`);
    }

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();