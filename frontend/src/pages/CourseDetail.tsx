import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import { useAuth } from '../context/AuthContext';
import { Star, Play, CheckCircle, Clock, Users, Award, BookOpen, ShoppingCart, CreditCard, Video, Calendar, FileVideo } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration: string;
  price: number;
  instructor: { name: string; bio: string };
  videos: { title: string; url: string; duration: string; type: string }[];
  liveClasses: { title: string; description: string; scheduledDate: string; duration: string; meetingLink: string; isActive: boolean }[];
  recordedSessions: { title: string; url: string; duration: string; uploadDate: string }[];
  ratings: { user: { name: string }; rating: number; review: string }[];
  averageRating: number;
}

interface Enrollment {
  _id: string;
  progress: number;
  completedLessons: string[];
  certificate: string;
}

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [unenrolling, setUnenrolling] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [activeTab, setActiveTab] = useState<'videos' | 'live' | 'recorded'>('videos');
  const [currentVideo, setCurrentVideo] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (id) {
      console.log('Fetching course with ID:', id);
      fetchCourse();
    }
  }, [id]);

  useEffect(() => {
    if (user && course) {
      console.log('User and course available, fetching enrollment');
      fetchEnrollment();
    } else if (user && id) {
      // If course is not loaded yet but we have user and id, still try to fetch enrollment
      console.log('User and id available, fetching enrollment');
      fetchEnrollment();
    }
  }, [user, course, id]);

  // Auto-focus on learning content for enrolled users
  useEffect(() => {
    if (enrollment) {
      console.log('Enrollment found, switching to videos tab');
      setActiveTab('videos');
      // Scroll to video player after a short delay
      setTimeout(() => {
        const videoElement = document.querySelector('video');
        if (videoElement) {
          console.log('Scrolling to video element');
          videoElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          console.log('Video element not found');
        }
      }, 500);
    }
  }, [enrollment]);

  const fetchCourse = async () => {
    if (!id) {
      console.log('fetchCourse: no id provided');
      return;
    }
    try {
      console.log('fetchCourse: fetching course with id', id);
      const res = await axios.get(API_ENDPOINTS.COURSES.DETAIL(id));
      console.log('fetchCourse: received course data', res.data);
      setCourse(res.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching course:', err);
      setCourse(null);
      setError('Course not found or server error. It may have been removed or there is a connection issue.');
    }
  };

  const fetchEnrollment = async () => {
    if (!user || !id) {
      console.log('fetchEnrollment: user or id not available', { user: !!user, id });
      return;
    }
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('fetchEnrollment: no token found');
        return;
      }

      console.log('fetchEnrollment: fetching enrollments for user', user.id);
      const res = await axios.get(API_ENDPOINTS.ENROLL.LIST, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('fetchEnrollment: received enrollments', res.data);

      // Try different ways to find the enrollment
      let userEnrollment = res.data.find((e: any) => String(e.course._id) === String(id));
      if (!userEnrollment) {
        userEnrollment = res.data.find((e: any) => String(e.course._id) === String(course?._id));
      }
      if (!userEnrollment) {
        userEnrollment = res.data.find((e: any) => String(e.course) === String(id));
      }
      if (!userEnrollment) {
        userEnrollment = res.data.find((e: any) => String(e.course) === String(course?._id));
      }

      console.log('fetchEnrollment: found enrollment', userEnrollment);
      setEnrollment(userEnrollment || null);
    } catch (err) {
      console.error('Error fetching enrollment:', err);
      setEnrollment(null);
    }
  };

  const handleEnroll = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    setEnrolling(true);
    try {
      await axios.post(API_ENDPOINTS.ENROLL.CREATE, { courseId: id }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Enrolled successfully');
      fetchEnrollment();
    } catch (err: any) {
      alert('Enrollment failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setEnrolling(false);
    }
  };

  const handleUnenroll = async () => {
    if (!enrollment) return;

    // Prevent unenrolling from completed courses
    if (enrollment.progress === 100) {
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

    setUnenrolling(true);
    try {
      await axios.delete(API_ENDPOINTS.ENROLL.DELETE(enrollment._id), {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Successfully unenrolled from the course');
      setEnrollment(null);
    } catch (err) {
      alert('Failed to unenroll. Please try again.');
    } finally {
      setUnenrolling(false);
    }
  };

  const handleVideoComplete = async () => {
    if (!enrollment || !course) return;

    const completedLessons = [...enrollment.completedLessons];
    const videoTitle = course.videos[currentVideo]?.title;

    if (videoTitle && !completedLessons.includes(videoTitle)) {
      completedLessons.push(videoTitle);

      const progress = Math.round((completedLessons.length / course.videos.length) * 100);

      try {
        await axios.put(API_ENDPOINTS.ENROLL.PROGRESS(enrollment._id), {
          progress,
          completedLessons
        }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setEnrollment({ ...enrollment, progress, completedLessons });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleRatingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first');
      return;
    }

    if (!enrollment) {
      alert('You must be enrolled in this course to leave a review');
      return;
    }

    setSubmittingReview(true);
    try {
      await axios.post(API_ENDPOINTS.COURSES.RATING(id), {
        rating,
        review
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Thank you for your review! It has been submitted successfully.');
      fetchCourse(); // Refresh course data to show new review
      setReview('');
      setRating(5); // Reset to default
    } catch (err: any) {
      console.error('Review submission error:', err);
      if (err.response?.status === 403) {
        alert('You must be enrolled in this course to leave a review');
      } else if (err.response?.status === 404) {
        alert('Course not found');
      } else {
        alert('Failed to submit review. Please try again.');
      }
    } finally {
      setSubmittingReview(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl shadow-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-3">Unable to open course</h2>
          <p className="text-[var(--text-secondary)] mb-6">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!course) return <div className="min-h-screen flex items-center justify-center text-[var(--text-primary)]">Loading...</div>;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Course Header */}
        <div className="bg-[var(--card-bg)] rounded-lg shadow-lg overflow-hidden mb-8 border border-[var(--border-color)]">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-4 lg:mb-0">
                <h1 className="text-3xl lg:text-4xl font-bold mb-2">{course.title}</h1>
                <p className="text-blue-100 text-lg mb-4">{course.description}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>Instructor: {course.instructor?.name || 'Instructor'}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Duration: {course.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <Award className="h-4 w-4 mr-1" />
                    <span>Level: {course.level}</span>
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-1" />
                    <span>Category: {course.category}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="flex items-center mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < Math.floor(course.averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <p className="text-sm">{course.averageRating.toFixed(1)} ({course.ratings?.length || 0} reviews)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Content Tabs */}
            {enrollment && (
              <div className="bg-[var(--card-bg)] rounded-lg shadow-lg overflow-hidden border border-[var(--border-color)]">
                <div className="p-6 border-b border-[var(--border-color)]">
                  <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">Course Content</h2>
                  
                  {/* Content Type Tabs */}
                  <div className="flex space-x-1 bg-[var(--bg-tertiary)] p-1 rounded-lg">
                    <button
                      onClick={() => setActiveTab('videos')}
                      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                        activeTab === 'videos'
                          ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm'
                          : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <Video className="h-4 w-4 inline mr-2" />
                      Videos ({course.videos?.length || 0})
                    </button>
                    <button
                      onClick={() => setActiveTab('live')}
                      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                        activeTab === 'live'
                          ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm'
                          : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <Calendar className="h-4 w-4 inline mr-2" />
                      Live Classes ({course.liveClasses?.length || 0})
                    </button>
                    <button
                      onClick={() => setActiveTab('recorded')}
                      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                        activeTab === 'recorded'
                          ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm'
                          : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <FileVideo className="h-4 w-4 inline mr-2" />
                      Recorded ({course.recordedSessions?.length || 0})
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  {/* Videos Tab */}
                  {activeTab === 'videos' && course.videos && course.videos.length > 0 && (
                    <div>
                      <video
                        controls
                        width="100%"
                        height="400px"
                        src={course.videos[currentVideo]?.url}
                        onEnded={handleVideoComplete}
                        className="w-full h-auto rounded-lg"
                        key={currentVideo} // Force re-render when video changes
                        onError={(e) => console.error('Video loading error:', e)}
                      >
                        Your browser does not support the video tag.
                      </video>
                      <div className="mt-4">
                        <h3 className="text-lg font-semibold text-[var(--text-primary)]">{course.videos[currentVideo]?.title}</h3>
                        <p className="text-[var(--text-muted)]">Duration: {course.videos[currentVideo]?.duration}</p>
                      </div>
                      {/* Video Navigation */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        {course.videos.map((video, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentVideo(index)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              index === currentVideo
                                ? 'bg-blue-600 text-white'
                                : enrollment?.completedLessons.includes(video.title)
                                ? 'bg-green-100 text-green-800 border border-green-300'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {index + 1}. {video.title}
                            {enrollment?.completedLessons.includes(video.title) && (
                              <CheckCircle className="h-4 w-4 inline ml-1" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Live Classes Tab */}
                  {activeTab === 'live' && course.liveClasses && course.liveClasses.length > 0 && (
                    <div className="space-y-4">
                      {course.liveClasses.map((liveClass, index) => (
                        <div key={index} className="border border-[var(--border-color)] rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-lg font-semibold text-[var(--text-primary)]">{liveClass.title}</h3>
                              <p className="text-[var(--text-secondary)] mb-2">{liveClass.description}</p>
                              <div className="flex items-center space-x-4 text-sm text-[var(--text-muted)]">
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  {new Date(liveClass.scheduledDate).toLocaleDateString()} at {new Date(liveClass.scheduledDate).toLocaleTimeString()}
                                </div>
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1" />
                                  {liveClass.duration}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              {new Date(liveClass.scheduledDate) > new Date() ? (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                  Upcoming
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                  Available
                                </span>
                              )}
                            </div>
                          </div>
                          {liveClass.isActive && (
                            <a
                              href={liveClass.meetingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              <Video className="h-4 w-4 mr-2" />
                              Join Live Class
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Recorded Sessions Tab */}
                  {activeTab === 'recorded' && course.recordedSessions && course.recordedSessions.length > 0 && (
                    <div className="space-y-4">
                      {course.recordedSessions.map((session, index) => (
                        <div key={index} className="border border-[var(--border-color)] rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-[var(--text-primary)]">{session.title}</h3>
                              <div className="flex items-center space-x-4 text-sm text-[var(--text-muted)] mt-1">
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1" />
                                  {session.duration}
                                </div>
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  {new Date(session.uploadDate).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                            <a
                              href={session.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors ml-4"
                            >
                              <Play className="h-4 w-4 mr-2" />
                              Watch Recording
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Empty States */}
                  {activeTab === 'videos' && (!course.videos || course.videos.length === 0) && (
                    <div className="text-center py-8">
                      <Video className="h-12 w-12 text-[var(--text-muted)] mx-auto mb-4" />
                      <p className="text-[var(--text-muted)]">No video content available yet.</p>
                      <p className="text-sm text-[var(--text-muted)] mt-2">The instructor is working on adding video lessons. Check back later!</p>
                    </div>
                  )}

                  {activeTab === 'live' && (!course.liveClasses || course.liveClasses.length === 0) && (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-[var(--text-muted)] mx-auto mb-4" />
                      <p className="text-[var(--text-muted)]">No live classes scheduled yet.</p>
                    </div>
                  )}

                  {activeTab === 'recorded' && (!course.recordedSessions || course.recordedSessions.length === 0) && (
                    <div className="text-center py-8">
                      <FileVideo className="h-12 w-12 text-[var(--text-muted)] mx-auto mb-4" />
                      <p className="text-[var(--text-muted)]">No recorded sessions available yet.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Course Overview */}
            <div className="bg-[var(--card-bg)] rounded-lg shadow-lg p-6 border border-[var(--border-color)]">
              <h2 className="text-2xl font-semibold mb-4 text-[var(--text-primary)]">About This Course</h2>
              <div className="prose max-w-none">
                <p className="text-[var(--text-secondary)] mb-6">{course.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">What You'll Learn</h3>
                    <ul className="text-blue-800 dark:text-blue-200 space-y-1">
                      <li>• Comprehensive understanding of {course.category}</li>
                      <li>• Practical skills and techniques</li>
                      <li>• Real-world applications</li>
                      <li>• Certificate upon completion</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                    <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">Course Features</h3>
                    <ul className="text-green-800 dark:text-green-200 space-y-1">
                      <li>• Lifetime access</li>
                      <li>• Mobile and desktop access</li>
                      <li>• Downloadable resources</li>
                      <li>• Community support</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Instructor Info */}
            <div className="bg-[var(--card-bg)] rounded-lg shadow-lg p-6 border border-[var(--border-color)]">
              <h2 className="text-2xl font-semibold mb-4 text-[var(--text-primary)]">Your Instructor</h2>
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {(course.instructor?.name?.charAt(0).toUpperCase() || 'I')}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2 text-[var(--text-primary)]">
                    {course.instructor?.name || 'Instructor'}
                  </h3>
                  <p className="text-[var(--text-muted)] mb-4">
                    {course.instructor?.bio || 'Experienced instructor with years of teaching experience.'}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-[var(--text-muted)]">
                    <span>⭐ 4.8 Instructor Rating</span>
                    <span>👥 10,000+ Students</span>
                    <span>📚 15 Courses</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress */}
            {enrollment && (
              <div className="bg-[var(--card-bg)] rounded-lg shadow-lg p-6 border border-[var(--border-color)]">
                <h3 className="text-xl font-semibold mb-4 text-[var(--text-primary)]">Your Progress</h3>
                <div className="w-full bg-[var(--bg-tertiary)] rounded-full h-4 mb-4">
                  <div
                    className="bg-blue-600 h-4 rounded-full transition-all duration-300"
                    style={{ width: `${enrollment.progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-lg font-medium text-[var(--text-primary)]">{enrollment.progress}% Complete</p>
                  <span className="text-sm text-[var(--text-muted)]">
                    {enrollment.completedLessons.length} of {course.videos?.length || 0} lessons
                  </span>
                </div>
                {enrollment.progress === 100 && (
                  <div className="mt-6 p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex items-center mb-4">
                      <Award className="h-8 w-8 text-green-600 mr-3" />
                      <h4 className="text-xl font-semibold text-green-800 dark:text-green-200">🎉 Course Completed!</h4>
                    </div>
                    <p className="text-green-700 dark:text-green-300 mb-4">Congratulations on completing this course! Download your certificate below.</p>
                    <a
                      href={API_ENDPOINTS.ENROLL.CERTIFICATE(enrollment._id)}
                      className="inline-flex items-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Award className="h-5 w-5 mr-2" />
                      Download Certificate
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Ratings and Reviews */}
            <div className="bg-[var(--card-bg)] rounded-lg shadow-lg p-6 border border-[var(--border-color)]">
              <h3 className="text-xl font-semibold mb-6 text-[var(--text-primary)]">Student Reviews</h3>

              {/* Overall Rating */}
              <div className="flex items-center mb-6 p-4 bg-[var(--bg-tertiary)] rounded-lg">
                <div className="text-center mr-6">
                  <div className="text-4xl font-bold text-[var(--text-primary)] mb-1">{course.averageRating.toFixed(1)}</div>
                  <div className="flex items-center justify-center mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < Math.floor(course.averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-[var(--text-muted)]">{course.ratings?.length || 0} reviews</p>
                </div>
                <div className="flex-1">
                  {[5,4,3,2,1].map(rating => {
                    const count = course.ratings?.filter(r => r.rating === rating).length || 0;
                    const percentage = course.ratings?.length ? (count / course.ratings.length) * 100 : 0;
                    return (
                      <div key={rating} className="flex items-center mb-2">
                        <span className="text-sm w-8 text-[var(--text-primary)]">{rating}★</span>
                        <div className="flex-1 bg-[var(--bg-tertiary)] rounded-full h-2 mx-2">
                          <div
                            className="bg-yellow-400 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-[var(--text-muted)] w-8">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Individual Reviews */}
              <div className="space-y-6">
                {course.ratings && course.ratings.map((r, index) => (
                  <div key={index} className="border-b border-[var(--border-color)] pb-6 last:border-b-0 last:pb-0">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-3">
                          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                            {(r.user?.name?.charAt(0).toUpperCase() || 'S')}
                          </span>
                        </div>
                        <span className="font-semibold text-[var(--text-primary)]">
                          {r.user?.name || 'Student'}
                        </span>
                      </div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < r.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-[var(--text-secondary)]">{r.review}</p>
                  </div>
                ))}
              </div>

              {/* Write Review */}
              {enrollment && (
                <div className="border-t border-[var(--border-color)] pt-6 mt-6">
                  <h4 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">Write a Review</h4>
                  <form onSubmit={handleRatingSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Your Rating</label>
                      <div className="flex space-x-1">
                        {[1,2,3,4,5].map(star => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="focus:outline-none"
                          >
                            <Star
                              className={`h-6 w-6 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                            />
                          </button>
                        ))}
                        <span className="ml-2 text-[var(--text-muted)]">{rating} stars</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Your Review</label>
                      <textarea
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        className="w-full border border-[var(--border-color)] bg-[var(--input-bg)] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[var(--text-primary)]"
                        rows={4}
                        placeholder="Share your experience with this course..."
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submittingReview ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Star className="h-5 w-5 mr-2" />
                          Submit Review
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Purchase/Enroll Card */}
            <div className="bg-[var(--card-bg)] rounded-lg shadow-lg p-6 sticky top-24 border border-[var(--border-color)]">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-[var(--text-primary)] mb-2">${course.price}</div>
                <p className="text-[var(--text-muted)]">One-time payment, lifetime access</p>
              </div>

              {enrollment ? (
                <div className="space-y-4">
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-green-800 dark:text-green-200 font-semibold">Enrolled Successfully!</p>
                    <p className="text-green-600 dark:text-green-300 text-sm">Start learning now</p>
                  </div>
                  <button
                    onClick={() => {
                      // Find the next uncompleted video
                      if (course.videos && course.videos.length > 0) {
                        const nextVideoIndex = course.videos.findIndex((video) =>
                          !enrollment.completedLessons.includes(video.title)
                        );
                        setCurrentVideo(nextVideoIndex >= 0 ? nextVideoIndex : 0);
                        setActiveTab('videos');
                        // Scroll to video after state update
                        setTimeout(() => {
                          const videoElement = document.querySelector('video');
                          if (videoElement) {
                            videoElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          }
                        }, 100);
                      }
                    }}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Continue Learning
                  </button>
                  <button
                    onClick={handleUnenroll}
                    disabled={unenrolling}
                    className="w-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 py-2 px-4 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors flex items-center justify-center text-sm border border-red-200 dark:border-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {unenrolling ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                        Unenrolling...
                      </>
                    ) : (
                      'Unenroll from Course'
                    )}
                  </button>
                </div>
              ) : user ? (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 mb-4">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Ready to Start Learning?</h3>
                    <p className="text-[var(--text-secondary)] text-sm mb-3">
                      Get lifetime access to all course content, including videos, live classes, and recorded sessions.
                    </p>
                    <div className="flex items-center space-x-2 text-sm text-[var(--text-muted)]">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Certificate upon completion</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={handleEnroll}
                      disabled={enrolling}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {enrolling ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                          Enrolling...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="h-6 w-6 mr-3" />
                          Enroll Now - ${course.price}
                        </>
                      )}
                    </button>

                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <div className="flex items-center text-[var(--text-muted)]">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        <span>Lifetime access to all content</span>
                      </div>
                      <div className="flex items-center text-[var(--text-muted)]">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        <span>Access on mobile and desktop</span>
                      </div>
                      <div className="flex items-center text-[var(--text-muted)]">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        <span>Certificate of completion</span>
                      </div>
                      <div className="flex items-center text-[var(--text-muted)]">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        <span>Live classes and recorded sessions</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg mb-4">
                    <p className="text-blue-800 dark:text-blue-200 font-semibold mb-2">Login Required</p>
                    <p className="text-blue-600 dark:text-blue-300 text-sm">Please sign in to enroll in this course</p>
                  </div>
                  <button
                    onClick={() => window.location.href = '/login'}
                    className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-lg font-semibold"
                  >
                    <CreditCard className="h-6 w-6 mr-2" />
                    Login to Purchase
                  </button>
                </div>
              )}

              {/* Course Stats */}
              <div className="mt-6 pt-6 border-t border-[var(--border-color)]">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-[var(--text-primary)]">
                      {(course.videos?.length || 0) + (course.liveClasses?.length || 0) + (course.recordedSessions?.length || 0)}
                    </div>
                    <div className="text-sm text-[var(--text-muted)]">Total Content</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[var(--text-primary)]">{course.duration}</div>
                    <div className="text-sm text-[var(--text-muted)]">Duration</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[var(--text-primary)]">{course.level}</div>
                    <div className="text-sm text-[var(--text-muted)]">Level</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[var(--text-primary)]">{course.category}</div>
                    <div className="text-sm text-[var(--text-muted)]">Category</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Content Preview */}
            <div className="bg-[var(--card-bg)] rounded-lg shadow-lg p-6 border border-[var(--border-color)]">
              <h3 className="text-lg font-semibold mb-4 flex items-center text-[var(--text-primary)]">
                <BookOpen className="h-5 w-5 mr-2" />
                Course Content Overview
              </h3>
              
              {/* Videos Section */}
              {course.videos && course.videos.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-[var(--text-primary)] mb-3 flex items-center">
                    <Video className="h-4 w-4 mr-2" />
                    Video Lessons ({course.videos.length})
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {course.videos.map((video, index) => (
                      <div
                        key={index}
                        className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors ${
                          enrollment && currentVideo === index && activeTab === 'videos'
                            ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                            : 'hover:bg-[var(--hover-bg)]'
                        }`}
                        onClick={() => enrollment && setActiveTab('videos') && setCurrentVideo(index)}
                      >
                        {enrollment && enrollment.completedLessons.includes(video.title) ? (
                          <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                        ) : (
                          <Play className="h-4 w-4 text-[var(--text-muted)] mr-3 flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm truncate ${!enrollment ? 'text-[var(--text-muted)]' : 'text-[var(--text-primary)]'}`}>
                            {enrollment ? video.title : `Lesson ${index + 1}`}
                          </p>
                          <p className="text-xs text-[var(--text-muted)]">{video.duration}</p>
                        </div>
                        {!enrollment && (
                          <div className="text-xs text-[var(--text-muted)] ml-2">
                            🔒
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Live Classes Section */}
              {course.liveClasses && course.liveClasses.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-[var(--text-primary)] mb-3 flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Live Classes ({course.liveClasses.length})
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {course.liveClasses.map((liveClass, index) => (
                      <div
                        key={index}
                        className="flex items-center p-2 rounded-lg hover:bg-[var(--hover-bg)] cursor-pointer transition-colors"
                        onClick={() => enrollment && setActiveTab('live')}
                      >
                        <Calendar className="h-4 w-4 text-blue-500 mr-3 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm truncate ${!enrollment ? 'text-[var(--text-muted)]' : 'text-[var(--text-primary)]'}`}>
                            {enrollment ? liveClass.title : `Live Class ${index + 1}`}
                          </p>
                          <p className="text-xs text-[var(--text-muted)]">
                            {new Date(liveClass.scheduledDate).toLocaleDateString()} • {liveClass.duration}
                          </p>
                        </div>
                        {!enrollment && (
                          <div className="text-xs text-[var(--text-muted)] ml-2">
                            🔒
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recorded Sessions Section */}
              {course.recordedSessions && course.recordedSessions.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-[var(--text-primary)] mb-3 flex items-center">
                    <FileVideo className="h-4 w-4 mr-2" />
                    Recorded Sessions ({course.recordedSessions.length})
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {course.recordedSessions.map((session, index) => (
                      <div
                        key={index}
                        className="flex items-center p-2 rounded-lg hover:bg-[var(--hover-bg)] cursor-pointer transition-colors"
                        onClick={() => enrollment && setActiveTab('recorded')}
                      >
                        <FileVideo className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm truncate ${!enrollment ? 'text-[var(--text-muted)]' : 'text-[var(--text-primary)]'}`}>
                            {enrollment ? session.title : `Recorded Session ${index + 1}`}
                          </p>
                          <p className="text-xs text-[var(--text-muted)]">
                            {session.duration} • {new Date(session.uploadDate).toLocaleDateString()}
                          </p>
                        </div>
                        {!enrollment && (
                          <div className="text-xs text-[var(--text-muted)] ml-2">
                            🔒
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!enrollment && (
                <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-yellow-800 dark:text-yellow-200 text-sm text-center">
                    Enroll to unlock all course content including videos, live classes, and recorded sessions
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CourseDetail;