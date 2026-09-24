import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RefreshCw, LogOut, User as UserIcon, Shield, Sparkles, Menu, X, Award, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NotificationDropdown from './NotificationDropdown';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);

  const roleBadges = {
    USER: { label: 'Citizen', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    COLLECTOR: { label: 'Collector', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    RECYCLER: { label: 'Recycler Facility', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
    ADMIN: { label: 'Platform Admin', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  };

  const currentBadge = user ? roleBadges[user.role] : null;

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {user && toggleSidebar && (
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <RefreshCw className="w-6 h-6 text-slate-950 font-extrabold animate-spin-slow" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
              Plastic<span className="eco-gradient-text">Loop</span>
            </span>
            <span className="block text-[10px] uppercase font-bold tracking-widest text-emerald-500/90 -mt-1">
              Smart Waste Platform
            </span>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        {user ? (
          <>
            {user.role === 'USER' && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 font-bold text-xs">
                <Award className="w-4 h-4 text-emerald-400" />
                <span>{user.points || 0} Points</span>
              </div>
            )}

            <NotificationDropdown />

            {/* User Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2.5 p-1.5 rounded-xl bg-slate-800/70 border border-slate-700/60 hover:border-emerald-500/40 transition-all"
              >
                <img
                  src={user.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                  alt={user.name}
                  className="w-8 h-8 rounded-lg object-cover border border-emerald-500/30"
                />
                <div className="hidden md:block text-left pr-1">
                  <p className="text-xs font-bold text-white leading-none">{user.name}</p>
                  {currentBadge && (
                    <span className={`inline-block mt-0.5 px-1.5 py-0.2 rounded text-[10px] font-semibold border ${currentBadge.color}`}>
                      {currentBadge.label}
                    </span>
                  )}
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
              </button>

              {profileOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 glass-card rounded-2xl shadow-2xl border border-slate-700/80 p-2 z-50"
                  onMouseLeave={() => setProfileOpen(false)}
                >
                  <div className="p-3 border-b border-slate-800/80 mb-1">
                    <p className="text-xs font-bold text-white">{user.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 hover:text-emerald-400 hover:bg-slate-800/60 rounded-xl transition-colors"
                  >
                    <UserIcon className="w-4 h-4" /> My Profile
                  </Link>

                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      logout();
                      navigate('/login');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors mt-1"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-lg shadow-emerald-500/20 transition-all"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
