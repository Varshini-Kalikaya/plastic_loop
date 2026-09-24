import React, { useState } from 'react';
import { Bell, CheckCheck, Clock, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

const NotificationDropdown = () => {
  const { notifications, unreadNotifications, fetchNotifications } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleMarkAsRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);
      await fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await API.put('/notifications/read-all');
      await fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-300 hover:text-white hover:border-emerald-500/50 transition-all"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadNotifications > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center animate-pulse">
            {unreadNotifications}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-3 w-80 sm:w-96 glass-card rounded-2xl shadow-2xl border border-slate-700/80 z-50 overflow-hidden"
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-emerald-400" />
              <h4 className="font-semibold text-sm text-white">Notifications</h4>
              {unreadNotifications > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">
                  {unreadNotifications} new
                </span>
              )}
            </div>
            {unreadNotifications > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs">No notifications yet</div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => !n.read && handleMarkAsRead(n._id)}
                  className={`p-3.5 transition-colors cursor-pointer hover:bg-slate-800/60 ${
                    !n.read ? 'bg-emerald-950/20 border-l-2 border-emerald-500' : 'opacity-70'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h5 className="text-xs font-semibold text-white">{n.title}</h5>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{n.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
