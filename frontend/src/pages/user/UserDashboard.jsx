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
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import StatCard from '../../components/StatCard';
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

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-emerald-500/30 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs border border-emerald-500/30">
            🌱 Citizen Eco Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Hello, <span className="eco-gradient-text">{user?.name}</span>!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Your plastic recycling contributions have avoided <strong className="text-emerald-400">{impact?.co2AvoidedKg || 0} kg CO2</strong> emissions and saved <strong className="text-teal-400">{impact?.energySavedKwh || 0} kWh</strong> energy.
          </p>
        </div>

        <Link
          to="/request-pickup"
          className="z-10 px-6 py-3.5 rounded-2xl eco-button-gradient text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-xl shrink-0 hover:scale-105 transition-transform"
        >
          <PlusCircle className="w-4 h-4" /> Request Waste Pickup
        </Link>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Available Points" value={`${points || 0} PTS`} icon={Award} color="amber" description="Redeemable for vouchers" />
        <StatCard title="Total Plastic Recycled" value={`${totalPlasticRecycled || 0} KG`} icon={RefreshCw} color="emerald" description="Verified by recycling plant" />
        <StatCard title="Total Collected" value={`${totalPlasticCollected || 0} KG`} icon={Truck} color="blue" description="Picked up by collectors" />
        <StatCard title="Completed Pickups" value={completedPickups || 0} icon={CheckCircle2} color="purple" description="Successful recycling cycles" />
      </div>

      {/* Active Pickup Live Tracker */}
      {activePickup && (
        <div className="glass-card p-6 rounded-3xl border border-emerald-500/40 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                <Truck className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Active Pickup Request Tracker</h3>
                <p className="text-xs text-slate-400">Pickup #{activePickup._id.slice(-6).toUpperCase()} • {activePickup.plasticTypeId?.name}</p>
              </div>
            </div>
            <StatusBadge status={activePickup.status} />
          </div>

          {/* Workflow Progress Bar */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-[11px] font-bold text-slate-400">
              <span>Submitted</span>
              <span>Collector Assigned</span>
              <span>Collected</span>
              <span>Recycled & Credited</span>
            </div>
            <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-300 rounded-full transition-all duration-700 shadow-[0_0_12px_#22c55e]"
                style={{ width: `${Math.max(15, ((getStepIndex(activePickup.status) + 1) / workflowSteps.length) * 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-300 mt-2">
              <strong>Current Status Note:</strong> {activePickup.status === 'PENDING' && 'Waiting for admin to assign a waste collector.'}
              {activePickup.status === 'ASSIGNED' && `Assigned to collector ${activePickup.collectorId?.name || ''}.`}
              {activePickup.status === 'ACCEPTED' && 'Collector accepted request and is on the way.'}
              {activePickup.status === 'PICKED_UP' && 'Material picked up! Collector is verifying weight.'}
              {activePickup.status === 'VERIFIED' && `Weight verified (${activePickup.actualWeight || activePickup.estimatedWeight} kg). Preparing shipment to recycling center.`}
              {activePickup.status === 'SENT_TO_RECYCLER' && 'Material in transit to recycling plant.'}
              {activePickup.status === 'PROCESSING' && 'Recycling plant is processing and sorting the plastic.'}
            </p>
          </div>
        </div>
      )}

      {/* Environmental Impact Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <TreePine className="w-5 h-5 text-emerald-400" /> Environmental Impact Contributions
            </h3>
            <Link to="/impact" className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1">
              View Detailed Metrics <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <p className="text-xs text-slate-400">CO2 Avoided</p>
              <h4 className="text-xl font-bold text-emerald-400 mt-1">{impact?.co2AvoidedKg || 0} kg</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">Carbon footprint reduced</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <p className="text-xs text-slate-400">Energy Saved</p>
              <h4 className="text-xl font-bold text-teal-400 mt-1">{impact?.energySavedKwh || 0} kWh</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">Grid power preserved</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <p className="text-xs text-slate-400">Landfill Saved</p>
              <h4 className="text-xl font-bold text-blue-400 mt-1">{impact?.landfillSavedM3 || 0} m³</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">Diverted from dumps</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <p className="text-xs text-slate-400">Trees Equivalent</p>
              <h4 className="text-xl font-bold text-amber-400 mt-1">{impact?.treesEquivalent || 0}</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">Trees planted impact</p>
            </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" /> Quick Eco Actions
            </h3>
            <p className="text-xs text-slate-400 mt-1">Earn points by submitting recyclable waste.</p>
          </div>

          <div className="space-y-3">
            <Link
              to="/request-pickup"
              className="w-full py-3 px-4 rounded-xl eco-button-gradient text-slate-950 font-bold text-xs flex items-center justify-between"
            >
              <span>Request Waste Pickup</span>
              <PlusCircle className="w-4 h-4" />
            </Link>

            <Link
              to="/rewards"
              className="w-full py-3 px-4 rounded-xl glass-card text-white hover:border-emerald-500/40 font-bold text-xs flex items-center justify-between transition-colors"
            >
              <span>Redeem Reward Vouchers</span>
              <Award className="w-4 h-4 text-amber-400" />
            </Link>

            <Link
              to="/leaderboard"
              className="w-full py-3 px-4 rounded-xl glass-card text-white hover:border-emerald-500/40 font-bold text-xs flex items-center justify-between transition-colors"
            >
              <span>View Leaderboard Rankings</span>
              <ChevronRight className="w-4 h-4 text-emerald-400" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Pickup History Table */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-white">Recent Pickup Activity</h3>
          <Link to="/my-pickups" className="text-xs font-bold text-emerald-400 hover:underline">
            View All Pickups →
          </Link>
        </div>

        {recentPickups?.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">No pickup requests created yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase">
                  <th className="py-3 px-4">Pickup ID</th>
                  <th className="py-3 px-4">Plastic Category</th>
                  <th className="py-3 px-4">Est. / Verified Weight</th>
                  <th className="py-3 px-4">Preferred Date</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs text-slate-200">
                {recentPickups?.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-emerald-400">#{p._id.slice(-6).toUpperCase()}</td>
                    <td className="py-3 px-4 font-semibold">{p.plasticTypeId?.name}</td>
                    <td className="py-3 px-4 font-bold">{p.actualWeight > 0 ? `${p.actualWeight} KG` : `${p.estimatedWeight} KG (Est.)`}</td>
                    <td className="py-3 px-4 text-slate-400">{new Date(p.preferredDate).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={p.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
