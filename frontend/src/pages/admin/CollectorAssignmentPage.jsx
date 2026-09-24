import React, { useEffect, useState } from 'react';
import { CheckSquare, Truck, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';

const CollectorAssignmentPage = () => {
  const { showToast } = useAuth();
  const [pendingPickups, setPendingPickups] = useState([]);
  const [collectors, setCollectors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedPickup, setSelectedPickup] = useState(null);
  const [selectedCollectorId, setSelectedCollectorId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const pickupRes = await API.get('/admin/pickups?status=PENDING');
      setPendingPickups(pickupRes.data || []);

      const userRes = await API.get('/admin/users?role=COLLECTOR');
      setCollectors(userRes.data || []);
      if (userRes.data?.length > 0) {
        setSelectedCollectorId(userRes.data[0]._id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCollectorId) {
      showToast('Please select a collector', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await API.put(`/pickups/${selectedPickup._id}/assign`, { collectorId: selectedCollectorId });
      showToast('Collector assigned successfully! 🚚', 'success');
      setSelectedPickup(null);
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading pending pickup requests..." />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Collector Assignment Center</h1>
        <p className="text-xs text-slate-400 mt-1">Assign waste collectors to pending citizen pickup requests</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pendingPickups.map((p) => (
          <div key={p._id} className="glass-card p-6 rounded-3xl border border-amber-500/30 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-amber-400">#{p._id.slice(-6).toUpperCase()}</span>
                <StatusBadge status={p.status} />
              </div>

              <div>
                <h4 className="font-bold text-base text-white">{p.plasticTypeId?.name}</h4>
                <p className="text-xs text-slate-400 mt-0.5">Est. Weight: <strong className="text-emerald-400">{p.estimatedWeight} KG</strong></p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
                <p className="font-bold text-white">{p.userId?.name}</p>
                <p className="text-slate-400">{p.address?.street}, {p.address?.city}</p>
                <p className="text-slate-500 text-[11px]">Preferred: {new Date(p.preferredDate).toLocaleDateString()} ({p.preferredTimeSlot})</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedPickup(p)}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-lg"
            >
              <UserCheck className="w-4 h-4" /> Assign Waste Collector
            </button>
          </div>
        ))}
      </div>

      {/* Assignment Modal */}
      {selectedPickup && (
        <Modal
          isOpen={!!selectedPickup}
          onClose={() => setSelectedPickup(null)}
          title={`Assign Collector to Pickup #${selectedPickup._id.slice(-6).toUpperCase()}`}
        >
          <form onSubmit={handleAssignSubmit} className="space-y-4">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
              <p className="text-slate-400">Citizen: <strong className="text-white">{selectedPickup.userId?.name}</strong></p>
              <p className="text-slate-400">Category: <strong className="text-white">{selectedPickup.plasticTypeId?.name}</strong> ({selectedPickup.estimatedWeight} KG)</p>
              <p className="text-slate-400">Address: <strong className="text-white">{selectedPickup.address?.street}, {selectedPickup.address?.city}</strong></p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1.5">Select Collector Agent</label>
              <select
                value={selectedCollectorId}
                onChange={(e) => setSelectedCollectorId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white font-bold"
              >
                {collectors.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} ({c.phone || c.email})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-xl"
            >
              {submitting ? 'Assigning Collector...' : 'Confirm Assignment'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default CollectorAssignmentPage;
