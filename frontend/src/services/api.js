import axios from 'axios';

const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    const cleanUrl = envUrl.replace(/\/+$/, '');
    return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
  }

  // When deployed on Vercel or any external hosting domain, default directly to Render backend
  if (
    typeof window !== 'undefined' &&
    window.location.hostname &&
    !['localhost', '127.0.0.1'].includes(window.location.hostname)
  ) {
    return 'https://plastic-loop-4zyz.onrender.com/api';
  }

  // Local development default (proxied through Vite dev server to localhost:5000)
  return '/api';
};

const API = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request Interceptor: Attach JWT Token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
API.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // If token expired / unauthorized, clear stale credentials
    if (error.response?.status === 401) {
      const isAuthEndpoint = error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/register');
      if (!isAuthEndpoint && typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }

    const message =
      error.response?.data?.message ||
      (typeof error.response?.data === 'string' ? error.response.data : null) ||
      error.message ||
      'Something went wrong on the server';

    return Promise.reject(new Error(message));
  }
);

export default API;
