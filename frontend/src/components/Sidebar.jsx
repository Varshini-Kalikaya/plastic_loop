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
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  if (!user) return null;

  const roleNavItems = {
    USER: [
      { to: '/dashboard', label: 'Eco Dashboard', icon: LayoutDashboard },
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
          className="fixed inset-0 bg-stone-900/40 z-30 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-35 w-64 bg-[#fbfcfb] border-r border-[#e2e8df] p-4 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          <div className="px-3.5 py-3 bg-[#f0f5f1] rounded-2xl border border-[#d6e4d9] flex items-center gap-3">
            <img
              src={user.profileImage}
              alt={user.name}
              className="w-10 h-10 rounded-xl object-cover border border-[#c4d8ca]"
            />
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-[#14231b] truncate">{user.name}</p>
              <p className="text-[10px] text-[#2d6a4f] font-extrabold uppercase tracking-wider">{user.role}</p>
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
                        ? 'bg-[#1b4332] text-white shadow-sm'
                        : 'text-[#4d5e53] hover:text-[#14231b] hover:bg-[#edf4ef]'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="p-3.5 bg-[#f4f7f4] border border-[#dce6df] rounded-2xl text-center space-y-0.5">
          <p className="text-xs font-bold text-[#1b4332]">PlasticLoop Circular Platform</p>
          <p className="text-[10px] text-[#697b70]">Digitizing waste collection & recycling</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
