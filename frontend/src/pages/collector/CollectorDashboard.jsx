import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Truck, CheckSquare, PackageCheck, Weight, ChevronRight, ArrowRight } from 'lucide-react';
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

  if (loading) return <LoadingSpinner message="Loading collector dispatch center..." />;

  const { assignedCount, activeCount, completedCount, totalKgCollected, recentPickups } = data || {};

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Hero Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e2e8df] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-1.5 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e8f0ea] text-[#1b4332] font-bold text-xs uppercase tracking-wider mb-1">
            <Truck className="w-3.5 h-3.5 text-[#1b4332]" />
            <span>Waste Collector Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14231b] tracking-tight">Pickup Dispatch Center</h1>
          <p className="text-sm text-[#526458] max-w-xl">
            Accept pending assignments, conduct on-site weight scale verification, and route plastic waste to accredited recyclers.
          </p>
        </div>

        <Link
          to="/collector/pickups"
          className="relative z-10 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-bold text-sm shadow-sm transition whitespace-nowrap"
        >
          <span>View Pickup Queue</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Assigned Pickups" value={assignedCount || 0} icon={Truck} color="blue" description="Awaiting your acceptance" />
        <StatCard title="Active In-Progress" value={activeCount || 0} icon={CheckSquare} color="amber" description="Accepted & verification" />
        <StatCard title="Dispatched / Recycled" value={completedCount || 0} icon={PackageCheck} color="purple" description="Sent to recycling plants" />
        <StatCard title="Total KG Collected" value={`${totalKgCollected || 0} KG`} icon={Weight} color="emerald" description="Verified scale weight" />
      </div>

      {/* Recent Assigned Pickups Table */}
      <div className="bg-white rounded-3xl border border-[#e2e8df] shadow-sm overflow-hidden space-y-0">
        <div className="p-6 border-b border-[#edf2ec] flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-[#14231b]">Assigned Pickup Queue</h3>
            <p className="text-xs text-[#718477] mt-0.5">Most recent assignments pending or in active transit</p>
          </div>
          <Link to="/collector/pickups" className="text-xs font-bold text-[#1b4332] hover:text-[#2d6a4f] flex items-center gap-1 hover:underline">
            <span>Manage All Pickups</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentPickups?.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="w-12 h-12 rounded-full bg-[#e8f0ea] flex items-center justify-center mx-auto mb-3 text-[#1b4332]">
              <Truck className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-[#14231b]">No assigned pickups in your queue right now</p>
            <p className="text-xs text-[#718477] mt-1">New citizen pickup requests will show up here once allocated by dispatchers.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#edf2ec] text-[11px] font-bold text-[#718477] uppercase bg-[#fbfbf9]">
                  <th className="py-3.5 px-6">Pickup ID</th>
                  <th className="py-3.5 px-6">Citizen</th>
                  <th className="py-3.5 px-6">Category</th>
                  <th className="py-3.5 px-6">Est. Weight</th>
                  <th className="py-3.5 px-6">Address</th>
                  <th className="py-3.5 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#edf2ec] text-xs text-[#14231b]">
                {recentPickups?.map((p) => (
                  <tr key={p._id} className="hover:bg-[#fbfbf9] transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-[#1b4332]">#{p._id.slice(-6).toUpperCase()}</td>
                    <td className="py-4 px-6 font-semibold text-[#14231b]">{p.userId?.name || 'Citizen'}</td>
                    <td className="py-4 px-6 text-[#526458] font-medium">{p.plasticTypeId?.name || 'Mixed Plastic'}</td>
                    <td className="py-4 px-6 font-bold text-[#1b4332]">{p.estimatedWeight} KG</td>
                    <td className="py-4 px-6 text-[#526458] truncate max-w-xs">{p.address?.street}, {p.address?.city}</td>
                    <td className="py-4 px-6">
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
