import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Factory, Package, CheckCircle2, AlertTriangle, ChevronRight } from 'lucide-react';
import API from '../../services/api';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';

const RecyclerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await API.get('/recycler/dashboard');
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <LoadingSpinner message="Loading recycling facility portal..." />;

  const { incomingCount, processingCount, completedCount, totalRecycledKg, totalRejectedKg, recentRecords } = data || {};

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-purple-500/30 flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 font-bold text-xs border border-purple-500/30 mb-2">
            🏭 Recycling Plant Facility
          </div>
          <h1 className="text-2xl font-extrabold text-white">Material Processing Control</h1>
          <p className="text-xs text-slate-300 mt-1">Receive incoming shipments, record recycled pellets & credit user reward points.</p>
        </div>

        <Link
          to="/recycler/materials"
          className="px-6 py-3 rounded-2xl bg-purple-500 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-xl hover:bg-purple-400 transition-colors"
        >
          Process Materials Queue <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Incoming Shipments" value={incomingCount || 0} icon={Package} color="purple" description="Awaiting plant intake" />
        <StatCard title="In Sorting & Processing" value={processingCount || 0} icon={Factory} color="amber" description="Active recycling batch" />
        <StatCard title="Total Recycled Pellets" value={`${totalRecycledKg || 0} KG`} icon={CheckCircle2} color="emerald" description="Commercial recycled yield" />
        <StatCard title="Non-Recyclable Rejected" value={`${totalRejectedKg || 0} KG`} icon={AlertTriangle} color="amber" description="Contaminated waste" />
      </div>

      <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-white">Incoming Shipments Queue</h3>
          <Link to="/recycler/materials" className="text-xs font-bold text-purple-400 hover:underline">
            Manage Processing Queue →
          </Link>
        </div>

        {recentRecords?.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">No incoming recycling shipments right now.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase">
                  <th className="py-3.5 px-4">Shipment ID</th>
                  <th className="py-3.5 px-4">Plastic Type</th>
                  <th className="py-3.5 px-4">Received Weight</th>
                  <th className="py-3.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs text-slate-200">
                {recentRecords?.map((r) => (
                  <tr key={r._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-purple-400">#{r._id.slice(-6).toUpperCase()}</td>
                    <td className="py-3.5 px-4 font-semibold">{r.plasticTypeId?.name}</td>
                    <td className="py-3.5 px-4 font-bold text-emerald-400">{r.receivedWeight} KG</td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={r.status} />
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

export default RecyclerDashboard;
