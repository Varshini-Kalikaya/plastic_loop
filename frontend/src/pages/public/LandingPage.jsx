import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  RefreshCw,
  Truck,
  Factory,
  Award,
  ArrowRight,
  ShieldCheck,
  Zap,
  TreePine,
  Sparkles,
  ChevronRight,
  Bot,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const LandingPage = () => {
  const { user, demoLogin } = useAuth();
  const navigate = useNavigate();
  const [calcKg, setCalcKg] = useState(10);

  const handleDemoAccess = async (role) => {
    await demoLogin(role);
    if (role === 'ADMIN') navigate('/admin/dashboard');
    else if (role === 'COLLECTOR') navigate('/collector/dashboard');
    else if (role === 'RECYCLER') navigate('/recycler/dashboard');
    else navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-16 pb-24 px-4 sm:px-8 max-w-7xl mx-auto text-center overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-6">
          <Sparkles className="w-4 h-4" /> Smart Plastic Circular Economy Platform
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
          Turn Plastic Waste Into <span className="eco-gradient-text">Verified Rewards</span> & Environmental Impact
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          PlasticLoop connects citizens, waste collectors, recycling centers, and administrators into an integrated ecosystem. Request pickups, verify weight, track recycling, and earn points seamlessly.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            to={user ? '/dashboard' : '/register'}
            className="px-8 py-4 rounded-xl eco-button-gradient text-slate-950 font-extrabold text-sm flex items-center gap-2 shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all"
          >
            {user ? 'Go to My Dashboard' : 'Request Pickup Now'} <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#demo-access"
            className="px-6 py-4 rounded-xl glass-card text-white font-bold text-sm hover:border-emerald-500/40 transition-all"
          >
            ⚡ Test Demo Accounts
          </a>
        </div>

        {/* Live Ecosystem Impact Bar */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto text-left">
          <div className="glass-card p-5 rounded-2xl border-emerald-500/20">
            <p className="text-xs text-slate-400 uppercase font-semibold">Total Recycled</p>
            <h3 className="text-2xl font-bold text-emerald-400 mt-1">1,250+ KG</h3>
            <p className="text-[11px] text-slate-400 mt-1">Verified plastic weight</p>
          </div>
          <div className="glass-card p-5 rounded-2xl border-emerald-500/20">
            <p className="text-xs text-slate-400 uppercase font-semibold">CO2 Avoided</p>
            <h3 className="text-2xl font-bold text-teal-400 mt-1">1,875 KG</h3>
            <p className="text-[11px] text-slate-400 mt-1">Calculated EPA metrics</p>
          </div>
          <div className="glass-card p-5 rounded-2xl border-emerald-500/20">
            <p className="text-xs text-slate-400 uppercase font-semibold">Reward Points</p>
            <h3 className="text-2xl font-bold text-amber-400 mt-1">15,000+</h3>
            <p className="text-[11px] text-slate-400 mt-1">Credited to citizens</p>
          </div>
          <div className="glass-card p-5 rounded-2xl border-emerald-500/20">
            <p className="text-xs text-slate-400 uppercase font-semibold">Active Partners</p>
            <h3 className="text-2xl font-bold text-purple-400 mt-1">100%</h3>
            <p className="text-[11px] text-slate-400 mt-1">Collectors & Recyclers</p>
          </div>
        </div>
      </section>

      {/* Demo One-Click Access Cards */}
      <section id="demo-access" className="py-16 px-4 bg-slate-900/60 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Instant One-Click Demo Logins</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Evaluate all 4 stakeholder roles immediately without registration.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card glass-card-hover p-6 rounded-2xl border border-emerald-500/30 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold mb-4">
                  👤
                </div>
                <h3 className="font-bold text-base text-white">Citizen / User</h3>
                <p className="text-xs text-slate-400 mt-2">
                  Request waste pickup, track recycling progress, view impact & redeem reward vouchers.
                </p>
              </div>
              <button
                onClick={() => handleDemoAccess('USER')}
                className="mt-6 py-2.5 w-full rounded-xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 font-bold text-xs transition-colors"
              >
                Login as User →
              </button>
            </div>

            <div className="glass-card glass-card-hover p-6 rounded-2xl border border-blue-500/30 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold mb-4">
                  🚚
                </div>
                <h3 className="font-bold text-base text-white">Collector</h3>
                <p className="text-xs text-slate-400 mt-2">
                  View assigned pickups, accept requests, verify actual weight, and dispatch to recyclers.
                </p>
              </div>
              <button
                onClick={() => handleDemoAccess('COLLECTOR')}
                className="mt-6 py-2.5 w-full rounded-xl bg-blue-500/20 hover:bg-blue-500 text-blue-400 hover:text-slate-950 font-bold text-xs transition-colors"
              >
                Login as Collector →
              </button>
            </div>

            <div className="glass-card glass-card-hover p-6 rounded-2xl border border-purple-500/30 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold mb-4">
                  🏭
                </div>
                <h3 className="font-bold text-base text-white">Recycling Facility</h3>
                <p className="text-xs text-slate-400 mt-2">
                  Receive material shipments, record recycled & rejected weight, and credit points.
                </p>
              </div>
              <button
                onClick={() => handleDemoAccess('RECYCLER')}
                className="mt-6 py-2.5 w-full rounded-xl bg-purple-500/20 hover:bg-purple-500 text-purple-400 hover:text-slate-950 font-bold text-xs transition-colors"
              >
                Login as Recycler →
              </button>
            </div>

            <div className="glass-card glass-card-hover p-6 rounded-2xl border border-amber-500/30 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold mb-4">
                  🛡️
                </div>
                <h3 className="font-bold text-base text-white">Platform Admin</h3>
                <p className="text-xs text-slate-400 mt-2">
                  Assign collectors, manage users & rewards, inspect platform analytics & audit logs.
                </p>
              </div>
              <button
                onClick={() => handleDemoAccess('ADMIN')}
                className="mt-6 py-2.5 w-full rounded-xl bg-amber-500/20 hover:bg-amber-500 text-amber-400 hover:text-slate-950 font-bold text-xs transition-colors"
              >
                Login as Admin →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* End-to-End Core Business Workflow */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-white">End-to-End Lifecycle Workflow</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Every step is tracked in real-time with strict backend validation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          <div className="glass-card p-5 rounded-2xl text-center border-slate-800">
            <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold mb-3">
              1
            </div>
            <h4 className="font-bold text-sm text-white">1. User Request</h4>
            <p className="text-xs text-slate-400 mt-1">Select plastic type, estimated kg & pickup slot</p>
          </div>

          <div className="glass-card p-5 rounded-2xl text-center border-slate-800">
            <div className="w-12 h-12 mx-auto rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold mb-3">
              2
            </div>
            <h4 className="font-bold text-sm text-white">2. Collector Pickup</h4>
            <p className="text-xs text-slate-400 mt-1">Collector accepts request & collects waste</p>
          </div>

          <div className="glass-card p-5 rounded-2xl text-center border-slate-800">
            <div className="w-12 h-12 mx-auto rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold mb-3">
              3
            </div>
            <h4 className="font-bold text-sm text-white">3. Weight Verification</h4>
            <p className="text-xs text-slate-400 mt-1">Actual weight & proof image uploaded</p>
          </div>

          <div className="glass-card p-5 rounded-2xl text-center border-slate-800">
            <div className="w-12 h-12 mx-auto rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold mb-3">
              4
            </div>
            <h4 className="font-bold text-sm text-white">4. Recycling Center</h4>
            <p className="text-xs text-slate-400 mt-1">Material processed into recycled pellets</p>
          </div>

          <div className="glass-card p-5 rounded-2xl text-center border-slate-800">
            <div className="w-12 h-12 mx-auto rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold mb-3">
              5
            </div>
            <h4 className="font-bold text-sm text-white">5. Points & Impact</h4>
            <p className="text-xs text-slate-400 mt-1">Points credited & CO2 metrics updated</p>
          </div>
        </div>
      </section>

      {/* Interactive Impact Calculator */}
      <section className="py-16 px-4 bg-slate-900/60 border-t border-slate-800/80">
        <div className="max-w-4xl mx-auto glass-card p-8 rounded-3xl border-emerald-500/30">
          <div className="flex items-center gap-3 mb-6">
            <TreePine className="w-7 h-7 text-emerald-400" />
            <div>
              <h3 className="text-xl font-bold text-white">Interactive Eco Impact Calculator</h3>
              <p className="text-xs text-slate-400">Estimate your environmental contribution based on EPA WARM standards</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="text-slate-300">Plastic Waste Weight:</span>
                <span className="text-emerald-400 font-bold">{calcKg} KG</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={calcKg}
                onChange={(e) => setCalcKg(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                <p className="text-xs text-slate-400">CO2 Avoided</p>
                <p className="text-lg font-bold text-emerald-400 mt-1">{(calcKg * 1.5).toFixed(1)} kg</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                <p className="text-xs text-slate-400">Energy Saved</p>
                <p className="text-lg font-bold text-teal-400 mt-1">{(calcKg * 5.77).toFixed(1)} kWh</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                <p className="text-xs text-slate-400">Trees Equivalent</p>
                <p className="text-lg font-bold text-amber-400 mt-1">{(calcKg * 0.03).toFixed(2)} trees</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                <p className="text-xs text-slate-400">Est. Reward Points</p>
                <p className="text-lg font-bold text-purple-400 mt-1">{calcKg * 10} pts</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
