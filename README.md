# TECHNOTECH E-LEARNING Platform

A modern, full-stack e-learning platform built with React, Node.js, and MongoDB. This platform enables instructors to create and manage courses, conduct quizzes, and manage enrollments while providing students with a seamless learning experience.

## 🌟 Features

### For Students
- 📚 Browse and enroll in courses
- ▶️ Watch recorded videos and attend live classes
- 📝 Take quizzes and track progress
- 📊 View performance analytics
- 🏆 Earn certificates upon course completion
- ⭐ Rate and review courses
- 🌐 Multi-language support (English, Hindi, Bengali, Tamil, Urdu)

### For Instructors
- 📖 Create and manage courses
- 📹 Upload videos and schedule live classes
- ✅ Create and manage quizzes
- 👥 Track student enrollments and progress
- 📈 View course analytics
- 💰 Track course sales and revenue

### For Admins
- 👤 Manage users and roles
- 📚 Oversee all courses
- 📋 Manage quizzes and assessments
- 📊 View platform analytics
- 💳 Track payments and transactions

## 🏗️ Project Structure

```
TECHNOTECH-E-LEARNING/
├── backend/                 # Node.js/Express API server
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API endpoints
│   ├── middleware/         # Authentication & utilities
│   ├── index.js           # Main server file
│   └── package.json       # Backend dependencies
│
├── frontend/              # React + TypeScript application
│   ├── src/
│   │   ├── pages/        # Page components
│   │   ├── components/   # Reusable components
│   │   ├── context/      # React context (Auth, Theme)
│   │   ├── config/       # API configuration
│   │   └── App.tsx       # Main component
│   ├── vite.config.ts    # Vite bundler config
│   └── package.json      # Frontend dependencies
│
└── README.md             # This file
```

## 🚀 Live Demo

- **Frontend**: (Your frontend deployment URL)
- **Backend API**: https://technotech-e-learning.onrender.com

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB instance
- npm or yarn package manager

## 🔧 Installation & Setup

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in backend directory with:
```env
PORT=5000
MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/dbname
JWT_SECRET=your_super_secret_jwt_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
FRONTEND_URL=http://localhost:3000
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password
```

4. Start the server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Environment configuration:
   - `.env` - Production settings (uses deployed backend)
   - `.env.local` - Development settings (uses localhost:5000)

4. Start development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Payment**: Stripe API
- **AI Features**: Translation API integration

### Frontend
- **Library**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Routing**: React Router v7
- **Icons**: Lucide React
- **State Management**: React Context API

## 📦 Key Dependencies

### Backend
- express
- mongoose
- jsonwebtoken
- stripe
- bcryptjs
- cors
- dotenv

### Frontend
- react
- react-router-dom
- axios
- tailwindcss
- typescript
- vite

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course details
- `POST /api/admin/courses` - Create course (Admin)
- `PUT /api/admin/courses/:id` - Update course (Admin)
- `DELETE /api/admin/courses/:id` - Delete course (Admin)

### Enrollments
- `GET /api/enroll` - Get user enrollments
- `POST /api/enroll` - Enroll in course
- `DELETE /api/enroll/:id` - Unenroll from course
- `PUT /api/enroll/:id/progress` - Update progress
- `GET /api/enroll/:id/certificate` - Download certificate

### Quizzes
- `GET /api/quiz` - Get all quizzes
- `GET /api/quiz/:id` - Get quiz details
- `POST /api/quiz` - Create quiz (Admin)
- `PUT /api/quiz/:id` - Update quiz (Admin)
- `DELETE /api/quiz/:id` - Delete quiz (Admin)
- `POST /api/quiz/:id/submit` - Submit quiz answers
- `GET /api/quiz/student` - Get student quizzes

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/courses` - Get all courses

### Other
- `POST /api/translate` - Translate content
- `POST /api/checkout` - Process payment

## 🌐 Environment Variables

### Frontend (.env / .env.local)
```
VITE_API_URL=https://technotech-e-learning.onrender.com  # Production
VITE_API_URL=http://localhost:5000                        # Development
```

### Backend (.env)
- `PORT` - Server port
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT signing
- `STRIPE_SECRET_KEY` - Stripe API secret key
- `FRONTEND_URL` - Frontend application URL
- `ADMIN_EMAIL` - Admin email
- `ADMIN_PASSWORD` - Admin password

## 📝 Database Models

### User
- name, email, password (hashed)
- role (student, instructor, admin)
- createdAt, updatedAt

### Course
- title, description, category
- instructor, price
- thumbnail, videos, liveClasses, recordedSessions
- ratings, enrolledStudents
- createdAt, updatedAt

### Enrollment
- userId, courseId
- progress, completionDate
- rating, feedback

### Quiz
- title, description, courseId
- questions (MCQ format)
- duration, passingScore
- createdAt, updatedAt

### QuizAttempt
- quizId, userId, score
- answers, attemptDate

## 🚀 Deployment

### Backend Deployment (Render)
1. Push code to GitHub
2. Connect repository to Render
3. Set environment variables in Render dashboard
4. Deploy

### Frontend Deployment (Vercel/Netlify)
1. Build: `npm run build`
2. Connect GitHub repository to Vercel/Netlify
3. Deploy automatically on push

## 📱 Running Locally

```bash
# Terminal 1 - Backend
cd backend
npm install
npm start

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000` in your browser.

## 🧪 Testing

### Run admin seeding (populate sample data)
```bash
cd backend
node seed.js
```

### Test admin login
```bash
cd backend
node test-admin.js
```

## 🔄 Development Workflow

1. Create a feature branch: `git checkout -b feature/feature-name`
2. Make changes and commit: `git commit -m "Add feature"`
3. Push to GitHub: `git push origin feature/feature-name`
4. Create a Pull Request
5. After merge, Render will auto-deploy the backend
6. Frontend will auto-deploy via Vercel/Netlify

## 🐛 Common Issues & Solutions

### MongoDB Connection Error
- Verify `MONGODB_URI` in `.env`
- Check MongoDB Atlas IP whitelist
- Ensure database name is correct

### CORS Errors
- Verify `FRONTEND_URL` in backend `.env`
- Check frontend API endpoint configuration

### JWT Authentication Fails
- Clear browser localStorage
- Verify JWT_SECRET matches between frontend and backend
- Check token expiration

### API Endpoints Return 404
- Verify backend is running on port 5000
- Check `VITE_API_URL` in frontend environment
- Restart backend server

## 📞 Support & Contact

For issues or questions:
- Create an issue on GitHub
- Email: admin@technotech-elearning.com

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 👥 Contributors

- Technotech Team

---

**Last Updated**: January 2026
**Version**: 1.0.0