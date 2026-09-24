import React, { useState, useEffect } from 'react';
import { Package, Calendar, MapPin, Eye, XCircle, Filter } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';

const MyPickupsPage = () => {
  const { showToast } = useAuth();
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedPickup, setSelectedPickup] = useState(null);

  const fetchPickups = async () => {
    setLoading(true);
    try {
      const url = filterStatus ? `/pickups/my-pickups?status=${filterStatus}` : '/pickups/my-pickups';
      const res = await API.get(url);
      setPickups(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPickups();
  }, [filterStatus]);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this pickup request?')) return;
    try {
      await API.put(`/pickups/${id}/cancel`);
      showToast('Pickup request cancelled successfully', 'info');
      setSelectedPickup(null);
      fetchPickups();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">My Pickup Requests</h1>
          <p className="text-xs text-slate-400 mt-1">Track status and details of your waste collection requests</p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">PENDING</option>
            <option value="ASSIGNED">ASSIGNED</option>
            <option value="ACCEPTED">ACCEPTED</option>
            <option value="PICKED_UP">PICKED_UP</option>
            <option value="VERIFIED">VERIFIED</option>
            <option value="RECYCLED">RECYCLED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Fetching your pickup requests..." />
      ) : pickups.length === 0 ? (
        <EmptyState title="No pickup requests found" description="You have not submitted any pickup requests matching this filter." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pickups.map((p) => (
            <div key={p._id} className="glass-card glass-card-hover p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-emerald-400">#{p._id.slice(-6).toUpperCase()}</span>
                  <StatusBadge status={p.status} />
                </div>

                <div>
                  <h4 className="font-bold text-sm text-white">{p.plasticTypeId?.name}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Est. Weight: <strong className="text-emerald-300">{p.estimatedWeight} KG</strong>
                    {p.actualWeight > 0 && <span className="ml-2 text-teal-400 font-bold">(Verified: {p.actualWeight} KG)</span>}
                  </p>
                </div>

                <div className="space-y-1 text-xs text-slate-400 border-t border-slate-800/80 pt-3">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{new Date(p.preferredDate).toLocaleDateString()} • {p.preferredTimeSlot}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{p.address?.street}, {p.address?.city}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => setSelectedPickup(p)}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" /> Details
                </button>
                {['PENDING', 'ASSIGNED'].includes(p.status) && (
                  <button
                    onClick={() => handleCancel(p._id)}
                    className="py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-xs font-bold text-rose-400 flex items-center justify-center gap-1 transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pickup Detail Modal */}
      {selectedPickup && (
        <Modal isOpen={!!selectedPickup} onClose={() => setSelectedPickup(null)} title={`Pickup Request #${selectedPickup._id.slice(-6).toUpperCase()}`}>
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 font-semibold">Status</span>
              <StatusBadge status={selectedPickup.status} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <p className="text-slate-400 font-semibold">Plastic Category</p>
                <p className="font-bold text-white mt-1">{selectedPickup.plasticTypeId?.name} ({selectedPickup.plasticTypeId?.code})</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <p className="text-slate-400 font-semibold">Reward Rate</p>
                <p className="font-bold text-emerald-400 mt-1">+{selectedPickup.plasticTypeId?.pointsPerKg} points/kg</p>
              </div>
            </div>

            {selectedPickup.images?.length > 0 && (
              <div>
                <p className="text-slate-400 font-semibold mb-1">Attached Waste Image</p>
                <img src={selectedPickup.images[0]} alt="Waste" className="w-full h-40 object-cover rounded-xl border border-slate-800" />
              </div>
            )}

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <p className="text-slate-400 font-semibold">Pickup Address</p>
              <p className="text-white font-medium">{selectedPickup.address?.street}, {selectedPickup.address?.city}, {selectedPickup.address?.state} - {selectedPickup.address?.zipCode}</p>
            </div>

            {selectedPickup.collectorId && (
              <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/30 flex items-center gap-3">
                <img src={selectedPickup.collectorId.profileImage} alt="Collector" className="w-10 h-10 rounded-full object-cover border border-blue-400" />
                <div>
                  <p className="text-blue-300 font-bold">Assigned Collector</p>
                  <p className="text-white font-semibold">{selectedPickup.collectorId.name}</p>
                  <p className="text-slate-400">{selectedPickup.collectorId.phone}</p>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MyPickupsPage;
