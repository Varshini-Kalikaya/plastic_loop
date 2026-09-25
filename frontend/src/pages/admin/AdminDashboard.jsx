import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Users, Truck, Factory, Package, CheckSquare, BarChart3, AlertCircle, ChevronRight, ArrowRight } from 'lucide-react';
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
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Hero Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e2e8df] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-1.5 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e8f0ea] text-[#1b4332] font-bold text-xs uppercase tracking-wider mb-1">
            <Shield className="w-3.5 h-3.5 text-[#1b4332]" />
            <span>Ecosystem Administration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14231b] tracking-tight">Platform Monitoring & Operations</h1>
          <p className="text-sm text-[#526458] max-w-xl">
            Assign collectors, manage platform entities, inspect recycling analytics and oversee circular economy operations.
          </p>
        </div>

        <Link
          to="/admin/assign-collectors"
          className="relative z-10 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-bold text-sm shadow-sm transition whitespace-nowrap"
        >
          <span>Assign Collectors ({pendingPickups || 0})</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Alert for Pending Assignments */}
      {pendingPickups > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#fefce8] border border-[#fef08a] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#854d0e] shadow-sm">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <span className="font-medium">
              Action Required: There are <strong className="font-bold text-[#713f12]">{pendingPickups} pending pickup requests</strong> awaiting collector assignment.
            </span>
          </div>
          <Link
            to="/admin/assign-collectors"
            className="px-4 py-2 rounded-xl bg-[#1b4332] text-white font-bold hover:bg-[#2d6a4f] transition self-start sm:self-auto text-xs whitespace-nowrap"
          >
            Assign Now
          </Link>
        </div>
      )}

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Registered Citizens" value={totalUsers || 0} icon={Users} color="emerald" description="Platform users" />
        <StatCard title="Active Collectors" value={totalCollectors || 0} icon={Truck} color="blue" description="Logistics agents" />
        <StatCard title="Recycling Plants" value={totalRecyclers || 0} icon={Factory} color="purple" description="Certified recyclers" />
        <StatCard title="Platform Recycling Rate" value={`${recyclingRate || 0}%`} icon={BarChart3} color="amber" description="Collected vs Recycled yield" />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title="Pending Requests" value={pendingPickups || 0} icon={Package} color="amber" description="Unassigned pickups" />
        <StatCard title="Active Pickups" value={activePickups || 0} icon={CheckSquare} color="blue" description="In collection pipeline" />
        <StatCard title="Total Recycled Material" value={`${totalPlasticRecycled || 0} KG`} icon={Shield} color="emerald" description="Total recycled weight" />
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-3xl border border-[#e2e8df] shadow-sm overflow-hidden space-y-0">
        <div className="p-6 border-b border-[#edf2ec] flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-[#14231b]">Recent Ecosystem Requests</h3>
            <p className="text-xs text-[#718477] mt-0.5">Most recent citizen pickup requests across all regions</p>
          </div>
          <Link to="/admin/pickups" className="text-xs font-bold text-[#1b4332] hover:text-[#2d6a4f] flex items-center gap-1 hover:underline">
            <span>View All Pickups</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentPickups?.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="w-12 h-12 rounded-full bg-[#e8f0ea] flex items-center justify-center mx-auto mb-3 text-[#1b4332]">
              <Package className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-[#14231b]">No recent pickup requests</p>
            <p className="text-xs text-[#718477] mt-1">New citizen recycling requests will be logged here in real time.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#edf2ec] text-[11px] font-bold text-[#718477] uppercase bg-[#fbfbf9]">
                  <th className="py-3.5 px-6">Pickup ID</th>
                  <th className="py-3.5 px-6">Citizen</th>
                  <th className="py-3.5 px-6">Plastic Category</th>
                  <th className="py-3.5 px-6">Assigned Collector</th>
                  <th className="py-3.5 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#edf2ec] text-xs text-[#14231b]">
                {recentPickups?.map((p) => (
                  <tr key={p._id} className="hover:bg-[#fbfbf9] transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-[#1b4332]">#{p._id.slice(-6).toUpperCase()}</td>
                    <td className="py-4 px-6 font-semibold text-[#14231b]">{p.userId?.name || 'Citizen'}</td>
                    <td className="py-4 px-6 text-[#526458] font-medium">{p.plasticTypeId?.name || 'Plastic'}</td>
                    <td className="py-4 px-6 font-medium">
                      {p.collectorId?.name ? (
                        <span className="text-[#14231b] font-semibold">{p.collectorId.name}</span>
                      ) : (
                        <span className="text-[#854d0e] bg-[#fefce8] px-2.5 py-0.5 rounded-full text-[11px] font-bold">Unassigned</span>
                      )}
                    </td>
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

export default AdminDashboard;
