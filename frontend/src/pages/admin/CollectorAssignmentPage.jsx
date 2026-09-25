import React, { useEffect, useState } from 'react';
import { CheckSquare, Truck, UserCheck, Calendar, Clock, MapPin, User } from 'lucide-react';
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
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fefce8] text-[#854d0e] border border-[#fef08a] text-xs font-semibold uppercase tracking-wider mb-2">
            <Truck className="w-3.5 h-3.5" />
            <span>Dispatch Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14231b] tracking-tight">Collector Assignment Center</h1>
          <p className="text-sm text-[#526458] mt-1">Assign accredited waste logistics collectors to pending citizen pickup requests.</p>
        </div>
        <div className="text-xs font-semibold text-[#854d0e] bg-[#fefce8] border border-[#fef08a] px-4 py-2 rounded-xl self-start sm:self-auto shadow-sm">
          Pending Dispatch: <span className="font-bold text-[#713f12]">{pendingPickups.length}</span>
        </div>
      </div>

      {pendingPickups.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-[#e2e8df] text-center shadow-sm max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-[#e8f0ea] flex items-center justify-center mx-auto mb-4 text-[#1b4332]">
            <CheckSquare className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-[#14231b]">All Pickups Assigned</h3>
          <p className="text-xs text-[#526458] mt-1">
            Great job! There are currently no unassigned pending pickup requests in the system.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingPickups.map((p) => (
            <div
              key={p._id}
              className="bg-white p-6 rounded-3xl border border-[#e2e8df] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-[#854d0e] bg-[#fefce8] px-2.5 py-1 rounded-md border border-[#fef08a]">
                    #{p._id.slice(-6).toUpperCase()}
                  </span>
                  <StatusBadge status={p.status} />
                </div>

                <div>
                  <h4 className="font-bold text-base text-[#14231b]">{p.plasticTypeId?.name || 'Recyclable Plastic'}</h4>
                  <p className="text-xs text-[#526458] mt-1">
                    Estimated Weight: <strong className="text-[#1b4332] font-bold">{p.estimatedWeight} KG</strong>
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#fbfbf9] border border-[#edf2ec] text-xs space-y-1.5">
                  <p className="font-bold text-[#14231b] flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#8fa895]" />
                    <span>{p.userId?.name || 'Citizen'}</span>
                  </p>
                  <p className="text-[#526458] flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#8fa895] shrink-0 mt-0.5" />
                    <span className="truncate">{p.address?.street}, {p.address?.city}</span>
                  </p>
                  <p className="text-[#718477] text-[11px] flex items-center gap-1.5 pt-0.5">
                    <Clock className="w-3.5 h-3.5 text-[#8fa895]" />
                    <span>
                      {p.preferredDate ? new Date(p.preferredDate).toLocaleDateString() : 'Flexible'} ({p.preferredTimeSlot || 'Standard'})
                    </span>
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setSelectedPickup(p)}
                  className="w-full py-2.5 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Assign Waste Collector</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Assignment Modal */}
      {selectedPickup && (
        <Modal
          isOpen={!!selectedPickup}
          onClose={() => setSelectedPickup(null)}
          title={`Assign Collector — #${selectedPickup._id.slice(-6).toUpperCase()}`}
        >
          <form onSubmit={handleAssignSubmit} className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#fbfbf9] border border-[#edf2ec] text-xs space-y-1.5">
              <p className="text-[#526458]">
                Citizen: <strong className="text-[#14231b]">{selectedPickup.userId?.name}</strong>
              </p>
              <p className="text-[#526458]">
                Category: <strong className="text-[#14231b]">{selectedPickup.plasticTypeId?.name}</strong> ({selectedPickup.estimatedWeight} KG)
              </p>
              <p className="text-[#526458]">
                Address: <strong className="text-[#14231b]">{selectedPickup.address?.street}, {selectedPickup.address?.city}</strong>
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#14231b] mb-1.5">Select Collector Agent</label>
              <select
                value={selectedCollectorId}
                onChange={(e) => setSelectedCollectorId(e.target.value)}
                className="w-full bg-[#fbfbf9] border border-[#d8e2dc] rounded-xl px-4 py-2.5 text-xs text-[#14231b] font-bold focus:outline-none focus:ring-2 focus:ring-[#1b4332]/20 focus:border-[#1b4332] transition"
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
              className="w-full py-3.5 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-bold text-sm shadow-sm transition disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              <span>{submitting ? 'Assigning Collector...' : 'Confirm Assignment'}</span>
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default CollectorAssignmentPage;
