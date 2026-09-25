import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  RefreshCw,
  Truck,
  CheckCircle2,
  TreePine,
  ArrowRight,
  PlusCircle,
  Clock,
  ChevronRight,
  Zap,
  Sparkles,
  Calendar,
  Gift,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';

const UserDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await API.get('/user/dashboard');
        setDashboardData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <LoadingSpinner message="Loading your eco dashboard..." />;

  const { points, totalPlasticCollected, totalPlasticRecycled, completedPickups, activePickup, recentPickups, impact } =
    dashboardData || {};

  const workflowSteps = ['PENDING', 'ASSIGNED', 'ACCEPTED', 'PICKED_UP', 'VERIFIED', 'SENT_TO_RECYCLER', 'PROCESSING', 'RECYCLED'];
  const getStepIndex = (status) => workflowSteps.indexOf(status);

  // Community Milestone Target (e.g. Next tier at 50kg, 100kg, 200kg)
  const recycledKg = totalPlasticRecycled || 0;
  const nextMilestoneKg = recycledKg < 25 ? 25 : recycledKg < 50 ? 50 : recycledKg < 100 ? 100 : Math.ceil(recycledKg / 100) * 100;
  const progressPercent = Math.min(100, Math.round((recycledKg / nextMilestoneKg) * 100));

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* 1. Large Editorial Welcome & Impact Hero */}
      <div className="bg-white rounded-3xl border border-[#e2e8df] p-6 sm:p-10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#f0f7f2] rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#edf6f0] border border-[#cbe3d3] text-[#1b4332] text-xs font-bold">
              <span>🌱</span> Citizen Sustainability Portal
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#14231b] tracking-tight leading-tight">
              Good day, <span className="text-[#2d6a4f]">{user?.name}</span>
            </h1>
            <p className="text-base sm:text-lg text-[#4a5c50] leading-relaxed">
              You've helped keep <strong className="text-[#1b4332] font-black">{totalPlasticRecycled || 0} kg</strong> of plastic in the recycling cycle.
            </p>

            {/* Visual Progress Bar Toward Next Milestone */}
            <div className="pt-2 max-w-lg space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-[#65776b]">Progress to {nextMilestoneKg} KG Milestone</span>
                <span className="text-[#1b4332]">{progressPercent}%</span>
              </div>
              <div className="w-full h-3 bg-[#eef3ef] rounded-full overflow-hidden p-0.5 border border-[#d8e4db]">
                <div
                  className="h-full bg-[#1b4332] rounded-full transition-all duration-700"
                  style={{ width: `${Math.max(8, progressPercent)}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-[#718477]">
                {Math.max(0, nextMilestoneKg - recycledKg).toFixed(1)} kg more to unlock the next community sustainability badge.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <Link
              to="/request-pickup"
              className="px-6 py-4 rounded-2xl eco-btn-primary text-xs font-bold flex items-center justify-center gap-2 shadow-sm text-center"
            >
              <PlusCircle className="w-4 h-4" /> Request Waste Pickup
            </Link>
            <Link
              to="/rewards"
              className="px-6 py-3.5 rounded-2xl eco-btn-secondary text-xs font-bold flex items-center justify-center gap-2 text-center"
            >
              <Gift className="w-4 h-4 text-[#2d6a4f]" /> Browse Rewards ({points || 0} pts)
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Horizontal Metrics Strip (Non-card-grid hierarchy) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8df] shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#fefce8] text-[#92400e] flex items-center justify-center border border-[#fef08a] shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#6a7d71] uppercase tracking-wider block">Wallet Balance</span>
            <span className="text-xl font-extrabold text-[#14231b]">{points || 0} PTS</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e2e8df] shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#edf6f0] text-[#1b4332] flex items-center justify-center border border-[#cbe3d3] shrink-0">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#6a7d71] uppercase tracking-wider block">Recycled Yield</span>
            <span className="text-xl font-extrabold text-[#14231b]">{totalPlasticRecycled || 0} KG</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e2e8df] shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#f0f9ff] text-[#0369a1] flex items-center justify-center border border-[#bae6fd] shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#6a7d71] uppercase tracking-wider block">Total Picked Up</span>
            <span className="text-xl font-extrabold text-[#14231b]">{totalPlasticCollected || 0} KG</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e2e8df] shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#faf5ff] text-[#6b21a8] flex items-center justify-center border border-[#e9d5ff] shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#6a7d71] uppercase tracking-wider block">Completed Cycles</span>
            <span className="text-xl font-extrabold text-[#14231b]">{completedPickups || 0}</span>
          </div>
        </div>
      </div>

      {/* 3. Active Pickup Live Journey Tracker (Visual Journey) */}
      {activePickup && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#b8dfc4] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#edf2ec] pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-[#edf6f0] text-[#1b4332] border border-[#cbe3d3]">
                <Truck className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-[#2d6a4f] uppercase tracking-widest block">
                  Live Collection Journey
                </span>
                <h3 className="font-extrabold text-base text-[#14231b]">
                  Pickup #{activePickup._id.slice(-6).toUpperCase()} • {activePickup.plasticTypeId?.name}
                </h3>
              </div>
            </div>
            <StatusBadge status={activePickup.status} />
          </div>

          {/* Visual Step Journey */}
          <div className="space-y-3">
            <div className="grid grid-cols-4 text-center text-xs font-bold text-[#5c6f62]">
              <span className={getStepIndex(activePickup.status) >= 0 ? 'text-[#1b4332]' : ''}>1. Request Placed</span>
              <span className={getStepIndex(activePickup.status) >= 1 ? 'text-[#1b4332]' : ''}>2. Collector Dispatched</span>
              <span className={getStepIndex(activePickup.status) >= 3 ? 'text-[#1b4332]' : ''}>3. Weight Verified</span>
              <span className={getStepIndex(activePickup.status) >= 6 ? 'text-[#1b4332]' : ''}>4. Recycled & Paid</span>
            </div>

            <div className="w-full h-3 bg-[#eef3ef] rounded-full overflow-hidden p-0.5 border border-[#d8e4db]">
              <div
                className="h-full bg-[#1b4332] rounded-full transition-all duration-700"
                style={{ width: `${Math.max(12, ((getStepIndex(activePickup.status) + 1) / workflowSteps.length) * 100)}%` }}
              ></div>
            </div>

            <div className="p-4 rounded-2xl bg-[#f7faf8] border border-[#e2ebe4] text-xs text-[#3b4c40]">
              <strong className="text-[#14231b]">Live Status Note: </strong>
              {activePickup.status === 'PENDING' && 'Your request is in queue. Platform admin is assigning a local collector.'}
              {activePickup.status === 'ASSIGNED' && `Assigned to collector ${activePickup.collectorId?.name || ''}. Waiting for acceptance.`}
              {activePickup.status === 'ACCEPTED' && 'Collector accepted your request and is en route according to schedule.'}
              {activePickup.status === 'PICKED_UP' && 'Waste material has been picked up. Digital scale weight verification in progress.'}
              {activePickup.status === 'VERIFIED' && `Scale weight verified (${activePickup.actualWeight || activePickup.estimatedWeight} kg). Shipment ready for processing plant.`}
              {activePickup.status === 'SENT_TO_RECYCLER' && 'Material is currently in transit to certified recycling plant.'}
              {activePickup.status === 'PROCESSING' && 'Plant is mechanically sorting and shredding the plastic.'}
              {activePickup.status === 'RECYCLED' && 'Recycling completed! Points credited to your account.'}
            </div>
          </div>
        </div>
      )}

      {/* 4. Asymmetric Layout: Recent Activity (Left) + Eco Contributions & Quick Actions (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Pickup Activity */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-[#e2e8df] shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-[#edf2ec] pb-4">
            <div>
              <h3 className="font-extrabold text-lg text-[#14231b] tracking-tight">Recent Pickup Activity</h3>
              <p className="text-xs text-[#6a7d71] mt-0.5">Your submitted plastic waste dispatches</p>
            </div>
            <Link to="/my-pickups" className="text-xs font-bold text-[#1b4332] hover:underline flex items-center gap-1">
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentPickups?.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <p className="text-xs text-[#6e8074]">You haven't requested any waste pickups yet.</p>
              <Link to="/request-pickup" className="inline-flex px-4 py-2 rounded-xl eco-btn-primary text-xs font-bold">
                Request Your First Pickup
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentPickups?.slice(0, 4).map((p) => (
                <div
                  key={p._id}
                  className="p-4 rounded-2xl bg-[#fafbfa] hover:bg-[#f3f7f4] border border-[#e4ebe4] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-extrabold text-xs text-[#1b4332]">
                        #{p._id.slice(-6).toUpperCase()}
                      </span>
                      <span className="text-xs font-bold text-[#14231b]">{p.plasticTypeId?.name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[#6a7d71]">
                      <span className="font-semibold text-[#1b4332]">
                        {p.actualWeight > 0 ? `${p.actualWeight} KG (Verified)` : `${p.estimatedWeight} KG (Est.)`}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#92a398]" />
                        {new Date(p.preferredDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={p.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Environmental Impact Summary & Quick Actions */}
        <div className="lg:col-span-5 space-y-6">
          {/* Eco Impact Box */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#e2e8df] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-[#14231b] flex items-center gap-2">
                <TreePine className="w-5 h-5 text-[#2d6a4f]" /> Environmental Contribution
              </h3>
              <Link to="/impact" className="text-xs font-bold text-[#1b4332] hover:underline">
                Details →
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-4 rounded-2xl bg-[#edf6f0] border border-[#cbe3d3] text-center">
                <span className="text-[10px] font-bold text-[#55695b] uppercase tracking-wider block">CO2 Avoided</span>
                <p className="text-xl font-black text-[#1b4332] mt-1">{impact?.co2AvoidedKg || 0} kg</p>
                <span className="text-[10px] text-[#6b7f71]">Carbon footprint offset</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#f0fdfa] border border-[#99f6e4] text-center">
                <span className="text-[10px] font-bold text-[#0f766e] uppercase tracking-wider block">Energy Saved</span>
                <p className="text-xl font-black text-[#0f766e] mt-1">{impact?.energySavedKwh || 0} kWh</p>
                <span className="text-[10px] text-[#115e59]">Grid power preserved</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#fefce8] border border-[#fde68a] text-center">
                <span className="text-[10px] font-bold text-[#92400e] uppercase tracking-wider block">Trees Equivalent</span>
                <p className="text-xl font-black text-[#92400e] mt-1">{impact?.treesEquivalent || 0}</p>
                <span className="text-[10px] text-[#78350f]">Urban saplings offset</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#f0f9ff] border border-[#bae6fd] text-center">
                <span className="text-[10px] font-bold text-[#0369a1] uppercase tracking-wider block">Landfill Saved</span>
                <p className="text-xl font-black text-[#0369a1] mt-1">{impact?.landfillSavedM3 || 0} m³</p>
                <span className="text-[10px] text-[#075985]">Diverted waste dump</span>
              </div>
            </div>
          </div>

          {/* Quick Eco Actions */}
          <div className="bg-[#f5f8f5] p-6 rounded-3xl border border-[#dce6df] space-y-3">
            <span className="text-[11px] font-extrabold text-[#1b4332] uppercase tracking-wider block">
              Quick Actions
            </span>
            <Link
              to="/request-pickup"
              className="w-full py-3 px-4 rounded-xl bg-white hover:bg-[#edf5f0] border border-[#d6e3d9] text-[#14231b] font-bold text-xs flex items-center justify-between transition-colors shadow-sm"
            >
              <span>Schedule Next Pickup</span>
              <PlusCircle className="w-4 h-4 text-[#1b4332]" />
            </Link>
            <Link
              to="/rewards"
              className="w-full py-3 px-4 rounded-xl bg-white hover:bg-[#edf5f0] border border-[#d6e3d9] text-[#14231b] font-bold text-xs flex items-center justify-between transition-colors shadow-sm"
            >
              <span>Redeem Vouchers ({points || 0} PTS)</span>
              <Gift className="w-4 h-4 text-[#92400e]" />
            </Link>
            <Link
              to="/leaderboard"
              className="w-full py-3 px-4 rounded-xl bg-white hover:bg-[#edf5f0] border border-[#d6e3d9] text-[#14231b] font-bold text-xs flex items-center justify-between transition-colors shadow-sm"
            >
              <span>View Community Leaderboard</span>
              <ChevronRight className="w-4 h-4 text-[#1b4332]" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
