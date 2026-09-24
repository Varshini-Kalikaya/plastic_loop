import React, { useEffect, useState } from 'react';
import { Package, Filter, Eye } from 'lucide-react';
import API from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';

const PickupsManagementPage = () => {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedPickup, setSelectedPickup] = useState(null);

  const fetchPickups = async () => {
    setLoading(true);
    try {
      let query = '/admin/pickups?limit=50';
      if (statusFilter) query += `&status=${statusFilter}`;
      const res = await API.get(query);
      setPickups(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPickups();
  }, [statusFilter]);

  if (loading) return <LoadingSpinner message="Loading ecosystem pickups..." />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">All Ecosystem Pickup Requests</h1>
          <p className="text-xs text-slate-400 mt-1">Audit and inspect every waste pickup lifecycle</p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">PENDING</option>
          <option value="ASSIGNED">ASSIGNED</option>
          <option value="ACCEPTED">ACCEPTED</option>
          <option value="PICKED_UP">PICKED_UP</option>
          <option value="VERIFIED">VERIFIED</option>
          <option value="SENT_TO_RECYCLER">SENT_TO_RECYCLER</option>
          <option value="PROCESSING">PROCESSING</option>
          <option value="RECYCLED">RECYCLED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
      </div>

      <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase bg-slate-900/60">
                <th className="py-3.5 px-5">Pickup ID</th>
                <th className="py-3.5 px-5">Citizen</th>
                <th className="py-3.5 px-5">Category</th>
                <th className="py-3.5 px-5">Est. / Actual Weight</th>
                <th className="py-3.5 px-5">Collector</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs text-slate-200">
              {pickups.map((p) => (
                <tr key={p._id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-5 font-mono font-bold text-amber-400">#{p._id.slice(-6).toUpperCase()}</td>
                  <td className="py-4 px-5 font-semibold text-white">{p.userId?.name}</td>
                  <td className="py-4 px-5">{p.plasticTypeId?.name}</td>
                  <td className="py-4 px-5 font-bold text-emerald-400">
                    {p.actualWeight > 0 ? `${p.actualWeight} KG` : `${p.estimatedWeight} KG`}
                  </td>
                  <td className="py-4 px-5 text-slate-300 font-medium">{p.collectorId?.name || 'Unassigned'}</td>
                  <td className="py-4 px-5">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="py-4 px-5">
                    <button
                      onClick={() => setSelectedPickup(p)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedPickup && (
        <Modal isOpen={!!selectedPickup} onClose={() => setSelectedPickup(null)} title={`Pickup #${selectedPickup._id.slice(-6).toUpperCase()}`}>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 font-semibold">Current Status</span>
              <StatusBadge status={selectedPickup.status} />
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <p className="text-slate-400">Citizen: <strong className="text-white">{selectedPickup.userId?.name} ({selectedPickup.userId?.email})</strong></p>
              <p className="text-slate-400">Category: <strong className="text-white">{selectedPickup.plasticTypeId?.name}</strong></p>
              <p className="text-slate-400">Address: <strong className="text-white">{selectedPickup.address?.street}, {selectedPickup.address?.city}</strong></p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PickupsManagementPage;
