import React, { useState } from 'react';
import { Bell, CheckCheck, Clock, CheckCircle2 } from 'lucide-react';
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
        className="relative p-2.5 rounded-xl bg-white border border-[#e2e8df] text-[#4f6055] hover:text-[#1b4332] hover:border-[#b4cbbd] shadow-sm transition-all"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadNotifications > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#1b4332] text-white font-bold text-[10px] flex items-center justify-center shadow-md">
            {unreadNotifications}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-[#e2e8df] z-50 overflow-hidden animate-fade-in"
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="p-4 border-b border-[#edf2ec] flex items-center justify-between bg-[#fafbfa]">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#1b4332]" />
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#14231b]">Notifications</h4>
              {unreadNotifications > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#edf6f0] text-[#1b4332] border border-[#cce3d2] text-[10px] font-bold">
                  {unreadNotifications} new
                </span>
              )}
            </div>
            {unreadNotifications > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-[#2d6a4f] hover:text-[#1b4332] font-semibold flex items-center gap-1 transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-[#edf2ec]">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-[#738478] text-xs">
                <CheckCircle2 className="w-6 h-6 text-[#9eb2a3] mx-auto mb-2" />
                You're all caught up! No notifications yet.
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => !n.read && handleMarkAsRead(n._id)}
                  className={`p-3.5 transition-colors cursor-pointer hover:bg-[#f6f9f7] ${
                    !n.read ? 'bg-[#f2f8f4] border-l-4 border-[#1b4332]' : 'opacity-75'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h5 className="text-xs font-bold text-[#14231b]">{n.title}</h5>
                    <span className="text-[10px] text-[#788a7e] flex items-center gap-1 shrink-0 font-medium">
                      <Clock className="w-3 h-3 text-[#9eb2a3]" />
                      {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-[#4d5e53] mt-1 leading-relaxed">{n.message}</p>
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
