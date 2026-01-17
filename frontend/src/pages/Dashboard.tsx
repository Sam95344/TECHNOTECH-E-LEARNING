import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS } from '../config/api';
import { Link } from 'react-router-dom';
import { BookOpen, Trophy, Clock, Star, TrendingUp, Award, FileQuestion } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface Enrollment {
  _id: string;
  course: { _id: string; title: string; description: string; category: string; level: string };
  progress: number;
  completedLessons: string[];
  certificate?: string;
}

interface Quiz {
  _id: string;
  title: string;
  description: string;
  course: { _id: string; title: string };
  duration: number;
  passingScore: number;
  isActive: boolean;
}

interface UserStats {
  totalCourses: number;
  completedCourses: number;
  totalHours: number;
  averageRating: number;
}

const Dashboard: React.FC = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalCourses: 0,
    completedCourses: 0,
    totalHours: 0,
    averageRating: 0
  });
  const [unenrollingCourse, setUnenrollingCourse] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchEnrollments();
      fetchQuizzes();
      fetchUserStats();
    }
  }, [user]);

  const fetchEnrollments = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(API_ENDPOINTS.ENROLL.LIST, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEnrollments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchQuizzes = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(API_ENDPOINTS.QUIZ.STUDENT, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuizzes(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  const handleUnenroll = async (enrollmentId: string) => {
    const enrollment = enrollments.find(e => e._id === enrollmentId);
    
    if (enrollment?.progress === 100) {
      const confirmUnenroll = window.confirm(
        '⚠️ Warning: You have completed this course and may have earned a certificate. Unenrolling will remove all your progress and certificate access. Are you sure you want to continue?'
      );
      if (!confirmUnenroll) return;
    } else {
      const confirmUnenroll = window.confirm(
        'Are you sure you want to unenroll from this course? You will lose all your progress and access to the course content.'
      );
      if (!confirmUnenroll) return;
    }

    setUnenrollingCourse(enrollmentId);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(API_ENDPOINTS.ENROLL.DELETE(enrollmentId), {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Successfully unenrolled from the course');
      fetchEnrollments(); // Refresh the enrollments list
      fetchUserStats(); // Refresh the stats
    } catch (err) {
      alert('Failed to unenroll. Please try again.');
    } finally {
      setUnenrollingCourse(null);
    }
  };
  const fetchUserStats = () => {
    // Calculate stats from enrollments
    const totalCourses = enrollments.length;
    const completedCourses = enrollments.filter(e => e.progress === 100).length;
    const totalHours = enrollments.reduce((acc, e) => acc + (e.progress / 100) * 10, 0); // Assuming 10 hours per course
    const averageRating = 4.5; // This would come from backend

    setStats({
      totalCourses,
      completedCourses,
      totalHours: Math.round(totalHours),
      averageRating
    });
  };

  useEffect(() => {
    fetchUserStats();
  }, [enrollments]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
          <div className="p-4 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-gray-700 dark:to-gray-600 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <BookOpen className="h-10 w-10 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Please Login</h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">Access your personalized learning dashboard</p>
          <Link to="/login" className="inline-flex items-center bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold text-lg">
            <BookOpen className="h-5 w-5 mr-2" />
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 rounded-3xl p-8 mb-10 text-white shadow-[0_24px_80px_rgba(15,23,42,0.9)] border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-emerald-100/80 mb-2">
                Welcome back
              </p>
              <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">
                My Learning Dashboard
              </h1>
              <p className="text-emerald-50/90 text-base md:text-lg max-w-xl">
                Track your progress, continue where you left off, and level up your skills.
              </p>
            </div>
            <div className="hidden md:block">
              <div className="h-20 w-20 rounded-3xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20">
                <BookOpen className="h-12 w-12 text-white/80" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-800 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-sky-500 to-sky-600 rounded-xl">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-400">Total Courses</p>
                <p className="text-3xl font-bold text-white">{stats.totalCourses}</p>
                <p className="text-xs text-green-600 font-medium">↗️ Keep learning!</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-800 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-400">Completed</p>
                <p className="text-3xl font-bold text-white">{stats.completedCourses}</p>
                <p className="text-xs text-green-600 font-medium">↗️ Great progress!</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-800 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-400">Learning Hours</p>
                <p className="text-3xl font-bold text-white">{stats.totalHours}h</p>
                <p className="text-xs text-green-600 font-medium">↗️ Time well spent!</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-800 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl">
                <Star className="h-8 w-8 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-400">Avg Rating</p>
                <p className="text-3xl font-bold text-white">{stats.averageRating.toFixed(1)}</p>
                <p className="text-xs text-green-600 font-medium">⭐ Excellent!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 p-6 mb-8">
          <div className="flex items-center mb-6">
            <TrendingUp className="h-6 w-6 text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-white">Recent Activity</h2>
          </div>
          <div className="space-y-4">
            {enrollments.slice(0, 3).map((enrollment) => (
              <div key={enrollment._id} className="flex items-center justify-between p-4 border border-slate-800 rounded-xl hover:bg-slate-800/60 transition-colors">
                <div className="flex items-center">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg mr-4">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{enrollment.course.title}</h3>
                    <p className="text-sm text-slate-300">{enrollment.course.category} • {enrollment.course.level}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="w-32 bg-slate-800 rounded-full h-3 mb-2">
                    <div
                      className="bg-gradient-to-r from-sky-500 to-emerald-400 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${enrollment.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm font-semibold text-slate-200">{enrollment.progress}% Complete</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enrolled Courses */}
        <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <BookOpen className="h-6 w-6 text-green-600 mr-3" />
              <h2 className="text-2xl font-bold text-white">My Courses</h2>
            </div>
            <Link to="/courses" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 font-medium hover:underline transition-colors">
              Browse More Courses →
            </Link>
          </div>

          {enrollments.length === 0 ? (
            <div className="text-center py-12">
              <div className="p-4 bg-gradient-to-r from-sky-500/20 to-emerald-500/20 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center border border-sky-500/40">
                <BookOpen className="h-10 w-10 text-sky-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No courses enrolled yet</h3>
              <p className="text-slate-300 mb-6">Start your learning journey by enrolling in a course</p>
              <Link to="/courses" className="inline-flex items-center bg-gradient-to-r from-sky-500 to-teal-500 text-white px-8 py-3 rounded-xl hover:from-sky-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold">
                <BookOpen className="h-5 w-5 mr-2" />
                Explore Courses
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enrollments.map((enrollment) => (
                <div key={enrollment._id} className="border border-slate-800 rounded-xl p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-slate-900 to-slate-800">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">{enrollment.course.title}</h3>
                      <p className="text-sm text-slate-300 mb-2">{enrollment.course.category} • {enrollment.course.level}</p>
                      <p className="text-sm text-slate-300/90">{enrollment.course.description}</p>
                    </div>
                    {enrollment.progress === 100 && (
                      <div className="p-2 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full">
                        <Award className="h-6 w-6 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-slate-300 mb-2">
                      <span>Progress</span>
                      <span className="font-semibold">{enrollment.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-sky-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${enrollment.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <Link
                      to={`/courses/${String(enrollment.course._id)}`}
                      className="text-sky-400 hover:text-sky-300 font-medium hover:underline transition-colors"
                    >
                      Continue Learning →
                    </Link>
                    <div className="flex space-x-3">
                      {enrollment.progress === 100 && enrollment.certificate && (
                        <a
                          href={API_ENDPOINTS.ENROLL.CERTIFICATE(enrollment._id)}
                          className="text-emerald-400 hover:text-emerald-300 font-medium hover:underline text-sm transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Certificate
                        </a>
                      )}
                      <button
                        onClick={() => handleUnenroll(enrollment._id)}
                        disabled={unenrollingCourse === enrollment._id}
                        className="text-rose-400 hover:text-rose-300 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:underline transition-colors"
                      >
                        {unenrollingCourse === enrollment._id ? 'Unenrolling...' : 'Unenroll'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Available Quizzes */}
        {quizzes.length > 0 && (
          <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 p-6 mt-8">
            <div className="flex items-center mb-6">
              <FileQuestion className="h-6 w-6 text-purple-600 mr-3" />
              <h2 className="text-2xl font-bold text-white">Available Quizzes</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quizzes.map((quiz) => (
                <div key={quiz._id} className="border border-slate-800 rounded-xl p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-slate-900 to-slate-800">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">{quiz.title}</h3>
                      <p className="text-sm text-slate-300 mb-2">Course: {quiz.course.title}</p>
                      <p className="text-sm text-slate-300/90">{quiz.description}</p>
                    </div>
                    <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                      <FileQuestion className="h-6 w-6 text-white" />
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-sm text-slate-300 mb-4">
                    <span>Duration: {quiz.duration} minutes</span>
                    <span>Passing Score: {quiz.passingScore}%</span>
                  </div>

                  <Link
                    to={`/quiz/${quiz._id}`}
                    className="inline-flex items-center bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-2 rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold text-sm"
                  >
                    <FileQuestion className="h-4 w-4 mr-2" />
                    Take Quiz
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements */}
        {stats.completedCourses > 0 && (
          <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 p-6 mt-8">
            <div className="flex items-center mb-6">
              <Trophy className="h-6 w-6 text-yellow-600 mr-3" />
              <h2 className="text-2xl font-bold text-white">Achievements</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.completedCourses >= 1 && (
                <div className="text-center p-6 border border-green-200 dark:border-green-700 rounded-xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Trophy className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">First Course Completed</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">You've completed your first course!</p>
                </div>
              )}
              {stats.completedCourses >= 3 && (
                <div className="text-center p-6 border border-blue-200 dark:border-blue-700 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">Dedicated Learner</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Completed 3 courses!</p>
                </div>
              )}
              {stats.completedCourses >= 5 && (
                <div className="text-center p-6 border border-purple-200 dark:border-purple-700 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Award className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">Expert Student</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Completed 5 courses!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Browse More Courses */}
        <div className="mt-12 bg-gradient-to-r from-sky-500 via-teal-500 to-emerald-500 rounded-3xl p-8 text-center text-white shadow-[0_24px_80px_rgba(15,23,42,0.9)]">
          <div className="p-4 bg-white/10 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center border border-white/30">
            <BookOpen className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Ready for More Learning?</h2>
          <p className="text-emerald-50 text-lg mb-8">Explore our wide range of courses and continue your learning journey</p>
          <Link
            to="/courses"
            className="inline-flex items-center bg-white text-sky-600 px-8 py-4 rounded-xl hover:bg-slate-100 transition-all duration-300 transform hover:scale-105 shadow-lg font-bold text-lg"
          >
            <BookOpen className="h-6 w-6 mr-3" />
            Browse All Courses
          </Link>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Dashboard;