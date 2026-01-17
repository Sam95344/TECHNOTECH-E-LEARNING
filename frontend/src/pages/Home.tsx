import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { BookOpen, Users, Award, Star, Clock, CheckCircle, Play, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Home: React.FC = () => {
  const { user } = useAuth();

  // Redirect admin to admin panel
  if (user && user.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Developer",
      content: "This platform transformed my career. The courses are comprehensive and the instructors are top-notch.",
      rating: 5,
      avatar: "SJ"
    },
    {
      name: "Michael Chen",
      role: "Data Scientist",
      content: "The best investment I've made in my professional development. Highly recommend to anyone serious about learning.",
      rating: 5,
      avatar: "MC"
    },
    {
      name: "Emily Rodriguez",
      role: "UX Designer",
      content: "Amazing learning experience! The interactive content and community support made all the difference.",
      rating: 5,
      avatar: "ER"
    }
  ];

  const stats = [
    { number: "50,000+", label: "Students Enrolled", icon: Users },
    { number: "1,200+", label: "Courses Available", icon: BookOpen },
    { number: "500+", label: "Expert Instructors", icon: GraduationCap },
    { number: "98%", label: "Student Satisfaction", icon: Star }
  ];

  const features = [
    {
      icon: Play,
      title: "Video Learning",
      description: "High-quality video lessons with interactive elements and progress tracking."
    },
    {
      icon: Award,
      title: "Certificates",
      description: "Earn recognized certificates upon course completion to showcase your skills."
    },
    {
      icon: Clock,
      title: "Self-Paced",
      description: "Learn at your own pace with lifetime access to course materials."
    },
    {
      icon: Users,
      title: "Community",
      description: "Join a vibrant learning community with forums and peer discussions."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section with Header Overlay */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white relative overflow-hidden min-h-screen">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white opacity-5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        {/* Header */}
        <div className="relative z-10">
          <Header />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              Learn Anytime,<br />
              <span className="text-yellow-300 drop-shadow-lg">Anywhere</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-blue-100 leading-relaxed font-medium">
              Unlock your potential with our comprehensive online courses. Learn from expert instructors
              and earn certificates that accelerate your career growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {user ? (
                <>
                  {user.role === 'student' && (
                    <>
                      <Link to="/dashboard" className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all transform hover:scale-110 shadow-2xl hover:shadow-white/25 text-lg">
                        Go to Dashboard
                      </Link>
                      <Link to="/courses" className="border-2 border-white text-white px-8 py-4 rounded-2xl font-bold hover:bg-white hover:text-blue-600 transition-all transform hover:scale-110 shadow-lg">
                        Browse Courses
                      </Link>
                    </>
                  )}
                  {user.role === 'instructor' && (
                    <>
                      <Link to="/instructor" className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all transform hover:scale-110 shadow-2xl hover:shadow-white/25 text-lg">
                        Manage Courses
                      </Link>
                      <Link to="/courses" className="border-2 border-white text-white px-8 py-4 rounded-2xl font-bold hover:bg-white hover:text-blue-600 transition-all transform hover:scale-110 shadow-lg">
                        View All Courses
                      </Link>
                    </>
                  )}
                </>
              ) : (
                <>
                  <Link to="/courses" className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all transform hover:scale-110 shadow-2xl hover:shadow-white/25 text-lg">
                    Explore Courses
                  </Link>
                  <Link to="/register" className="border-2 border-white text-white px-8 py-4 rounded-2xl font-bold hover:bg-white hover:text-blue-600 transition-all transform hover:scale-110 shadow-lg">
                    Start Learning Free
                  </Link>
                </>
              )}
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-blue-100">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                No credit card required
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                30-day money back guarantee
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                Lifetime access
              </div>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white opacity-10 rounded-full animate-bounce"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white opacity-5 rounded-full animate-bounce delay-1000"></div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-slate-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-violet-600 to-purple-600 rounded-3xl shadow-2xl shadow-purple-500/20 mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-violet-300 to-purple-300 bg-clip-text text-transparent mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-slate-400 font-medium max-w-2xl mx-auto">
              Join thousands of learners worldwide who trust us for their educational journey
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-slate-800 border border-slate-700 p-8 rounded-3xl shadow-xl shadow-black/20 transform hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 hover:scale-105 hover:-translate-y-2 group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-500 rounded-2xl mb-6 shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-20 bg-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-rose-600 to-pink-600 rounded-3xl shadow-2xl shadow-rose-500/20 mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-rose-300 to-pink-300 bg-clip-text text-transparent mb-4">
              Explore Popular Categories
            </h2>
            <p className="text-xl text-slate-400 font-medium">Discover courses in the most in-demand fields</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { name: 'Technology', icon: '💻', count: '150+ courses' },
              { name: 'Business', icon: '📊', count: '120+ courses' },
              { name: 'Design', icon: '🎨', count: '90+ courses' },
              { name: 'Programming', icon: '⚡', count: '200+ courses' },
              { name: 'AI & ML', icon: '🤖', count: '80+ courses' },
              { name: 'Marketing', icon: '📈', count: '110+ courses' }
            ].map((category) => (
              <Link
                key={category.name}
                to={`/courses?category=${category.name}`}
                className="bg-slate-800 border border-slate-700 p-8 rounded-3xl hover:border-rose-500/50 shadow-xl shadow-black/20 transition-all duration-300 transform hover:scale-110 hover:-translate-y-2 text-center group"
              >
                <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">{category.icon}</div>
                <h3 className="font-bold text-white group-hover:text-rose-400 mb-2 text-lg transition-colors duration-300">{category.name}</h3>
                <p className="text-sm text-slate-400 font-medium">{category.count}</p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/courses" className="inline-flex items-center bg-gradient-to-r from-rose-600 to-pink-600 text-white px-8 py-4 rounded-2xl hover:from-rose-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 shadow-lg shadow-rose-500/20 font-bold text-lg">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Browse All Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-600 to-orange-600 rounded-3xl shadow-2xl shadow-amber-500/20 mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-amber-300 to-orange-300 bg-clip-text text-transparent mb-4">
              What Our Students Say
            </h2>
            <p className="text-xl text-slate-400 font-medium">Real stories from real learners</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-slate-800 border border-slate-700 p-8 rounded-3xl shadow-xl shadow-black/20 transform hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 hover:scale-105 hover:-translate-y-2 relative group">
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                  </svg>
                </div>
                <div className="flex items-center mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="h-6 w-6 text-amber-400 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>
                <p className="text-slate-300 mb-8 italic text-lg leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg mr-4 shadow-lg shadow-amber-500/20">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-white text-lg">{testimonial.name}</div>
                    <div className="text-sm text-slate-400 font-medium">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 text-white relative overflow-hidden border-t border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl shadow-2xl shadow-purple-500/30 mb-8">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">Ready to Start Your Learning Journey?</h2>
          <p className="text-xl mb-10 text-slate-300 font-medium max-w-2xl mx-auto">
            Join millions of learners worldwide. Start with our free courses or explore our premium content.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            {user ? (
              <>
                <Link to="/dashboard" className="bg-white text-indigo-600 px-10 py-5 rounded-2xl font-bold hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-2xl text-lg flex items-center justify-center">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Go to Dashboard
                </Link>
                <Link to="/courses" className="border-2 border-white text-white px-10 py-5 rounded-2xl font-bold hover:bg-white hover:text-indigo-600 transition-all duration-200 transform hover:scale-105 shadow-2xl text-lg flex items-center justify-center">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Browse Courses
                </Link>
              </>
            ) : (
              <>
                <Link to="/register" className="bg-white text-indigo-600 px-10 py-5 rounded-2xl font-bold hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-2xl text-lg flex items-center justify-center">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Get Started Free
                </Link>
                <Link to="/courses" className="border-2 border-white text-white px-10 py-5 rounded-2xl font-bold hover:bg-white hover:text-indigo-600 transition-all duration-200 transform hover:scale-105 shadow-2xl text-lg flex items-center justify-center">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Browse Courses
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;