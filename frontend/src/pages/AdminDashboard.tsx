import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS } from '../config/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Users, BookOpen, TrendingUp, DollarSign, Shield } from 'lucide-react';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface Course {
  _id: string;
  title: string;
  instructor: { name: string };
  price: number;
  averageRating: number;
  enrolledStudents: string[];
  description?: string;
  category?: string;
  level?: string;
  duration?: string;
  thumbnail?: string;
}

interface Stats {
  totalUsers: number;
  totalCourses: number;
  totalRevenue: number;
  activeEnrollments: number;
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalCourses: 0,
    totalRevenue: 0,
    activeEnrollments: 0
  });
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    category: '',
    level: 'Beginner',
    duration: '',
    price: 0,
    thumbnail: '',
    videos: [{ title: '', url: '', duration: '', type: 'recorded' }],
    liveClasses: [{ title: '', description: '', scheduledDate: '', duration: '', meetingLink: '' }],
    recordedSessions: [{ title: '', url: '', duration: '' }]
  });
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'courses' | 'quizzes'>('overview');
  const [contentTab, setContentTab] = useState<'basic' | 'videos' | 'live' | 'recorded'>('basic');
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [quizForm, setQuizForm] = useState({
    title: '',
    description: '',
    course: '',
    duration: 30,
    passingScore: 70,
    questions: [{
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: ''
    }]
  });
  const [editingQuizId, setEditingQuizId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAdminData();
    }
  }, [user]);

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [usersRes, coursesRes, quizzesRes] = await Promise.all([
        axios.get(API_ENDPOINTS.ADMIN.USERS, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(API_ENDPOINTS.ADMIN.COURSES, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(API_ENDPOINTS.QUIZ.LIST, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setUsers(usersRes.data);
      setCourses(coursesRes.data);
      setQuizzes(quizzesRes.data);

      // Calculate stats
      const totalUsers = usersRes.data.length;
      const totalCourses = coursesRes.data.length;
      const totalRevenue = coursesRes.data.reduce((sum: number, course: Course) =>
        sum + (course.price * (course.enrolledStudents?.length || 0)), 0
      );
      const activeEnrollments = coursesRes.data.reduce((sum: number, course: Course) =>
        sum + (course.enrolledStudents?.length || 0), 0
      );

      setStats({ totalUsers, totalCourses, totalRevenue, activeEnrollments });
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
      setLoading(false);
    }
  };

  const handleCourseInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target as HTMLInputElement;
    setCourseForm(prev => ({ ...prev, [name]: name === 'price' ? Number(value) : value }));
  };

  const addVideo = () => {
    setCourseForm(prev => ({
      ...prev,
      videos: [...prev.videos, { title: '', url: '', duration: '', type: 'recorded' }]
    }));
  };

  const removeVideo = (index: number) => {
    setCourseForm(prev => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== index)
    }));
  };

  const updateVideo = (index: number, field: string, value: string) => {
    setCourseForm(prev => ({
      ...prev,
      videos: prev.videos.map((video, i) => i === index ? { ...video, [field]: value } : video)
    }));
  };

  const addLiveClass = () => {
    setCourseForm(prev => ({
      ...prev,
      liveClasses: [...prev.liveClasses, { title: '', description: '', scheduledDate: '', duration: '', meetingLink: '' }]
    }));
  };

  const removeLiveClass = (index: number) => {
    setCourseForm(prev => ({
      ...prev,
      liveClasses: prev.liveClasses.filter((_, i) => i !== index)
    }));
  };

  const updateLiveClass = (index: number, field: string, value: string) => {
    setCourseForm(prev => ({
      ...prev,
      liveClasses: prev.liveClasses.map((liveClass, i) => i === index ? { ...liveClass, [field]: value } : liveClass)
    }));
  };

  const addRecordedSession = () => {
    setCourseForm(prev => ({
      ...prev,
      recordedSessions: [...prev.recordedSessions, { title: '', url: '', duration: '' }]
    }));
  };

  const removeRecordedSession = (index: number) => {
    setCourseForm(prev => ({
      ...prev,
      recordedSessions: prev.recordedSessions.filter((_, i) => i !== index)
    }));
  };

  const updateRecordedSession = (index: number, field: string, value: string) => {
    setCourseForm(prev => ({
      ...prev,
      recordedSessions: prev.recordedSessions.map((session, i) => i === index ? { ...session, [field]: value } : session)
    }));
  };

  const createCourse = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(API_ENDPOINTS.ADMIN.COURSES, courseForm, { headers: { Authorization: `Bearer ${token}` } });
      setCourseForm({ title: '', description: '', category: '', level: 'Beginner', duration: '', price: 0, thumbnail: '', videos: [{ title: '', url: '', duration: '', type: 'recorded' }], liveClasses: [{ title: '', description: '', scheduledDate: '', duration: '', meetingLink: '' }], recordedSessions: [{ title: '', url: '', duration: '' }] });
      fetchAdminData();
      setActiveTab('courses');
    } catch (err) {
      console.error('Failed to create course:', err);
    }
  };

  const startEditCourse = (course: Course) => {
    setEditingCourseId(course._id);
    setCourseForm({ 
      title: course.title, 
      description: (course as any).description || '', 
      category: (course as any).category || '', 
      level: (course as any).level || 'Beginner', 
      duration: (course as any).duration || '', 
      price: (course as any).price || 0, 
      thumbnail: (course as any).thumbnail || '',
      videos: (course as any).videos || [{ title: '', url: '', duration: '', type: 'recorded' }],
      liveClasses: (course as any).liveClasses || [{ title: '', description: '', scheduledDate: '', duration: '', meetingLink: '' }],
      recordedSessions: (course as any).recordedSessions || [{ title: '', url: '', duration: '' }]
    });
    setActiveTab('courses');
    setContentTab('basic');
  };

  const updateCourse = async () => {
    if (!editingCourseId) return;
    try {
      const token = localStorage.getItem('token');
      await axios.put(API_ENDPOINTS.ADMIN.COURSE_UPDATE(editingCourseId), courseForm, { headers: { Authorization: `Bearer ${token}` } });
      setEditingCourseId(null);
      setCourseForm({ title: '', description: '', category: '', level: 'Beginner', duration: '', price: 0, thumbnail: '', videos: [{ title: '', url: '', duration: '', type: 'recorded' }], liveClasses: [{ title: '', description: '', scheduledDate: '', duration: '', meetingLink: '' }], recordedSessions: [{ title: '', url: '', duration: '' }] });
      fetchAdminData();
    } catch (err) {
      console.error('Failed to update course:', err);
    }
  };

  const deleteCourse = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(API_ENDPOINTS.ADMIN.COURSE_DELETE(id), { headers: { Authorization: `Bearer ${token}` } });
      fetchAdminData();
    } catch (err) {
      console.error('Failed to delete course:', err);
    }
  };

  // Quiz management functions
  const handleQuizInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setQuizForm(prev => ({ ...prev, [name]: name === 'duration' || name === 'passingScore' ? Number(value) : value }));
  };

  const addQuestion = () => {
    setQuizForm(prev => ({
      ...prev,
      questions: [...prev.questions, {
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: ''
      }]
    }));
  };

  const removeQuestion = (index: number) => {
    setQuizForm(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    setQuizForm(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => i === index ? { ...q, [field]: value } : q)
    }));
  };

  const updateQuestionOption = (questionIndex: number, optionIndex: number, value: string) => {
    setQuizForm(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) =>
        i === questionIndex
          ? { ...q, options: q.options.map((opt, j) => j === optionIndex ? value : opt) }
          : q
      )
    }));
  };

  const createQuiz = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(API_ENDPOINTS.QUIZ.CREATE, quizForm, { headers: { Authorization: `Bearer ${token}` } });
      setQuizForm({
        title: '',
        description: '',
        course: '',
        duration: 30,
        passingScore: 70,
        questions: [{
          question: '',
          options: ['', '', '', ''],
          correctAnswer: 0,
          explanation: ''
        }]
      });
      fetchAdminData();
      setActiveTab('quizzes');
    } catch (err) {
      console.error('Failed to create quiz:', err);
    }
  };

  const startEditQuiz = (quiz: any) => {
    setEditingQuizId(quiz._id);
    setQuizForm({
      title: quiz.title,
      description: quiz.description || '',
      course: quiz.course._id,
      duration: quiz.duration,
      passingScore: quiz.passingScore,
      questions: quiz.questions
    });
    setActiveTab('quizzes');
  };

  const updateQuiz = async () => {
    if (!editingQuizId) return;
    try {
      const token = localStorage.getItem('token');
      await axios.put(API_ENDPOINTS.QUIZ.UPDATE(editingQuizId), quizForm, { headers: { Authorization: `Bearer ${token}` } });
      setEditingQuizId(null);
      setQuizForm({
        title: '',
        description: '',
        course: '',
        duration: 30,
        passingScore: 70,
        questions: [{
          question: '',
          options: ['', '', '', ''],
          correctAnswer: 0,
          explanation: ''
        }]
      });
      fetchAdminData();
    } catch (err) {
      console.error('Failed to update quiz:', err);
    }
  };

  const deleteQuiz = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(API_ENDPOINTS.QUIZ.DELETE(id), { headers: { Authorization: `Bearer ${token}` } });
      fetchAdminData();
    } catch (err) {
      console.error('Failed to delete quiz:', err);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
          <Shield className="h-20 w-20 text-red-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Access Denied</h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg">You don't have permission to access this page.</p>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Please contact an administrator if you believe this is an error.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Loading Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-300">Please wait while we fetch your data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 rounded-3xl p-8 mb-10 text-white shadow-[0_24px_80px_rgba(15,23,42,0.9)] border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-sky-100/80 mb-2">
                Admin Control Center
              </p>
              <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">
                Admin Dashboard
              </h1>
              <p className="text-sky-50/90 text-base md:text-lg max-w-xl">
                Monitor growth, manage courses, and keep TECHNOTECH E‑LEARNING running smoothly.
              </p>
            </div>
            <div className="hidden md:block">
              <div className="h-20 w-20 rounded-3xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20">
                <Shield className="h-12 w-12 text-white/80" />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-slate-900/80 p-2 rounded-2xl shadow-xl border border-slate-800 backdrop-blur">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-3 px-6 rounded-lg text-sm font-semibold transition-all duration-300 ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            📊 Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 py-3 px-6 rounded-lg text-sm font-semibold transition-all duration-300 ${
              activeTab === 'users'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            👥 Users ({stats.totalUsers})
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`flex-1 py-3 px-6 rounded-lg text-sm font-semibold transition-all duration-300 ${
              activeTab === 'courses'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            📚 Courses ({stats.totalCourses})
          </button>
          <button
            onClick={() => setActiveTab('quizzes')}
            className={`flex-1 py-3 px-6 rounded-lg text-sm font-semibold transition-all duration-300 ${
              activeTab === 'quizzes'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            📝 Quizzes ({quizzes.length})
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-800 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-400">Total Users</p>
                  <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
                  <p className="text-xs text-green-600 font-medium">↗️ +12% this month</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-800 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-400">Total Courses</p>
                  <p className="text-3xl font-bold text-white">{stats.totalCourses}</p>
                  <p className="text-xs text-green-600 font-medium">↗️ +8% this month</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-800 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl">
                  <DollarSign className="h-8 w-8 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-400">Total Revenue</p>
                  <p className="text-3xl font-bold text-white">${stats.totalRevenue}</p>
                  <p className="text-xs text-green-600 font-medium">↗️ +15% this month</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-800 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-400">Active Enrollments</p>
                  <p className="text-3xl font-bold text-white">{stats.activeEnrollments}</p>
                  <p className="text-xs text-green-600 font-medium">↗️ +20% this month</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700">
              <div className="flex items-center">
                <Users className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">All Users</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mt-1">Manage and monitor user accounts</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">👤 Name</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">📧 Email</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">🏷️ Role</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">📅 Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${
                          user.role === 'admin'
                            ? 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                            : user.role === 'instructor'
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                            : 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-700">
              <div className="flex items-center">
                <BookOpen className="h-6 w-6 text-green-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">All Courses</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mt-1">Create and manage course content</p>
            </div>
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-gray-600">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg mr-3">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {editingCourseId ? '✏️ Edit Course' : '➕ Add New Course'}
                </h3>
              </div>
              
              {/* Content Type Tabs */}
              <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
                <button
                  onClick={() => setContentTab('basic')}
                  className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    contentTab === 'basic'
                      ? 'bg-white dark:bg-gray-600 text-blue-600 shadow-lg transform scale-105'
                      : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  📋 Basic Info
                </button>
                <button
                  onClick={() => setContentTab('videos')}
                  className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    contentTab === 'videos'
                      ? 'bg-white dark:bg-gray-600 text-blue-600 shadow-lg transform scale-105'
                      : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  🎥 Videos ({courseForm.videos.length})
                </button>
                <button
                  onClick={() => setContentTab('live')}
                  className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    contentTab === 'live'
                      ? 'bg-white dark:bg-gray-600 text-blue-600 shadow-lg transform scale-105'
                      : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  📹 Live Classes ({courseForm.liveClasses.length})
                </button>
                <button
                  onClick={() => setContentTab('recorded')}
                  className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    contentTab === 'recorded'
                      ? 'bg-white dark:bg-gray-600 text-blue-600 shadow-lg transform scale-105'
                      : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  📼 Recorded ({courseForm.recordedSessions.length})
                </button>
              </div>

              {/* Basic Info Tab */}
              {contentTab === 'basic' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Course Title</label>
                    <input name="title" value={courseForm.title} onChange={handleCourseInput} placeholder="Enter course title" className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Category</label>
                    <input name="category" value={courseForm.category} onChange={handleCourseInput} placeholder="e.g., Programming, Design" className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Duration</label>
                    <input name="duration" value={courseForm.duration} onChange={handleCourseInput} placeholder="e.g., 8 weeks" className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Level</label>
                    <select name="level" value={courseForm.level} onChange={handleCourseInput} className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Price ($)</label>
                    <input name="price" type="number" value={courseForm.price} onChange={handleCourseInput} placeholder="0" className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Thumbnail URL</label>
                    <input name="thumbnail" value={courseForm.thumbnail} onChange={handleCourseInput} placeholder="Image URL" className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Description</label>
                    <textarea name="description" value={courseForm.description} onChange={handleCourseInput} placeholder="Course description" className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" rows={4} />
                  </div>
                </div>
              )}

              {/* Videos Tab */}
              {contentTab === 'videos' && (
                <div className="space-y-4 mb-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-md font-medium text-[var(--text-primary)]">Video Lessons</h4>
                    <button onClick={addVideo} className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">+ Add Video</button>
                  </div>
                  {courseForm.videos.map((video, index) => (
                    <div key={index} className="border border-[var(--border-color)] rounded p-3 bg-[var(--bg-tertiary)]">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
                        <input 
                          value={video.title} 
                          onChange={(e) => updateVideo(index, 'title', e.target.value)} 
                          placeholder="Video Title" 
                          className="p-2 border border-[var(--border-color)] bg-[var(--input-bg)] rounded text-[var(--text-primary)]" 
                        />
                        <input 
                          value={video.url} 
                          onChange={(e) => updateVideo(index, 'url', e.target.value)} 
                          placeholder="Video URL" 
                          className="p-2 border border-[var(--border-color)] bg-[var(--input-bg)] rounded text-[var(--text-primary)]" 
                        />
                        <input 
                          value={video.duration} 
                          onChange={(e) => updateVideo(index, 'duration', e.target.value)} 
                          placeholder="Duration (e.g., 15 min)" 
                          className="p-2 border border-[var(--border-color)] bg-[var(--input-bg)] rounded text-[var(--text-primary)]" 
                        />
                        <select 
                          value={video.type} 
                          onChange={(e) => updateVideo(index, 'type', e.target.value)} 
                          className="p-2 border border-[var(--border-color)] bg-[var(--input-bg)] rounded text-[var(--text-primary)]"
                        >
                          <option value="recorded">Recorded</option>
                          <option value="live">Live</option>
                        </select>
                      </div>
                      <button onClick={() => removeVideo(index)} className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700">Remove</button>
                    </div>
                  ))}
                </div>
              )}

              {/* Live Classes Tab */}
              {contentTab === 'live' && (
                <div className="space-y-4 mb-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-md font-medium text-[var(--text-primary)]">Live Classes</h4>
                    <button onClick={addLiveClass} className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">+ Add Live Class</button>
                  </div>
                  {courseForm.liveClasses.map((liveClass, index) => (
                    <div key={index} className="border border-[var(--border-color)] rounded p-3 bg-[var(--bg-tertiary)]">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                        <input 
                          value={liveClass.title} 
                          onChange={(e) => updateLiveClass(index, 'title', e.target.value)} 
                          placeholder="Class Title" 
                          className="p-2 border border-[var(--border-color)] bg-[var(--input-bg)] rounded text-[var(--text-primary)]" 
                        />
                        <input 
                          value={liveClass.scheduledDate} 
                          onChange={(e) => updateLiveClass(index, 'scheduledDate', e.target.value)} 
                          type="datetime-local"
                          placeholder="Schedule Date & Time" 
                          className="p-2 border border-[var(--border-color)] bg-[var(--input-bg)] rounded text-[var(--text-primary)]" 
                        />
                        <input 
                          value={liveClass.duration} 
                          onChange={(e) => updateLiveClass(index, 'duration', e.target.value)} 
                          placeholder="Duration (e.g., 60 min)" 
                          className="p-2 border border-[var(--border-color)] bg-[var(--input-bg)] rounded text-[var(--text-primary)]" 
                        />
                        <input 
                          value={liveClass.meetingLink} 
                          onChange={(e) => updateLiveClass(index, 'meetingLink', e.target.value)} 
                          placeholder="Meeting Link (Zoom/Google Meet)" 
                          className="p-2 border border-[var(--border-color)] bg-[var(--input-bg)] rounded text-[var(--text-primary)]" 
                        />
                      </div>
                      <textarea 
                        value={liveClass.description} 
                        onChange={(e) => updateLiveClass(index, 'description', e.target.value)} 
                        placeholder="Class Description" 
                        className="w-full p-2 border border-[var(--border-color)] bg-[var(--input-bg)] rounded text-[var(--text-primary)] mb-2" 
                        rows={2}
                      />
                      <button onClick={() => removeLiveClass(index)} className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700">Remove</button>
                    </div>
                  ))}
                </div>
              )}

              {/* Recorded Sessions Tab */}
              {contentTab === 'recorded' && (
                <div className="space-y-4 mb-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-md font-medium text-[var(--text-primary)]">Recorded Sessions</h4>
                    <button onClick={addRecordedSession} className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">+ Add Recording</button>
                  </div>
                  {courseForm.recordedSessions.map((session, index) => (
                    <div key={index} className="border border-[var(--border-color)] rounded p-3 bg-[var(--bg-tertiary)]">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                        <input 
                          value={session.title} 
                          onChange={(e) => updateRecordedSession(index, 'title', e.target.value)} 
                          placeholder="Session Title" 
                          className="p-2 border border-[var(--border-color)] bg-[var(--input-bg)] rounded text-[var(--text-primary)]" 
                        />
                        <input 
                          value={session.url} 
                          onChange={(e) => updateRecordedSession(index, 'url', e.target.value)} 
                          placeholder="Recording URL" 
                          className="p-2 border border-[var(--border-color)] bg-[var(--input-bg)] rounded text-[var(--text-primary)]" 
                        />
                        <input 
                          value={session.duration} 
                          onChange={(e) => updateRecordedSession(index, 'duration', e.target.value)} 
                          placeholder="Duration (e.g., 45 min)" 
                          className="p-2 border border-[var(--border-color)] bg-[var(--input-bg)] rounded text-[var(--text-primary)]" 
                        />
                      </div>
                      <button onClick={() => removeRecordedSession(index)} className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700">Remove</button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex space-x-3">
                {editingCourseId ? (
                  <>
                    <button onClick={updateCourse} className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold">
                      ✅ Update Course
                    </button>
                    <button onClick={() => { setEditingCourseId(null); setCourseForm({ title: '', description: '', category: '', level: 'Beginner', duration: '', price: 0, thumbnail: '', videos: [{ title: '', url: '', duration: '', type: 'recorded' }], liveClasses: [{ title: '', description: '', scheduledDate: '', duration: '', meetingLink: '' }], recordedSessions: [{ title: '', url: '', duration: '' }] }); setContentTab('basic'); }} className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold">
                      ❌ Cancel
                    </button>
                  </>
                ) : (
                  <button onClick={createCourse} className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold">
                    ➕ Create Course
                  </button>
                )}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">📚 Title</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">👨‍🏫 Instructor</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">💰 Price</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">⭐ Rating</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">👥 Enrollments</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">⚙️ Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {courses.map((course) => (
                    <tr key={course._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{course.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{course.instructor.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600 dark:text-green-400">${course.price}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        ⭐ {course.averageRating.toFixed(1)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600 dark:text-blue-400">
                        {course.enrolledStudents?.length || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <button onClick={() => startEditCourse(course)} className="px-3 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 font-semibold text-xs">
                            ✏️ Edit
                          </button>
                          <button onClick={() => deleteCourse(course._id)} className="px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 font-semibold text-xs">
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quizzes Tab */}
        {activeTab === 'quizzes' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700">
              <div className="flex items-center">
                <BookOpen className="h-6 w-6 text-purple-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">All Quizzes</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mt-1">Create and manage quiz assessments</p>
            </div>
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-purple-50 dark:from-gray-700 dark:to-gray-600">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mr-3">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {editingQuizId ? '✏️ Edit Quiz' : '➕ Create New Quiz'}
                </h3>
              </div>

              {/* Quiz Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Quiz Title</label>
                  <input
                    name="title"
                    value={quizForm.title}
                    onChange={handleQuizInput}
                    placeholder="Enter quiz title"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Course</label>
                  <select
                    name="course"
                    value={quizForm.course}
                    onChange={handleQuizInput}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select Course</option>
                    {courses.map(course => (
                      <option key={course._id} value={course._id}>{course.title}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Duration (minutes)</label>
                  <input
                    name="duration"
                    type="number"
                    value={quizForm.duration}
                    onChange={handleQuizInput}
                    placeholder="30"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Passing Score (%)</label>
                  <input
                    name="passingScore"
                    type="number"
                    value={quizForm.passingScore}
                    onChange={handleQuizInput}
                    placeholder="70"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Description</label>
                  <textarea
                    name="description"
                    value={quizForm.description}
                    onChange={handleQuizInput}
                    placeholder="Quiz description"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    rows={3}
                  />
                </div>
              </div>

              {/* Questions Section */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Questions ({quizForm.questions.length})</h4>
                  <button
                    onClick={addQuestion}
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 font-semibold"
                  >
                    + Add Question
                  </button>
                </div>

                {quizForm.questions.map((question, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-xl p-4 mb-4 bg-gray-50 dark:bg-gray-700">
                    <div className="flex justify-between items-start mb-3">
                      <h5 className="font-semibold text-gray-900 dark:text-white">Question {index + 1}</h5>
                      <button
                        onClick={() => removeQuestion(index)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 font-semibold"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="space-y-3">
                      <input
                        value={question.question}
                        onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                        placeholder="Enter question"
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 rounded text-gray-900 dark:text-white"
                      />

                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name={`correct-${index}`}
                            checked={question.correctAnswer === optionIndex}
                            onChange={() => updateQuestion(index, 'correctAnswer', optionIndex)}
                            className="text-purple-600"
                          />
                          <input
                            value={option}
                            onChange={(e) => updateQuestionOption(index, optionIndex, e.target.value)}
                            placeholder={`Option ${optionIndex + 1}`}
                            className="flex-1 p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 rounded text-gray-900 dark:text-white"
                          />
                        </div>
                      ))}

                      <input
                        value={question.explanation}
                        onChange={(e) => updateQuestion(index, 'explanation', e.target.value)}
                        placeholder="Explanation (optional)"
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 rounded text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex space-x-3">
                {editingQuizId ? (
                  <>
                    <button
                      onClick={updateQuiz}
                      className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
                    >
                      ✅ Update Quiz
                    </button>
                    <button
                      onClick={() => {
                        setEditingQuizId(null);
                        setQuizForm({
                          title: '',
                          description: '',
                          course: '',
                          duration: 30,
                          passingScore: 70,
                          questions: [{
                            question: '',
                            options: ['', '', '', ''],
                            correctAnswer: 0,
                            explanation: ''
                          }]
                        });
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
                    >
                      ❌ Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={createQuiz}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
                  >
                    ➕ Create Quiz
                  </button>
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">📝 Title</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">📚 Course</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">⏱️ Duration</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">📊 Passing Score</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">⚙️ Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {quizzes.map((quiz) => (
                    <tr key={quiz._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{quiz.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{quiz.course?.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{quiz.duration} min</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{quiz.passingScore}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => startEditQuiz(quiz)}
                            className="px-3 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 font-semibold text-xs"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => deleteQuiz(quiz._id)}
                            className="px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 font-semibold text-xs"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;