import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User as UserIcon, Menu, Award, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NotificationDropdown from './NotificationDropdown';
import Logo from './Logo';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);

  const roleBadges = {
    USER: { label: 'Citizen', color: 'bg-[#edf6f0] text-[#1b4332] border-[#cbe3d3]' },
    COLLECTOR: { label: 'Collector', color: 'bg-sky-50 text-sky-900 border-sky-200' },
    RECYCLER: { label: 'Recycler Facility', color: 'bg-purple-50 text-purple-900 border-purple-200' },
    ADMIN: { label: 'Platform Admin', color: 'bg-amber-50 text-amber-900 border-amber-200' },
  };

  const currentBadge = user ? roleBadges[user.role] : null;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#e2e8df] px-4 sm:px-8 py-3.5 flex items-center justify-between transition-colors shadow-[0_1px_4px_rgba(27,67,50,0.02)]">
      <div className="flex items-center gap-3">
        {user && toggleSidebar && (
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-xl bg-[#f4f7f4] text-[#4f6055] hover:text-[#1b4332] border border-[#d6e3d8]"
            title="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <Logo to="/" variant="full" size="md" />
      </div>

      <div className="flex items-center gap-3">
        {user ? (
          <>
            {user.role === 'USER' && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#fefce8] border border-[#fef08a] text-[#854d0e] font-extrabold text-xs shadow-sm">
                <Award className="w-4 h-4 text-[#ca8a04]" />
                <span>{user.points || 0} Points</span>
              </div>
            )}

            <NotificationDropdown />

            {/* User Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2.5 p-1.5 rounded-xl bg-[#f7f9f7] border border-[#dce5de] hover:border-[#b4cbbd] transition-all"
              >
                <img
                  src={user.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                  alt={user.name}
                  className="w-8 h-8 rounded-lg object-cover border border-[#c2d6c7]"
                />
                <div className="hidden md:block text-left pr-1">
                  <p className="text-xs font-bold text-[#14231b] leading-none">{user.name}</p>
                  {currentBadge && (
                    <span className={`inline-block mt-0.5 px-1.5 py-0.2 rounded text-[10px] font-semibold border ${currentBadge.color}`}>
                      {currentBadge.label}
                    </span>
                  )}
                </div>
                <ChevronDown className="w-4 h-4 text-[#687a6e] hidden sm:block" />
              </button>

              {profileOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#e2e8df] p-2 z-50 animate-fade-in"
                  onMouseLeave={() => setProfileOpen(false)}
                >
                  <div className="p-3 border-b border-[#edf2ec] mb-1">
                    <p className="text-xs font-bold text-[#14231b]">{user.name}</p>
                    <p className="text-[11px] text-[#6b7d71] truncate">{user.email}</p>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#3d4f43] hover:text-[#1b4332] hover:bg-[#f2f7f4] rounded-xl transition-colors"
                  >
                    <UserIcon className="w-4 h-4 text-[#5f7366]" /> My Profile
                  </Link>

                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      logout();
                      navigate('/login');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 rounded-xl transition-colors mt-1"
                  >
                    <LogOut className="w-4 h-4 text-rose-600" /> Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-xs font-bold text-[#2d4235] hover:text-[#1b4332] transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 text-xs font-bold text-white bg-[#1b4332] hover:bg-[#2d6a4f] rounded-xl shadow-sm transition-all"
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
