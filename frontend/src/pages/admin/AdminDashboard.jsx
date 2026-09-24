import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Users, Truck, Factory, Package, CheckSquare, BarChart3, AlertCircle, ChevronRight } from 'lucide-react';
import API from '../../services/api';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await API.get('/admin/dashboard');
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <LoadingSpinner message="Loading platform admin dashboard..." />;

  const {
    totalUsers,
    totalCollectors,
    totalRecyclers,
    pendingPickups,
    activePickups,
    completedPickups,
    totalPlasticCollected,
    totalPlasticRecycled,
    recyclingRate,
    recentPickups,
  } = data || {};

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-amber-500/30 flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs border border-amber-500/30 mb-2">
            🛡️ Ecosystem Administration
          </div>
          <h1 className="text-2xl font-extrabold text-white">Platform Monitoring & Operations</h1>
          <p className="text-xs text-slate-300 mt-1">Assign collectors, manage platform entities, inspect recycling analytics and reward fulfillment.</p>
        </div>

        <Link
          to="/admin/assign-collectors"
          className="px-6 py-3 rounded-2xl bg-amber-500 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-xl hover:bg-amber-400 transition-colors"
        >
          Assign Collectors ({pendingPickups || 0}) <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {pendingPickups > 0 && (
        <div className="p-4 rounded-2xl bg-amber-950/50 border border-amber-500/40 flex items-center justify-between text-xs text-amber-300 font-semibold">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
            <span>Attention: There are <strong>{pendingPickups} pending pickup requests</strong> requiring collector assignment.</span>
          </div>
          <Link to="/admin/assign-collectors" className="px-4 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400">
            Assign Now
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Registered Citizens" value={totalUsers || 0} icon={Users} color="emerald" description="Platform users" />
        <StatCard title="Active Collectors" value={totalCollectors || 0} icon={Truck} color="blue" description="Logistics agents" />
        <StatCard title="Recycling Plants" value={totalRecyclers || 0} icon={Factory} color="purple" description="Certified recyclers" />
        <StatCard title="Platform Recycling Rate" value={`${recyclingRate || 0}%`} icon={BarChart3} color="amber" description="Collected vs Recycled yield" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title="Pending Requests" value={pendingPickups || 0} icon={Package} color="amber" description="Unassigned pickups" />
        <StatCard title="Active Pickups" value={activePickups || 0} icon={CheckSquare} color="blue" description="In collection pipeline" />
        <StatCard title="Total Recycled Material" value={`${totalPlasticRecycled || 0} KG`} icon={Shield} color="emerald" description="Total recycled weight" />
      </div>

      {/* Recent Activity Table */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-white">Recent Ecosystem Requests</h3>
          <Link to="/admin/pickups" className="text-xs font-bold text-amber-400 hover:underline">
            View All Pickups →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase">
                <th className="py-3.5 px-4">Pickup ID</th>
                <th className="py-3.5 px-4">Citizen</th>
                <th className="py-3.5 px-4">Plastic Category</th>
                <th className="py-3.5 px-4">Assigned Collector</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs text-slate-200">
              {recentPickups?.map((p) => (
                <tr key={p._id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-amber-400">#{p._id.slice(-6).toUpperCase()}</td>
                  <td className="py-3.5 px-4 font-semibold">{p.userId?.name}</td>
                  <td className="py-3.5 px-4">{p.plasticTypeId?.name}</td>
                  <td className="py-3.5 px-4 text-slate-300 font-medium">{p.collectorId?.name || 'Unassigned'}</td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={p.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
