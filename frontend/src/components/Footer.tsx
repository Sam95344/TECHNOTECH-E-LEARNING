import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="mt-16 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 text-slate-200 border-t border-white/10 shadow-[0_-10px_40px_rgba(15,23,42,0.9)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 py-10">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-4 mb-4">
              <Link to="/">
                <div className="h-14 w-14 rounded-xl shadow-[0_10px_30px_rgba(59,130,246,0.6)] border border-white/10 overflow-hidden flex items-center justify-center bg-white/5 hover:shadow-[0_14px_40px_rgba(59,130,246,0.8)] transition-all duration-300">
                  <img src="/logo.png" alt="Logo" className="h-12 w-12 object-contain" />
                </div>
              </Link>
              <div>
                <h3 className="text-xl font-bold tracking-tight">TECHNOTECH</h3>
                <p className="text-sm text-slate-400">E-Learning Platform</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 mb-4 max-w-md">
              Empowering learners worldwide with quality education, expert instructors,
              and innovative learning experiences.
            </p>
            <div className="flex flex-wrap gap-3 mt-2 text-sm">
              <a href="https://www.facebook.com/igsam8084" className="text-slate-400 hover:text-white transition-colors">Facebook</a>
              <a href="https://x.com/mrsam8084" className="text-slate-400 hover:text-white transition-colors">Twitter</a>
              <a href="https://www.linkedin.com/in/shamshadalam8084/" className="text-slate-400 hover:text-white transition-colors">LinkedIn</a>
              
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-slate-100 text-sm uppercase tracking-wide">Platform</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/courses" className="hover:text-white transition-colors">Browse Courses</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Become Instructor</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-slate-100 text-sm uppercase tracking-wide">Support</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 py-6 text-sm">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-500">
              &copy; 2026 TECHNOTECH E-LEARNING. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-slate-500 hover:text-white transition-colors">Accessibility</a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors">Sitemap</a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors">Careers</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;