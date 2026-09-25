import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Zap, Leaf, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/Logo';

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
    <div className="min-h-screen bg-[#fbfbf9] flex items-center justify-center p-4 sm:p-8 selection:bg-[#1b4332] selection:text-white">
      <div className="w-full max-w-4xl bg-white rounded-3xl border border-[#e2e8df] shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-12">
        {/* Left Side: Environmental Storytelling */}
        <div className="md:col-span-5 bg-[#1b4332] text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#2d6a4f]/40 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

          <div>
            <div className="mb-8">
              <Logo to="/" variant="full" size="sm" inverted={true} />
            </div>

            <span className="text-[10px] font-bold uppercase tracking-widest text-[#a3d2af] block mb-2">
              Circular Economy
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold leading-snug">
              Every piece of plastic has value when recycled right.
            </h2>
            <p className="text-xs text-[#cde6d4] mt-3 leading-relaxed">
              Log in to track your collections, verify weight receipts, and redeem rewards for circular impact.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15 space-y-3">
            <div className="flex items-center gap-2.5 text-xs text-[#e1ede5]">
              <CheckCircle2 className="w-4 h-4 text-[#a3d2af] shrink-0" />
              <span>Doorstep verified waste collection</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-[#e1ede5]">
              <CheckCircle2 className="w-4 h-4 text-[#a3d2af] shrink-0" />
              <span>Digital scales & transparent auditing</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-[#e1ede5]">
              <CheckCircle2 className="w-4 h-4 text-[#a3d2af] shrink-0" />
              <span>Direct shopping vouchers & tree planting</span>
            </div>
          </div>
        </div>

        {/* Right Side: Form & Instant Demo Logins */}
        <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-between bg-white">
          <div>
            <div className="mb-6">
              <h3 className="text-2xl font-extrabold text-[#14231b]">Sign In</h3>
              <p className="text-xs text-[#63756a] mt-1">Access your personalized sustainability portal</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#14231b] uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8a9d90] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-[#fbfcfb] border border-[#dce5de] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#14231b] placeholder-[#9cb0a2] focus:outline-none focus:border-[#1b4332] focus:ring-1 focus:ring-[#1b4332] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#14231b] uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8a9d90] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#fbfcfb] border border-[#dce5de] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#14231b] placeholder-[#9cb0a2] focus:outline-none focus:border-[#1b4332] focus:ring-1 focus:ring-[#1b4332] transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl eco-btn-primary text-xs flex items-center justify-center gap-2 shadow-sm font-bold"
              >
                {submitting ? 'Signing in...' : 'Sign In to Dashboard'} <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Instant Demo Account Access */}
            <div className="mt-8 pt-6 border-t border-[#edf2ec]">
              <span className="text-[11px] font-bold text-[#1b4332] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#2d6a4f]" /> 1-Click Demo Logins
              </span>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => handleDemo('USER')}
                  className="px-3 py-2 rounded-xl bg-[#edf6f0] hover:bg-[#dcefe2] border border-[#cbe3d3] text-[11px] font-bold text-[#1b4332] transition-colors text-left flex items-center gap-1.5"
                >
                  <span>👤</span> Citizen User
                </button>
                <button
                  type="button"
                  onClick={() => handleDemo('COLLECTOR')}
                  className="px-3 py-2 rounded-xl bg-[#f0f9ff] hover:bg-[#e0f2fe] border border-[#bae6fd] text-[11px] font-bold text-[#0369a1] transition-colors text-left flex items-center gap-1.5"
                >
                  <span>🚚</span> Collector
                </button>
                <button
                  type="button"
                  onClick={() => handleDemo('RECYCLER')}
                  className="px-3 py-2 rounded-xl bg-[#faf5ff] hover:bg-[#f3e8ff] border border-[#e9d5ff] text-[11px] font-bold text-[#6b21a8] transition-colors text-left flex items-center gap-1.5"
                >
                  <span>🏭</span> Recycler
                </button>
                <button
                  type="button"
                  onClick={() => handleDemo('ADMIN')}
                  className="px-3 py-2 rounded-xl bg-[#fefce8] hover:bg-[#fef9c3] border border-[#fde68a] text-[11px] font-bold text-[#92400e] transition-colors text-left flex items-center gap-1.5"
                >
                  <span>🛡️</span> Admin
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-[#63756a]">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-[#1b4332] hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
