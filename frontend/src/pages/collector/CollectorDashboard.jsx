import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Truck, CheckSquare, PackageCheck, Weight, ChevronRight } from 'lucide-react';
import API from '../../services/api';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';

const CollectorDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await API.get('/collector/dashboard');
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <LoadingSpinner message="Loading collector portal..." />;

  const { assignedCount, activeCount, completedCount, totalKgCollected, recentPickups } = data || {};

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-blue-500/30 flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 font-bold text-xs border border-blue-500/30 mb-2">
            🚚 Waste Collector Portal
          </div>
          <h1 className="text-2xl font-extrabold text-white">Pickup Dispatch Center</h1>
          <p className="text-xs text-slate-300 mt-1">Accept assignments, perform weight verification and dispatch waste to recycling plants.</p>
        </div>

        <Link
          to="/collector/pickups"
          className="px-6 py-3 rounded-2xl bg-blue-500 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-xl hover:bg-blue-400 transition-colors"
        >
          View Pickup Queue <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Assigned Pickups" value={assignedCount || 0} icon={Truck} color="blue" description="Awaiting your acceptance" />
        <StatCard title="Active In-Progress" value={activeCount || 0} icon={CheckSquare} color="amber" description="Accepted & verification" />
        <StatCard title="Dispatched / Recycled" value={completedCount || 0} icon={PackageCheck} color="purple" description="Sent to recycling plants" />
        <StatCard title="Total KG Collected" value={`${totalKgCollected || 0} KG`} icon={Weight} color="emerald" description="Verified scale weight" />
      </div>

      <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-white">Assigned Pickup Queue</h3>
          <Link to="/collector/pickups" className="text-xs font-bold text-blue-400 hover:underline">
            Manage All Pickups →
          </Link>
        </div>

        {recentPickups?.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">No assigned pickups in your queue right now.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase">
                  <th className="py-3.5 px-4">Pickup ID</th>
                  <th className="py-3.5 px-4">Citizen</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Est. Weight</th>
                  <th className="py-3.5 px-4">Address</th>
                  <th className="py-3.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs text-slate-200">
                {recentPickups?.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-400">#{p._id.slice(-6).toUpperCase()}</td>
                    <td className="py-3.5 px-4 font-semibold">{p.userId?.name}</td>
                    <td className="py-3.5 px-4">{p.plasticTypeId?.name}</td>
                    <td className="py-3.5 px-4 font-bold text-emerald-400">{p.estimatedWeight} KG</td>
                    <td className="py-3.5 px-4 text-slate-400 truncate max-w-xs">{p.address?.street}, {p.address?.city}</td>
                    <td className="py-3.5 px-4">
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

export default CollectorDashboard;
