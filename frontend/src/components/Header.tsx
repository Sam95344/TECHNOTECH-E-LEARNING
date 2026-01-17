import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800 shadow-[0_12px_40px_rgba(15,23,42,0.9)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="h-12 w-12 rounded-xl shadow-[0_10px_30px_rgba(59,130,246,0.6)] group-hover:shadow-[0_14px_40px_rgba(59,130,246,0.8)] transition-all duration-300 transform group-hover:scale-105 border border-white/10 overflow-hidden flex items-center justify-center bg-white/5">
                <img src="/logo.png" alt="Logo" className="h-10 w-10 object-contain" />
              </div>
              <span className="hidden sm:block text-xl font-bold bg-gradient-to-r from-slate-50 via-slate-200 to-slate-400 bg-clip-text text-transparent tracking-tight">
                TECHNOTECH E-LEARNING
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                to="/courses"
                className="text-slate-200 hover:text-sky-400 font-medium text-sm tracking-wide transition-all duration-200 hover:scale-105 relative group"
              >
                Courses
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-sky-500 to-emerald-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                to="/about"
                className="text-slate-200 hover:text-sky-400 font-medium text-sm tracking-wide transition-all duration-200 hover:scale-105 relative group"
              >
                About
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-sky-500 to-emerald-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                to="/community"
                className="text-slate-200 hover:text-sky-400 font-medium text-sm tracking-wide transition-all duration-200 hover:scale-105 relative group"
              >
                Community
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-sky-500 to-emerald-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                to="/contact"
                className="text-slate-200 hover:text-sky-400 font-medium text-sm tracking-wide transition-all duration-200 hover:scale-105 relative group"
              >
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-sky-500 to-emerald-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </nav>

            {/* User Authentication Section */}
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex flex-col items-end text-xs leading-tight text-slate-300">
                  <span className="uppercase tracking-[0.18em] text-slate-500">Logged in</span>
                  <span className="font-semibold text-sky-400">{user.name}</span>
                </div>
                <Link
                  to={user.role === 'admin' ? '/admin' : '/dashboard'}
                  className="hidden sm:inline-flex items-center bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 text-white px-4 py-2 rounded-xl shadow-[0_10px_30px_rgba(34,197,94,0.5)] hover:shadow-[0_14px_40px_rgba(34,197,94,0.7)] transition-all duration-200 transform hover:scale-105 text-xs font-semibold border border-white/10"
                >
                  My Panel
                </Link>
                <button
                  onClick={logout}
                  className="inline-flex items-center bg-gradient-to-r from-rose-500 to-pink-600 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-[0_10px_30px_rgba(244,63,94,0.5)] hover:shadow-[0_14px_40px_rgba(244,63,94,0.7)] hover:from-rose-600 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 border border-white/10"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-slate-200 hover:text-sky-400 font-medium text-sm px-3 py-2 rounded-xl hover:bg-slate-800/80 border border-transparent hover:border-slate-700 transition-all duration-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 text-white px-4 py-2 rounded-xl shadow-[0_10px_30px_rgba(59,130,246,0.6)] hover:shadow-[0_14px_40px_rgba(59,130,246,0.8)] transition-all duration-200 transform hover:scale-105 font-semibold text-sm border border-white/10"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu icon */}
            <div className="md:hidden">
              <button className="p-2 rounded-xl text-slate-200 hover:bg-slate-800/80 border border-slate-700 transition-colors">
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;