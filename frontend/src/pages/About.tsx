import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Briefcase } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { CREATOR_PROFILE } from '../config/creatorProfile';

const About: React.FC = () => {

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          {/* Page Header */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-slate-50 via-sky-200 to-emerald-300 bg-clip-text text-transparent tracking-tight">
              About Us
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Welcome to our platform. Here you can learn more about our creator and connect with us.
            </p>
          </div>

          {/* Main About Section */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Description */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:border-slate-600/70 transition-all duration-300">
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">
                  TECHNOTECH E-LEARNING
                </h2>
                <p className="text-slate-300 leading-relaxed mb-4">
                  We believe that quality education should be accessible to everyone, everywhere. Our platform is built on the principle of democratizing learning through innovative technology and expert-led courses.
                </p>
                <p className="text-slate-300 leading-relaxed mb-4">
                  Whether you're a beginner looking to start your coding journey or an experienced developer wanting to master new technologies, we have courses tailored to your needs.
                </p>
                <p className="text-slate-300 leading-relaxed">
                  Our mission is to empower millions of learners worldwide by providing industry-relevant, practical education that transforms careers and lives.
                </p>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-sky-500/20 to-sky-600/20 backdrop-blur-xl border border-sky-500/30 rounded-xl p-4 shadow-[0_10px_30px_rgba(14,165,233,0.2)]">
                  <h3 className="font-bold text-sky-300 mb-2">Expert Instructors</h3>
                  <p className="text-sm text-slate-300">Learn from industry professionals with years of experience</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 backdrop-blur-xl border border-emerald-500/30 rounded-xl p-4 shadow-[0_10px_30px_rgba(34,197,94,0.2)]">
                  <h3 className="font-bold text-emerald-300 mb-2">Self-Paced Learning</h3>
                  <p className="text-sm text-slate-300">Study at your own pace, anytime, anywhere</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-xl border border-purple-500/30 rounded-xl p-4 shadow-[0_10px_30px_rgba(168,85,247,0.2)]">
                  <h3 className="font-bold text-purple-300 mb-2">Certificates</h3>
                  <p className="text-sm text-slate-300">Earn recognized certificates upon course completion</p>
                </div>
                <div className="bg-gradient-to-br from-rose-500/20 to-rose-600/20 backdrop-blur-xl border border-rose-500/30 rounded-xl p-4 shadow-[0_10px_30px_rgba(244,63,94,0.2)]">
                  <h3 className="font-bold text-rose-300 mb-2">Community</h3>
                  <p className="text-sm text-slate-300">Connect with thousands of learners worldwide</p>
                </div>
              </div>
            </div>

            {/* Right side - Profile Section */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:border-slate-600/70 transition-all duration-300">
                <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">
                  Creator Profile
                </h2>

                {/* Profile Picture Section */}
                <div className="text-center mb-8">
                  <div className="relative inline-block mb-6">
                    <img
                      src={CREATOR_PROFILE.profileImage}
                      alt={CREATOR_PROFILE.name}
                      className="w-40 h-40 rounded-2xl object-cover border-4 border-gradient-to-r from-sky-500 to-emerald-500 shadow-[0_15px_40px_rgba(59,130,246,0.4)]"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">{CREATOR_PROFILE.name}</h3>
                  <p className="text-slate-400 mb-6">{CREATOR_PROFILE.title}</p>

                  {/* Social Links */}
                  <div className="space-y-3">
                    {CREATOR_PROFILE.github && (
                      <a
                        href={CREATOR_PROFILE.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white px-4 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 border border-slate-600 hover:border-slate-500 shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
                      >
                        <Github className="w-5 h-5" />
                        Visit GitHub
                      </a>
                    )}
                    {CREATOR_PROFILE.portfolio && (
                      <a
                        href={CREATOR_PROFILE.portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 hover:from-sky-600 hover:via-indigo-700 hover:to-purple-700 text-white px-4 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 border border-white/10 shadow-[0_10px_30px_rgba(59,130,246,0.5)]"
                      >
                        <Briefcase className="w-5 h-5" />
                        View Portfolio
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Info Box */}
              <div className="bg-gradient-to-br from-emerald-500/10 to-teal-600/10 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                <h3 className="text-lg font-bold text-emerald-300 mb-3">Why Choose TECHNOTECH?</h3>
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-1">✓</span>
                    <span>Industry-aligned curriculum designed by experts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-1">✓</span>
                    <span>Interactive projects and real-world applications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-1">✓</span>
                    <span>24/7 access to learning materials</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-1">✓</span>
                    <span>Lifetime access to purchased courses</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Statistics Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-sky-500/10 to-sky-600/10 backdrop-blur-xl border border-sky-500/30 rounded-xl p-6 text-center shadow-[0_10px_30px_rgba(14,165,233,0.2)]">
              <h3 className="text-4xl font-bold bg-gradient-to-r from-sky-400 to-blue-400 bg-clip-text text-transparent mb-2">50K+</h3>
              <p className="text-slate-300 text-sm font-semibold">Active Learners</p>
              <p className="text-slate-400 text-xs mt-1">Worldwide community members</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 backdrop-blur-xl border border-emerald-500/30 rounded-xl p-6 text-center shadow-[0_10px_30px_rgba(34,197,94,0.2)]">
              <h3 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">1200+</h3>
              <p className="text-slate-300 text-sm font-semibold">Courses Available</p>
              <p className="text-slate-400 text-xs mt-1">Diverse learning paths</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 backdrop-blur-xl border border-purple-500/30 rounded-xl p-6 text-center shadow-[0_10px_30px_rgba(168,85,247,0.2)]">
              <h3 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">500+</h3>
              <p className="text-slate-300 text-sm font-semibold">Expert Instructors</p>
              <p className="text-slate-400 text-xs mt-1">Industry professionals</p>
            </div>
            <div className="bg-gradient-to-br from-rose-500/10 to-rose-600/10 backdrop-blur-xl border border-rose-500/30 rounded-xl p-6 text-center shadow-[0_10px_30px_rgba(244,63,94,0.2)]">
              <h3 className="text-4xl font-bold bg-gradient-to-r from-rose-400 to-red-400 bg-clip-text text-transparent mb-2">98%</h3>
              <p className="text-slate-300 text-sm font-semibold">Success Rate</p>
              <p className="text-slate-400 text-xs mt-1">Student satisfaction</p>
            </div>
          </div>

          {/* Learning Areas Section */}
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-50 via-sky-200 to-emerald-300 bg-clip-text text-transparent mb-2">Learning Areas</h2>
              <p className="text-slate-400 text-lg">Master in-demand skills across multiple domains</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-xl border border-blue-500/30 rounded-xl p-5 hover:border-blue-400/50 transition-all">
                <h3 className="text-lg font-bold text-blue-300 mb-2">Web Development</h3>
                <p className="text-slate-400 text-sm">HTML, CSS, JavaScript, React, Node.js, Full Stack</p>
              </div>
              <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 backdrop-blur-xl border border-emerald-500/30 rounded-xl p-5 hover:border-emerald-400/50 transition-all">
                <h3 className="text-lg font-bold text-emerald-300 mb-2">Data Science</h3>
                <p className="text-slate-400 text-sm">Python, Machine Learning, Data Analysis, AI</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 backdrop-blur-xl border border-purple-500/30 rounded-xl p-5 hover:border-purple-400/50 transition-all">
                <h3 className="text-lg font-bold text-purple-300 mb-2">Mobile Apps</h3>
                <p className="text-slate-400 text-sm">React Native, Flutter, iOS, Android Development</p>
              </div>
              <div className="bg-gradient-to-br from-rose-500/10 to-rose-600/10 backdrop-blur-xl border border-rose-500/30 rounded-xl p-5 hover:border-rose-400/50 transition-all">
                <h3 className="text-lg font-bold text-rose-300 mb-2">Cloud & DevOps</h3>
                <p className="text-slate-400 text-sm">AWS, Docker, Kubernetes, CI/CD Pipeline</p>
              </div>
              <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/10 backdrop-blur-xl border border-amber-500/30 rounded-xl p-5 hover:border-amber-400/50 transition-all">
                <h3 className="text-lg font-bold text-amber-300 mb-2">Design & UX</h3>
                <p className="text-slate-400 text-sm">UI/UX, Figma, Graphic Design, Prototyping</p>
              </div>
              <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/10 backdrop-blur-xl border border-cyan-500/30 rounded-xl p-5 hover:border-cyan-400/50 transition-all">
                <h3 className="text-lg font-bold text-cyan-300 mb-2">Business & Soft Skills</h3>
                <p className="text-slate-400 text-sm">Leadership, Communication, Project Management</p>
              </div>
            </div>
          </div>

          {/* Testimonials Section */}
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-50 via-sky-200 to-emerald-300 bg-clip-text text-transparent mb-2">Success Stories</h2>
              <p className="text-slate-400 text-lg">Hear from our amazing learners</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white font-bold">RJ</div>
                  <div>
                    <p className="font-semibold text-white text-sm">Raj Kumar</p>
                    <p className="text-xs text-slate-400">Software Engineer</p>
                  </div>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">"TECHNOTECH transformed my career. The course quality and instructor support are exceptional. Highly recommended!"</p>
                <div className="flex gap-1 mt-4">
                  {[...Array(5)].map((_, i) => <span key={i} className="text-yellow-400">★</span>)}
                </div>
              </div>
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold">PR</div>
                  <div>
                    <p className="font-semibold text-white text-sm">Priya Singh</p>
                    <p className="text-xs text-slate-400">Data Scientist</p>
                  </div>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">"The structured learning path helped me switch careers seamlessly. Best investment in my growth!"</p>
                <div className="flex gap-1 mt-4">
                  {[...Array(5)].map((_, i) => <span key={i} className="text-yellow-400">★</span>)}
                </div>
              </div>
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold">AJ</div>
                  <div>
                    <p className="font-semibold text-white text-sm">Aditya Jain</p>
                    <p className="text-xs text-slate-400">UI/UX Designer</p>
                  </div>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">"Amazing platform with incredible instructors. The projects here got me hired at my dream company!"</p>
                <div className="flex gap-1 mt-4">
                  {[...Array(5)].map((_, i) => <span key={i} className="text-yellow-400">★</span>)}
                </div>
              </div>
            </div>
          </div>

          {/* Technology Stack Section */}
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-50 via-sky-200 to-emerald-300 bg-clip-text text-transparent mb-2">Our Technology Stack</h2>
              <p className="text-slate-400 text-lg">Built with modern, scalable technologies</p>
            </div>
            <div className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {['React', 'TypeScript', 'Node.js', 'MongoDB', 'Docker', 'AWS', 'Tailwind', 'PostgreSQL', 'Redis', 'Kubernetes'].map((tech, idx) => (
                  <div key={idx} className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600/50 rounded-lg p-4 text-center hover:border-sky-500/50 transition-all">
                    <p className="text-slate-300 font-semibold text-sm">{tech}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-sky-500/20 via-emerald-500/20 to-purple-500/20 backdrop-blur-xl border border-sky-500/30 rounded-2xl p-12 text-center shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Learning?</h2>
            <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">Join thousands of learners transforming their careers with TECHNOTECH E-LEARNING</p>
            <Link
              to="/courses"
              className="inline-flex items-center bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-[0_10px_30px_rgba(59,130,246,0.5)] hover:shadow-[0_14px_40px_rgba(59,130,246,0.7)] transition-all duration-200 transform hover:scale-105 border border-white/10"
            >
              Explore Courses Now
            </Link>
          </div>

          {/* Credit Section */}
          <div className="text-center pt-8 border-t border-slate-700">
            <p className="text-slate-400 text-sm">
              <span className="font-semibold text-slate-300">Design by</span> <span className="bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent font-bold">{CREATOR_PROFILE.name}</span>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
