import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RefreshCw, Lock, Mail, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const userObj = await login(email, password);
      redirectUser(userObj.role);
    } catch (err) {
      setSubmitting(false);
    }
  };

  const handleDemo = async (role) => {
    setSubmitting(true);
    try {
      const userObj = await demoLogin(role);
      redirectUser(userObj.role);
    } catch (err) {
      setSubmitting(false);
    }
  };

  const redirectUser = (role) => {
    if (role === 'ADMIN') navigate('/admin/dashboard');
    else if (role === 'COLLECTOR') navigate('/collector/dashboard');
    else if (role === 'RECYCLER') navigate('/recycler/dashboard');
    else navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-card rounded-3xl p-8 border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-3">
            <RefreshCw className="w-7 h-7 text-slate-950 animate-spin-slow" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Welcome Back</h2>
          <p className="text-xs text-slate-400 mt-1">Sign in to your PlasticLoop account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500/80 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500/80 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl eco-button-gradient text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg"
          >
            {submitting ? 'Signing in...' : 'Sign In to Dashboard'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Quick Login Buttons */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 text-center">
          <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-3 flex items-center justify-center gap-1">
            <Zap className="w-3.5 h-3.5" /> Instant Demo Account Access
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleDemo('USER')}
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-emerald-950/60 border border-slate-800 hover:border-emerald-500/40 text-[11px] font-bold text-slate-300 hover:text-emerald-400 transition-colors"
            >
              👤 Citizen User
            </button>
            <button
              onClick={() => handleDemo('COLLECTOR')}
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-blue-950/60 border border-slate-800 hover:border-blue-500/40 text-[11px] font-bold text-slate-300 hover:text-blue-400 transition-colors"
            >
              🚚 Collector
            </button>
            <button
              onClick={() => handleDemo('RECYCLER')}
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-purple-950/60 border border-slate-800 hover:border-purple-500/40 text-[11px] font-bold text-slate-300 hover:text-purple-400 transition-colors"
            >
              🏭 Recycler
            </button>
            <button
              onClick={() => handleDemo('ADMIN')}
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-amber-950/60 border border-slate-800 hover:border-amber-500/40 text-[11px] font-bold text-slate-300 hover:text-amber-400 transition-colors"
            >
              🛡️ Admin
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-emerald-400 hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
