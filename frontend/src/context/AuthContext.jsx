import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const fetchUser = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await API.get('/auth/me');
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
    } catch (error) {
      console.error('Failed to load user:', error.message);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await API.get('/notifications');
      setNotifications(res.data || []);
      setUnreadNotifications(res.unreadCount || 0);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [token]);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 15000); // refresh every 15s
      return () => clearInterval(interval);
    }
  }, [user]);

  const login = async (email, password) => {
    try {
      const res = await API.post('/auth/login', { email, password });
      setToken(res.token);
      setUser(res.data);
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      showToast(`Welcome back, ${res.data.name}! 👋`, 'success');
      return res.data;
    } catch (error) {
      showToast(error.message, 'error');
      throw error;
    }
  };

  const demoLogin = async (role) => {
    const credentials = {
      USER: { email: 'user@plasticloop.com', password: 'password123' },
      COLLECTOR: { email: 'collector@plasticloop.com', password: 'password123' },
      RECYCLER: { email: 'recycler@plasticloop.com', password: 'password123' },
      ADMIN: { email: 'admin@plasticloop.com', password: 'password123' },
    };
    const cred = credentials[role] || credentials.USER;
    return await login(cred.email, cred.password);
  };

  const register = async (formData) => {
    try {
      const res = await API.post('/auth/register', formData);
      setToken(res.token);
      setUser(res.data);
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      showToast('Account registered successfully! 🌿', 'success');
      return res.data;
    } catch (error) {
      showToast(error.message, 'error');
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    showToast('Logged out successfully', 'info');
  };

  const refreshUser = async () => {
    await fetchUser();
    await fetchNotifications();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        toast,
        notifications,
        unreadNotifications,
        login,
        demoLogin,
        register,
        logout,
        refreshUser,
        fetchNotifications,
        showToast,
      }}
    >
      {children}

      {/* Global Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl backdrop-blur-md border animate-bounce-short transition-all duration-300 bg-slate-800/90 text-white border-emerald-500/40">
          <div
            className={`w-3 h-3 rounded-full ${
              toast.type === 'success'
                ? 'bg-emerald-400 shadow-[0_0_10px_#34d399]'
                : toast.type === 'error'
                ? 'bg-red-400 shadow-[0_0_10px_#f87171]'
                : 'bg-blue-400 shadow-[0_0_10px_#60a5fa]'
            }`}
          />
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
