import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Factory, Package, CheckCircle2, AlertTriangle, ChevronRight, ArrowRight } from 'lucide-react';
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
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Hero Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e2e8df] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-1.5 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e8f0ea] text-[#1b4332] font-bold text-xs uppercase tracking-wider mb-1">
            <Factory className="w-3.5 h-3.5 text-[#1b4332]" />
            <span>Recycling Plant Facility</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14231b] tracking-tight">Material Processing Control</h1>
          <p className="text-sm text-[#526458] max-w-xl">
            Receive incoming collector shipments, record recycled plastic pellets & credit citizen reward points upon batch completion.
          </p>
        </div>

        <Link
          to="/recycler/materials"
          className="relative z-10 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-bold text-sm shadow-sm transition whitespace-nowrap"
        >
          <span>Process Materials Queue</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Incoming Shipments" value={incomingCount || 0} icon={Package} color="purple" description="Awaiting plant intake" />
        <StatCard title="In Sorting & Processing" value={processingCount || 0} icon={Factory} color="amber" description="Active recycling batch" />
        <StatCard title="Total Recycled Pellets" value={`${totalRecycledKg || 0} KG`} icon={CheckCircle2} color="emerald" description="Commercial recycled yield" />
        <StatCard title="Non-Recyclable Rejected" value={`${totalRejectedKg || 0} KG`} icon={AlertTriangle} color="amber" description="Contaminated waste" />
      </div>

      {/* Incoming Queue Table */}
      <div className="bg-white rounded-3xl border border-[#e2e8df] shadow-sm overflow-hidden space-y-0">
        <div className="p-6 border-b border-[#edf2ec] flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-[#14231b]">Incoming Shipments Queue</h3>
            <p className="text-xs text-[#718477] mt-0.5">Shipments received from certified collectors ready for recycling</p>
          </div>
          <Link to="/recycler/materials" className="text-xs font-bold text-[#1b4332] hover:text-[#2d6a4f] flex items-center gap-1 hover:underline">
            <span>Manage Processing Queue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentRecords?.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="w-12 h-12 rounded-full bg-[#e8f0ea] flex items-center justify-center mx-auto mb-3 text-[#1b4332]">
              <Package className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-[#14231b]">No incoming recycling shipments right now</p>
            <p className="text-xs text-[#718477] mt-1">Dispatched shipments from collectors will arrive here for intake.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#edf2ec] text-[11px] font-bold text-[#718477] uppercase bg-[#fbfbf9]">
                  <th className="py-3.5 px-6">Shipment ID</th>
                  <th className="py-3.5 px-6">Plastic Type</th>
                  <th className="py-3.5 px-6">Received Weight</th>
                  <th className="py-3.5 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#edf2ec] text-xs text-[#14231b]">
                {recentRecords?.map((r) => (
                  <tr key={r._id} className="hover:bg-[#fbfbf9] transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-[#1b4332]">#{r._id.slice(-6).toUpperCase()}</td>
                    <td className="py-4 px-6 font-semibold text-[#14231b]">{r.plasticTypeId?.name || 'Mixed Plastic'}</td>
                    <td className="py-4 px-6 font-bold text-[#1b4332]">{r.receivedWeight} KG</td>
                    <td className="py-4 px-6">
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
