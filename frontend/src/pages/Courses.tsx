import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Search, Filter, SortAsc, Grid, List, BookOpen, Clock, Users, Star, ShoppingCart, CheckCircle } from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration: string;
  price: number;
  instructor: { name: string };
  averageRating: number;
  ratings?: { rating: number }[];
  enrolledStudents?: number;
  enrolledStudentsCount?: number;
}

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);
  const [enrollingCourse, setEnrollingCourse] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    filterAndSortCourses();
  }, [courses, category, level, priceRange, sortBy, searchTerm]);

  useEffect(() => {
    if (user) {
      fetchEnrolledCourses();
    }
  }, [user]);

  const fetchCourses = async () => {
    try {
      const res = await axios.get(API_ENDPOINTS.COURSES.LIST);
      setCourses(res.data);
      setFilteredCourses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrolledCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(API_ENDPOINTS.ENROLL.LIST, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const enrolledIds = res.data.map((enrollment: any) => enrollment.course._id);
      setEnrolledCourses(enrolledIds);
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuickEnroll = async (courseId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first');
      return;
    }

    setEnrollingCourse(courseId);
    try {
      await axios.post(API_ENDPOINTS.ENROLL.CREATE, { courseId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEnrolledCourses(prev => [...prev, courseId]);
      // Show success message
      alert('🎉 Successfully enrolled in the course!');
    } catch (err: any) {
      if (err.response?.status === 400) {
        alert('You are already enrolled in this course');
      } else {
        alert('Enrollment failed. Please try again.');
      }
    } finally {
      setEnrollingCourse(null);
    }
  };

  const handleViewDetails = (course: Course) => {
    setSelectedCourse(course);
    setShowDetailsModal(true);
  };

  const filterAndSortCourses = () => {
    let filtered = [...courses];

    // Apply filters
    if (category) {
      filtered = filtered.filter(course => course.category === category);
    }

    if (level) {
      filtered = filtered.filter(course => course.level === level);
    }

    if (priceRange) {
      switch (priceRange) {
        case 'free':
          filtered = filtered.filter(course => course.price === 0);
          break;
        case 'under50':
          filtered = filtered.filter(course => course.price < 50);
          break;
        case '50to100':
          filtered = filtered.filter(course => course.price >= 50 && course.price <= 100);
          break;
        case 'over100':
          filtered = filtered.filter(course => course.price > 100);
          break;
      }
    }

    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.averageRating - a.averageRating);
        break;
      case 'newest':
        // Assuming courses have createdAt, for now just reverse the array
        filtered.reverse();
        break;
      case 'popular':
      default:
        // Sort by rating and enrollment
        filtered.sort((a, b) => (b.averageRating * (b.enrolledStudents || 1)) - (a.averageRating * (a.enrolledStudents || 1)));
        break;
    }

    setFilteredCourses(filtered);
  };

  const clearFilters = () => {
    setCategory('');
    setLevel('');
    setPriceRange('');
    setSearchTerm('');
    setSortBy('popular');
  };

  const categories = ['Technology', 'Business', 'Design', 'Programming', 'AI', 'Marketing', 'Data Science', 'Photography'];
  const levels = ['Beginner', 'Intermediate', 'Advanced'];
  const priceRanges = [
    { value: 'free', label: 'Free' },
    { value: 'under50', label: 'Under $50' },
    { value: '50to100', label: '$50 - $100' },
    { value: 'over100', label: 'Over $100' }
  ];
  const sortOptions = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/20 mb-4">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Explore Our Courses</h1>
          <p className="text-xl text-slate-400">Discover the perfect course to advance your career</p>
        </div>

        {/* Search Bar */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl shadow-black/20 mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search courses, instructors, or topics..."
              className="w-full pl-12 pr-4 py-4 border border-slate-700 bg-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg text-white placeholder-slate-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl shadow-black/20 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-slate-400" />
                <span className="text-slate-300 font-medium">Filters:</span>
              </div>

              <select
                className="px-4 py-2 border border-slate-700 bg-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <select
                className="px-4 py-2 border border-slate-700 bg-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              >
                <option value="">All Levels</option>
                {levels.map(lvl => (
                  <option key={lvl} value={lvl}>{lvl}</option>
                ))}
              </select>

              <select
                className="px-4 py-2 border border-slate-700 bg-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
              >
                <option value="">All Prices</option>
                {priceRanges.map(range => (
                  <option key={range.value} value={range.value}>{range.label}</option>
                ))}
              </select>

              {(category || level || priceRange || searchTerm) && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>

            {/* Sort and View Controls */}
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <SortAsc className="h-4 w-4 text-slate-400" />
                <select
                  className="px-3 py-2 border border-slate-700 bg-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center border border-slate-700 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-slate-400">
            Showing <span className="font-semibold text-white">{filteredCourses.length}</span> of{' '}
            <span className="font-semibold text-white">{courses.length}</span> courses
          </p>
        </div>

          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-6'}>
            {filteredCourses.map((course) => (
              <div key={course._id} className={`group relative rounded-2xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl shadow-xl ${viewMode === 'list' ? 'flex bg-slate-900 border border-slate-800' : 'bg-slate-900 border border-slate-800'} hover:border-blue-500/50 hover:shadow-blue-500/10`}> 
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Accent stripe */}
                <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500" />

                <div className={`relative p-6 flex-1 ${viewMode === 'list' ? 'flex' : ''} z-10`}>
                  {viewMode === 'list' && (
                    <div className="w-48 h-32 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl mr-6 flex-shrink-0 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-blue-500/20">
                      {course.title.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-semibold rounded-full border border-blue-500/30">
                          {course.category}
                        </span>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${
                          course.level === 'Beginner' 
                            ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                            : course.level === 'Intermediate' 
                            ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' 
                            : 'bg-red-500/20 text-red-300 border-red-500/30'
                        }`}>
                          {course.level}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 bg-slate-800/80 backdrop-blur-sm px-3 py-2 rounded-full border border-slate-700">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-bold text-white">{course.averageRating.toFixed(1)}</span>
                      </div>
                    </div>

                    <h3 className={`font-bold text-white mb-3 ${viewMode === 'list' ? 'text-2xl' : 'text-xl'} group-hover:text-blue-400 transition-colors duration-200`}>
                      {course.title}
                    </h3>

                    <p className={`text-slate-400 mb-4 leading-relaxed ${viewMode === 'list' ? 'line-clamp-2 text-base' : 'line-clamp-3 text-sm'}`}>
                      {course.description}
                    </p>

                    <div className="flex items-center text-sm text-slate-400 mb-4 space-x-4">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1 text-blue-400" />
                        <span className="font-medium">{course.instructor.name}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-green-400" />
                        <span>{course.duration}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-3xl font-bold text-blue-400">${course.price}</span>
                        {course.price === 0 && (
                          <span className="px-3 py-1 bg-green-500/20 text-green-300 text-xs font-bold rounded-full border border-green-500/30">
                            FREE
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-3">
                        {enrolledCourses.includes(course._id) ? (
                          <div className="flex items-center bg-green-500/20 text-green-300 px-4 py-2 rounded-xl text-sm font-semibold border border-green-500/30">
                            <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                            Enrolled
                          </div>
                        ) : user ? (
                          <button 
                            onClick={() => handleQuickEnroll(course._id)} 
                            disabled={enrollingCourse === course._id} 
                            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2 rounded-xl hover:shadow-lg hover:shadow-green-500/20 transition-all duration-200 flex items-center text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                          >
                            {enrollingCourse === course._id ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                Enrolling...
                              </>
                            ) : (
                              <>
                                <ShoppingCart className="h-4 w-4 mr-2" />
                                Enroll
                              </>
                            )}
                          </button>
                        ) : null}

                        <button 
                          onClick={() => handleViewDetails(course)}
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-200 text-sm font-semibold transform hover:scale-105"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        {/* Load More or Pagination could go here */}
        {filteredCourses.length > 0 && (
          <div className="text-center mt-12">
            <p className="text-slate-400">
              Showing all {filteredCourses.length} courses
            </p>
          </div>
        )}
      </main>

      {/* Course Details Modal */}
      {showDetailsModal && selectedCourse && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-black/50">
            <div className="relative">
              {/* Header with gradient */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <h2 className="text-2xl font-bold mb-2">{selectedCourse.title}</h2>
                <div className="flex items-center space-x-4 text-sm text-blue-100">
                  <span>By {selectedCourse.instructor.name}</span>
                  <span>•</span>
                  <span>{selectedCourse.duration}</span>
                  <span>•</span>
                  <span>{selectedCourse.level}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 bg-slate-900">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Course Description</h3>
                  <p className="text-slate-400 leading-relaxed text-base">
                    {selectedCourse.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-500/20 border border-blue-500/30 p-4 rounded-xl">
                    <div className="flex items-center mb-2">
                      <BookOpen className="h-5 w-5 text-blue-400 mr-2" />
                      <span className="font-semibold text-blue-300">Category</span>
                    </div>
                    <p className="text-blue-400">{selectedCourse.category}</p>
                  </div>
                  <div className="bg-green-500/20 border border-green-500/30 p-4 rounded-xl">
                    <div className="flex items-center mb-2">
                      <Clock className="h-5 w-5 text-green-400 mr-2" />
                      <span className="font-semibold text-green-300">Duration</span>
                    </div>
                    <p className="text-green-400">{selectedCourse.duration}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center bg-yellow-500/20 border border-yellow-500/30 px-3 py-2 rounded-lg">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      <span className="font-semibold text-yellow-300">{selectedCourse.averageRating.toFixed(1)}</span>
                    </div>
                    <span className="text-2xl font-bold text-blue-400">${selectedCourse.price}</span>
                    {selectedCourse.price === 0 && (
                      <span className="px-3 py-1 bg-green-500/20 text-green-300 text-sm font-bold rounded-full border border-green-500/30">
                        FREE
                      </span>
                    )}
                  </div>

                  <div className="flex justify-center">
                    {enrolledCourses.includes(selectedCourse._id) ? (
                      <div className="flex items-center bg-green-500/20 text-green-300 px-6 py-3 rounded-xl text-sm font-semibold border border-green-500/30">
                        <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
                        Already Enrolled
                      </div>
                    ) : user ? (
                      <button 
                        onClick={() => {
                          handleQuickEnroll(selectedCourse._id);
                          setShowDetailsModal(false);
                        }} 
                        disabled={enrollingCourse === selectedCourse._id}
                        className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-green-500/20 transition-all duration-200 flex items-center text-sm font-semibold disabled:opacity-50"
                      >
                        {enrollingCourse === selectedCourse._id ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                            Enrolling...
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="h-5 w-5 mr-2" />
                            Enroll Now
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="text-center text-slate-400">
                        <p className="mb-2">Please login to enroll in this course</p>
                        <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                          Login Here
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Courses;