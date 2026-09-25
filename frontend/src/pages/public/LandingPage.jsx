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
  CheckCircle2,
  Users,
  Layers,
  ArrowDown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const LandingPage = () => {
  const { user, demoLogin } = useAuth();
  const navigate = useNavigate();
  const [calcKg, setCalcKg] = useState(15);

  const handleDemoAccess = async (role) => {
    await demoLogin(role);
    if (role === 'ADMIN') navigate('/admin/dashboard');
    else if (role === 'COLLECTOR') navigate('/collector/dashboard');
    else if (role === 'RECYCLER') navigate('/recycler/dashboard');
    else navigate('/dashboard');
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#fbfbf9] text-[#1c241f] flex flex-col selection:bg-[#1b4332] selection:text-white">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 px-4 sm:px-8 max-w-7xl mx-auto text-center overflow-hidden">
        {/* Soft Organic Background Accents */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[34rem] h-[34rem] bg-[#edf6f0]/80 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute top-1/3 right-10 w-72 h-72 bg-[#f4f7eb]/70 rounded-full blur-2xl pointer-events-none -z-10"></div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#edf6f0] border border-[#cbe3d3] text-[#1b4332] text-xs font-bold mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#2d6a4f]" />
          <span>Circular Economy Platform for Plastic Waste</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.1] text-[#14231b]">
          Give Plastic a <span className="text-[#2d6a4f] underline decoration-[#a3d2af] decoration-wavy decoration-2">Second Life.</span>
        </h1>

        <p className="mt-6 text-base sm:text-xl text-[#526458] max-w-2xl mx-auto leading-relaxed font-normal">
          Connect your plastic waste with responsible collection and recycling — and see the transparent environmental impact you create every step of the way.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <Link
            to={user ? '/dashboard' : '/register'}
            className="px-8 py-4 rounded-2xl eco-btn-primary font-bold text-sm flex items-center gap-2.5 shadow-md hover:scale-[1.02] transition-transform"
          >
            <span>{user ? 'Go to My Dashboard' : 'Start Recycling'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="px-7 py-4 rounded-2xl eco-btn-secondary text-sm font-bold flex items-center gap-2 transition-all"
          >
            <span>Explore How It Works</span>
            <ArrowDown className="w-4 h-4 text-[#2d6a4f]" />
          </button>
        </div>

        {/* Live Ecosystem Impact Horizontal Strip */}
        <div className="mt-16 sm:mt-20 max-w-5xl mx-auto bg-white rounded-3xl border border-[#e2e8df] p-6 sm:p-8 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left divide-y sm:divide-y-0 sm:divide-x divide-[#edf2ec]">
            <div className="pt-4 sm:pt-0 sm:px-4">
              <span className="text-[11px] font-bold text-[#6a7d71] uppercase tracking-wider block">Total Recycled</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1b4332] mt-1">1,250+ KG</h3>
              <p className="text-xs text-[#7d8f83] mt-0.5 font-medium">Verified plastic waste weight</p>
            </div>
            <div className="pt-4 sm:pt-0 sm:px-4">
              <span className="text-[11px] font-bold text-[#6a7d71] uppercase tracking-wider block">CO2 Avoided</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#2d6a4f] mt-1">1,875 KG</h3>
              <p className="text-xs text-[#7d8f83] mt-0.5 font-medium">Calculated EPA WARM metrics</p>
            </div>
            <div className="pt-4 sm:pt-0 sm:px-4">
              <span className="text-[11px] font-bold text-[#6a7d71] uppercase tracking-wider block">Reward Points</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#92400e] mt-1">15,000+</h3>
              <p className="text-xs text-[#7d8f83] mt-0.5 font-medium">Credited to recycling citizens</p>
            </div>
            <div className="pt-4 sm:pt-0 sm:px-4">
              <span className="text-[11px] font-bold text-[#6a7d71] uppercase tracking-wider block">Active Partners</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#14231b] mt-1">100%</h3>
              <p className="text-xs text-[#7d8f83] mt-0.5 font-medium">Certified collectors & plants</p>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Journey: How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-8 bg-[#f4f7f4] border-y border-[#e2e8df]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-extrabold text-[#1b4332] uppercase tracking-widest bg-[#e2ede5] px-3 py-1 rounded-full border border-[#cadbc5]">
              Transparent Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#14231b] mt-3 tracking-tight">
              A 5-Stage Circular Recycling Journey
            </h2>
            <p className="text-sm text-[#54665a] mt-2 leading-relaxed">
              Every kilogram of plastic is tracked from your doorstep to secondary raw material pelletization.
            </p>
          </div>

          {/* Interactive Step Strip */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            <div className="bg-white p-6 rounded-2xl border border-[#e2e8df] shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-extrabold text-[#1b4332] bg-[#edf6f0] px-2.5 py-1 rounded-md">
                  01
                </span>
                <h4 className="font-extrabold text-sm text-[#14231b] mt-4 uppercase tracking-wider">Submit Request</h4>
                <p className="text-xs text-[#5f7166] mt-2 leading-relaxed">
                  Select plastic resin type (PET, HDPE, PP), approximate weight, and your preferred collection time.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#edf2ec] text-[11px] font-bold text-[#2d6a4f] flex items-center gap-1">
                <span>Citizen Portal</span> →
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#e2e8df] shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-extrabold text-[#0369a1] bg-[#f0f9ff] px-2.5 py-1 rounded-md">
                  02
                </span>
                <h4 className="font-extrabold text-sm text-[#14231b] mt-4 uppercase tracking-wider">Collect & Route</h4>
                <p className="text-xs text-[#5f7166] mt-2 leading-relaxed">
                  An authorized waste collector receives the route dispatch, arrives on schedule, and collects the material.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#edf2ec] text-[11px] font-bold text-[#0369a1] flex items-center gap-1">
                <span>Verified Logistics</span> →
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#e2e8df] shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-extrabold text-[#0f766e] bg-[#f0fdfa] px-2.5 py-1 rounded-md">
                  03
                </span>
                <h4 className="font-extrabold text-sm text-[#14231b] mt-4 uppercase tracking-wider">Scale Verification</h4>
                <p className="text-xs text-[#5f7166] mt-2 leading-relaxed">
                  Physical weight is verified with portable digital scales and photographic audit proof is logged.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#edf2ec] text-[11px] font-bold text-[#0f766e] flex items-center gap-1">
                <span>Weight Audit</span> →
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#e2e8df] shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-extrabold text-[#6b21a8] bg-[#faf5ff] px-2.5 py-1 rounded-md">
                  04
                </span>
                <h4 className="font-extrabold text-sm text-[#14231b] mt-4 uppercase tracking-wider">Process & Recycle</h4>
                <p className="text-xs text-[#5f7166] mt-2 leading-relaxed">
                  Certified recycling plants sort, shred, clean, and mechanically reprocess plastic into high-grade pellets.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#edf2ec] text-[11px] font-bold text-[#6b21a8] flex items-center gap-1">
                <span>Pellet Processing</span> →
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#e2e8df] shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-extrabold text-[#92400e] bg-[#fefce8] px-2.5 py-1 rounded-md">
                  05
                </span>
                <h4 className="font-extrabold text-sm text-[#14231b] mt-4 uppercase tracking-wider">Points & Impact</h4>
                <p className="text-xs text-[#5f7166] mt-2 leading-relaxed">
                  Reward points are deposited directly into your wallet and verified carbon offset metrics update immediately.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#edf2ec] text-[11px] font-bold text-[#92400e] flex items-center gap-1">
                <span>Points + CO2 Credit</span> ✓
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stakeholder 1-Click Demo Logins */}
      <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-extrabold text-[#1b4332] uppercase tracking-widest bg-[#edf6f0] px-3 py-1 rounded-full border border-[#cadbc5]">
            Experience All Stakeholders
          </span>
          <h2 className="text-3xl font-extrabold text-[#14231b] mt-3 tracking-tight">Instant Demo Experience</h2>
          <p className="text-sm text-[#54665a] mt-2">
            Switch between all 4 platform roles instantly to evaluate the end-to-end circular workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-[#e2e8df] shadow-sm hover:border-[#b8cfbf] transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#edf6f0] text-[#1b4332] flex items-center justify-center font-bold text-lg mb-4 border border-[#cbe3d3]">
                👤
              </div>
              <h3 className="font-bold text-base text-[#14231b]">Citizen / User</h3>
              <p className="text-xs text-[#586a5f] mt-2 leading-relaxed">
                Request doorstep collection, track recycling stages, view verified environmental metrics, and redeem reward gift cards.
              </p>
            </div>
            <button
              onClick={() => handleDemoAccess('USER')}
              className="mt-6 py-3 w-full rounded-xl bg-[#edf6f0] hover:bg-[#1b4332] text-[#1b4332] hover:text-white font-bold text-xs transition-colors border border-[#cbe3d3]"
            >
              Explore as Citizen →
            </button>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#e2e8df] shadow-sm hover:border-[#b8cfbf] transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#f0f9ff] text-[#0369a1] flex items-center justify-center font-bold text-lg mb-4 border border-[#bae6fd]">
                🚚
              </div>
              <h3 className="font-bold text-base text-[#14231b]">Collector</h3>
              <p className="text-xs text-[#586a5f] mt-2 leading-relaxed">
                Receive pickup route assignments, navigate to citizen locations, record digital scale weights, and dispatch to plants.
              </p>
            </div>
            <button
              onClick={() => handleDemoAccess('COLLECTOR')}
              className="mt-6 py-3 w-full rounded-xl bg-[#f0f9ff] hover:bg-[#0369a1] text-[#0369a1] hover:text-white font-bold text-xs transition-colors border border-[#bae6fd]"
            >
              Explore as Collector →
            </button>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#e2e8df] shadow-sm hover:border-[#b8cfbf] transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#faf5ff] text-[#6b21a8] flex items-center justify-center font-bold text-lg mb-4 border border-[#e9d5ff]">
                🏭
              </div>
              <h3 className="font-bold text-base text-[#14231b]">Recycling Facility</h3>
              <p className="text-xs text-[#586a5f] mt-2 leading-relaxed">
                Accept incoming truck shipments, log processed pellet yields and rejected contaminants, and trigger automated reward payouts.
              </p>
            </div>
            <button
              onClick={() => handleDemoAccess('RECYCLER')}
              className="mt-6 py-3 w-full rounded-xl bg-[#faf5ff] hover:bg-[#6b21a8] text-[#6b21a8] hover:text-white font-bold text-xs transition-colors border border-[#e9d5ff]"
            >
              Explore as Recycler →
            </button>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#e2e8df] shadow-sm hover:border-[#b8cfbf] transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#fefce8] text-[#92400e] flex items-center justify-center font-bold text-lg mb-4 border border-[#fde68a]">
                🛡️
              </div>
              <h3 className="font-bold text-base text-[#14231b]">Platform Admin</h3>
              <p className="text-xs text-[#586a5f] mt-2 leading-relaxed">
                Dispatch and reassign collectors, audit live user accounts, manage plastic pricing rates, and monitor ecosystem analytics.
              </p>
            </div>
            <button
              onClick={() => handleDemoAccess('ADMIN')}
              className="mt-6 py-3 w-full rounded-xl bg-[#fefce8] hover:bg-[#92400e] text-[#92400e] hover:text-white font-bold text-xs transition-colors border border-[#fde68a]"
            >
              Explore as Admin →
            </button>
          </div>
        </div>
      </section>

      {/* Interactive Eco Impact Calculator */}
      <section className="py-20 px-4 sm:px-8 bg-[#f5f8f5] border-t border-[#e2e8df]">
        <div className="max-w-4xl mx-auto bg-white p-8 sm:p-10 rounded-3xl border border-[#dbe6dc] shadow-sm">
          <div className="flex items-center gap-3.5 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-[#edf6f0] text-[#1b4332] flex items-center justify-center border border-[#cbe3d3]">
              <TreePine className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#14231b] tracking-tight">
                Interactive Eco Impact Calculator
              </h3>
              <p className="text-xs text-[#5c6e62]">
                Estimate your household or business environmental savings based on EPA WARM lifecycle coefficients.
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-[#f8faf8] p-5 rounded-2xl border border-[#e4ebe4]">
              <div className="flex justify-between items-center text-xs font-bold mb-3">
                <span className="text-[#3b4b41] uppercase tracking-wider">Plastic Waste Diverted:</span>
                <span className="text-xl font-extrabold text-[#1b4332] bg-white px-3 py-1 rounded-xl border border-[#cde0d2] shadow-sm">
                  {calcKg} KG
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={calcKg}
                onChange={(e) => setCalcKg(Number(e.target.value))}
                className="w-full h-2.5 bg-[#dbe6dc] rounded-lg appearance-none cursor-pointer accent-[#1b4332]"
              />
              <div className="flex justify-between text-[11px] text-[#788a7e] font-semibold mt-2">
                <span>1 KG</span>
                <span>50 KG</span>
                <span>100 KG</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-[#edf6f0] border border-[#cbe3d3] text-center">
                <span className="text-[11px] font-bold text-[#445b4b] uppercase tracking-wider">CO2 Avoided</span>
                <p className="text-2xl font-extrabold text-[#1b4332] mt-1.5">{(calcKg * 1.5).toFixed(1)} kg</p>
                <p className="text-[10px] text-[#5c6f62] mt-1 font-medium">Reduced carbon footprint</p>
              </div>
              <div className="p-5 rounded-2xl bg-[#f0fdfa] border border-[#99f6e4] text-center">
                <span className="text-[11px] font-bold text-[#0f766e] uppercase tracking-wider">Energy Saved</span>
                <p className="text-2xl font-extrabold text-[#0f766e] mt-1.5">{(calcKg * 5.77).toFixed(1)} kWh</p>
                <p className="text-[10px] text-[#115e59] mt-1 font-medium">Conserved power grid</p>
              </div>
              <div className="p-5 rounded-2xl bg-[#fefce8] border border-[#fde68a] text-center">
                <span className="text-[11px] font-bold text-[#92400e] uppercase tracking-wider">Trees Equivalent</span>
                <p className="text-2xl font-extrabold text-[#92400e] mt-1.5">{(calcKg * 0.03).toFixed(2)} trees</p>
                <p className="text-[10px] text-[#78350f] mt-1 font-medium">Urban forest offset</p>
              </div>
              <div className="p-5 rounded-2xl bg-[#faf5ff] border border-[#e9d5ff] text-center">
                <span className="text-[11px] font-bold text-[#6b21a8] uppercase tracking-wider">Reward Points</span>
                <p className="text-2xl font-extrabold text-[#6b21a8] mt-1.5">+{calcKg * 10} pts</p>
                <p className="text-[10px] text-[#581c87] mt-1 font-medium">Redeemable for vouchers</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
