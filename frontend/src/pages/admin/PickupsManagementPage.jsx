import React, { useEffect, useState } from 'react';
import { Package, Filter, Eye, User, Truck, MapPin, Calendar, Clock, Scale } from 'lucide-react';
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
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e8f0ea] text-[#1b4332] text-xs font-semibold uppercase tracking-wider mb-2">
            <Package className="w-3.5 h-3.5" />
            <span>Master Registry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14231b] tracking-tight">Ecosystem Pickup Requests</h1>
          <p className="text-sm text-[#526458] mt-1">Audit, trace, and inspect every citizen plastic waste pickup across lifecycle stages.</p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white border border-[#d8e2dc] rounded-xl px-4 py-2 text-xs font-semibold text-[#14231b] focus:outline-none focus:ring-2 focus:ring-[#1b4332]/20 focus:border-[#1b4332] shadow-sm cursor-pointer self-start sm:self-auto"
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

      {/* Table */}
      <div className="bg-white rounded-3xl border border-[#e2e8df] shadow-sm overflow-hidden">
        {pickups.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="w-12 h-12 rounded-full bg-[#e8f0ea] flex items-center justify-center mx-auto mb-3 text-[#1b4332]">
              <Package className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-[#14231b]">No pickups found</p>
            <p className="text-xs text-[#718477] mt-1">No requests currently match the selected filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#edf2ec] text-[11px] font-bold text-[#718477] uppercase bg-[#fbfbf9]">
                  <th className="py-3.5 px-6">Pickup ID</th>
                  <th className="py-3.5 px-6">Citizen</th>
                  <th className="py-3.5 px-6">Category</th>
                  <th className="py-3.5 px-6">Est. / Verified Weight</th>
                  <th className="py-3.5 px-6">Collector</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#edf2ec] text-xs text-[#14231b]">
                {pickups.map((p) => (
                  <tr key={p._id} className="hover:bg-[#fbfbf9] transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-[#1b4332]">#{p._id.slice(-6).toUpperCase()}</td>
                    <td className="py-4 px-6 font-semibold text-[#14231b]">{p.userId?.name || 'Citizen'}</td>
                    <td className="py-4 px-6 text-[#526458] font-medium">{p.plasticTypeId?.name || 'Plastic'}</td>
                    <td className="py-4 px-6">
                      <span className="font-bold text-[#1b4332]">
                        {p.actualWeight > 0 ? `${p.actualWeight} KG (Scale)` : `${p.estimatedWeight} KG (Est.)`}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-medium">
                      {p.collectorId?.name ? (
                        <span className="text-[#14231b] font-semibold">{p.collectorId.name}</span>
                      ) : (
                        <span className="text-[#718477] italic">Unassigned</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setSelectedPickup(p)}
                        className="px-3 py-1.5 rounded-lg bg-[#fbfbf9] hover:bg-[#edf2ec] border border-[#d8e2dc] text-[#14231b] text-xs font-bold inline-flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#1b4332]" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Inspect Modal */}
      {selectedPickup && (
        <Modal
          isOpen={!!selectedPickup}
          onClose={() => setSelectedPickup(null)}
          title={`Pickup Audit — #${selectedPickup._id.slice(-6).toUpperCase()}`}
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#fbfbf9] border border-[#edf2ec]">
              <span className="text-[#526458] font-semibold">Lifecycle Status</span>
              <StatusBadge status={selectedPickup.status} />
            </div>

            <div className="p-4 rounded-2xl bg-[#fbfbf9] border border-[#edf2ec] space-y-2.5">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#8fa895]" />
                <span className="text-[#718477]">Citizen:</span>
                <strong className="text-[#14231b]">{selectedPickup.userId?.name} ({selectedPickup.userId?.email})</strong>
              </div>

              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-[#8fa895]" />
                <span className="text-[#718477]">Category:</span>
                <strong className="text-[#14231b]">{selectedPickup.plasticTypeId?.name}</strong>
                <span className="text-[#526458]">| Est: {selectedPickup.estimatedWeight} KG</span>
                {selectedPickup.actualWeight > 0 && (
                  <span className="text-[#1b4332] font-bold">| Verified: {selectedPickup.actualWeight} KG</span>
                )}
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#8fa895] shrink-0 mt-0.5" />
                <span className="text-[#718477]">Pickup Address:</span>
                <strong className="text-[#14231b]">
                  {selectedPickup.address?.street}, {selectedPickup.address?.city}, {selectedPickup.address?.state} {selectedPickup.address?.zipCode}
                </strong>
              </div>

              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#8fa895]" />
                <span className="text-[#718477]">Collector:</span>
                <strong className="text-[#14231b]">{selectedPickup.collectorId?.name || 'Pending Assignment'}</strong>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PickupsManagementPage;
