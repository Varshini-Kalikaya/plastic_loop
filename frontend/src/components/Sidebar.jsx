import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  Package,
  History,
  Gift,
  Trophy,
  TreePine,
  User,
  Truck,
  Factory,
  Users,
  Layers,
  BarChart3,
  CheckSquare,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  if (!user) return null;

  const roleNavItems = {
    USER: [
      { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/request-pickup', label: 'Request Pickup', icon: PlusCircle },
      { to: '/my-pickups', label: 'My Pickups', icon: Package },
      { to: '/recycling-history', label: 'Recycling History', icon: History },
      { to: '/rewards', label: 'Rewards Catalog', icon: Gift },
      { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
      { to: '/impact', label: 'Eco Impact', icon: TreePine },
      { to: '/profile', label: 'My Profile', icon: User },
    ],
    COLLECTOR: [
      { to: '/collector/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/collector/pickups', label: 'Assigned Pickups', icon: Truck },
      { to: '/collector/history', label: 'Collection History', icon: History },
      { to: '/profile', label: 'Profile', icon: User },
    ],
    RECYCLER: [
      { to: '/recycler/dashboard', label: 'Facility Dashboard', icon: LayoutDashboard },
      { to: '/recycler/materials', label: 'Processing Queue', icon: Factory },
      { to: '/recycler/history', label: 'Recycling History', icon: History },
      { to: '/profile', label: 'Profile', icon: User },
    ],
    ADMIN: [
      { to: '/admin/dashboard', label: 'Overview Dashboard', icon: LayoutDashboard },
      { to: '/admin/assign-collectors', label: 'Assign Collectors', icon: CheckSquare },
      { to: '/admin/users', label: 'User Accounts', icon: Users },
      { to: '/admin/plastic-types', label: 'Plastic Categories', icon: Layers },
      { to: '/admin/pickups', label: 'All Pickup Requests', icon: Package },
      { to: '/admin/rewards', label: 'Rewards & Redemptions', icon: Gift },
      { to: '/admin/analytics', label: 'Ecosystem Analytics', icon: BarChart3 },
      { to: '/profile', label: 'Admin Profile', icon: User },
    ],
  };

  const currentItems = roleNavItems[user.role] || roleNavItems.USER;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 z-30 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-35 w-64 bg-slate-900/95 border-r border-slate-800/80 p-4 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          <div className="px-3 py-2 bg-slate-800/40 rounded-xl border border-slate-800 flex items-center gap-3">
            <img
              src={user.profileImage}
              alt={user.name}
              className="w-9 h-9 rounded-lg object-cover border border-emerald-500/40"
            />
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{user.name}</p>
              <p className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">{user.role}</p>
            </div>
          </div>

          <nav className="space-y-1">
            {currentItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-500/5'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="p-3 bg-gradient-to-br from-emerald-950/50 to-slate-900 border border-emerald-500/20 rounded-2xl text-center">
          <p className="text-[11px] font-bold text-emerald-400">PlasticLoop v1.0</p>
          <p className="text-[10px] text-slate-400 mt-0.5">B.Tech IT Final Year Project</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
