import React, { useState, useEffect } from 'react';
import { Package, Calendar, MapPin, Eye, XCircle, Filter, CheckCircle2, Clock, Truck, Factory, ShieldCheck } from 'lucide-react';
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

  const getJourneyStage = (status) => {
    switch (status) {
      case 'PENDING':
        return 1;
      case 'ASSIGNED':
      case 'ACCEPTED':
        return 2;
      case 'PICKED_UP':
        return 3;
      case 'VERIFIED':
        return 4;
      case 'SENT_TO_RECYCLER':
      case 'PROCESSING':
        return 5;
      case 'RECYCLED':
      case 'COMPLETED':
        return 6;
      default:
        return 0; // Cancelled
    }
  };

  const journeySteps = [
    { num: 1, label: 'Request submitted' },
    { num: 2, label: 'Collector assigned' },
    { num: 3, label: 'Material picked up' },
    { num: 4, label: 'Scale weight verified' },
    { num: 5, label: 'Sent for recycling' },
    { num: 6, label: 'Recycled & points awarded' },
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Page Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-[#e2e8df] shadow-sm">
        <div>
          <span className="text-xs font-extrabold text-[#1b4332] uppercase tracking-widest bg-[#edf6f0] px-3 py-1 rounded-full border border-[#cadbc5]">
            Collection Tracking
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14231b] mt-2 tracking-tight">
            My Pickup Requests
          </h1>
          <p className="text-xs sm:text-sm text-[#5c6e62] mt-0.5">
            Track real-time collection stages, weight verifications, and processing status.
          </p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 bg-[#f8faf8] p-1.5 rounded-2xl border border-[#dce6df]">
          <Filter className="w-4 h-4 text-[#687a6e] ml-2" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-transparent text-xs font-bold text-[#14231b] pr-3 py-1.5 focus:outline-none cursor-pointer"
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
        <EmptyState
          title="No pickup requests found"
          description="You haven't submitted any pickup requests matching this filter."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pickups.map((p) => {
            const currentStage = getJourneyStage(p.status);
            return (
              <div
                key={p._id}
                className="bg-white rounded-3xl border border-[#e2e8df] p-6 sm:p-7 shadow-sm hover:border-[#b8cfbf] transition-all flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-[#edf2ec] pb-3.5">
                    <span className="font-mono font-extrabold text-xs text-[#1b4332] bg-[#edf6f0] px-2.5 py-1 rounded-lg border border-[#cbe3d3]">
                      #{p._id.slice(-6).toUpperCase()}
                    </span>
                    <StatusBadge status={p.status} />
                  </div>

                  <div>
                    <h3 className="font-extrabold text-base text-[#14231b]">{p.plasticTypeId?.name}</h3>
                    <p className="text-xs text-[#526458] mt-1 font-medium">
                      Estimated: <strong className="text-[#14231b] font-bold">{p.estimatedWeight} KG</strong>
                      {p.actualWeight > 0 && (
                        <span className="ml-2 text-[#1b4332] font-black">
                          • Scale Verified: {p.actualWeight} KG
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Visual Recycling Journey Timeline */}
                  {p.status !== 'CANCELLED' ? (
                    <div className="p-4 rounded-2xl bg-[#fafbfa] border border-[#e5ebe5] space-y-2.5">
                      <span className="text-[10px] font-extrabold text-[#526458] uppercase tracking-wider block">
                        Your Recycling Journey
                      </span>
                      <div className="space-y-2">
                        {journeySteps.map((step) => {
                          const isDone = currentStage >= step.num;
                          const isCurrent = currentStage === step.num;
                          return (
                            <div key={step.num} className="flex items-center gap-2.5 text-xs">
                              <span
                                className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                                  isDone
                                    ? 'bg-[#1b4332] text-white'
                                    : 'bg-[#e2e8df] text-[#8fa295]'
                                }`}
                              >
                                {isDone ? '✓' : step.num}
                              </span>
                              <span
                                className={`${
                                  isCurrent
                                    ? 'text-[#14231b] font-bold'
                                    : isDone
                                    ? 'text-[#2d6a4f] font-medium'
                                    : 'text-[#8fa295]'
                                }`}
                              >
                                {step.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-semibold">
                      This pickup request was cancelled.
                    </div>
                  )}

                  <div className="space-y-1.5 text-xs text-[#627367] pt-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#8aa092]" />
                      <span>{new Date(p.preferredDate).toLocaleDateString()} • {p.preferredTimeSlot}</span>
                    </div>
                    <div className="flex items-center gap-2 truncate">
                      <MapPin className="w-3.5 h-3.5 text-[#8aa092] shrink-0" />
                      <span className="truncate">{p.address?.street}, {p.address?.city}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-[#edf2ec]">
                  <button
                    onClick={() => setSelectedPickup(p)}
                    className="flex-1 py-2.5 px-4 rounded-xl eco-btn-secondary text-xs font-bold flex items-center justify-center gap-2"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#2d6a4f]" /> View Complete Details
                  </button>
                  {['PENDING', 'ASSIGNED'].includes(p.status) && (
                    <button
                      onClick={() => handleCancel(p._id)}
                      className="py-2.5 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5 text-rose-600" /> Cancel
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pickup Detail Modal */}
      {selectedPickup && (
        <Modal
          isOpen={!!selectedPickup}
          onClose={() => setSelectedPickup(null)}
          title={`Pickup Request #${selectedPickup._id.slice(-6).toUpperCase()}`}
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#fafbfa] border border-[#e2e8df]">
              <span className="text-[#627367] font-semibold">Current State</span>
              <StatusBadge status={selectedPickup.status} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-[#fafbfa] border border-[#e2e8df]">
                <span className="text-[#627367] font-bold block">Plastic Category</span>
                <p className="font-extrabold text-[#14231b] mt-1">
                  {selectedPickup.plasticTypeId?.name} ({selectedPickup.plasticTypeId?.code})
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#fafbfa] border border-[#e2e8df]">
                <span className="text-[#627367] font-bold block">Reward Point Rate</span>
                <p className="font-extrabold text-[#1b4332] mt-1">
                  +{selectedPickup.plasticTypeId?.pointsPerKg} points/kg
                </p>
              </div>
            </div>

            {selectedPickup.images?.length > 0 && (
              <div>
                <span className="text-[#627367] font-bold block mb-1.5">Attached Waste Photo</span>
                <img
                  src={selectedPickup.images[0]}
                  alt="Waste Photo"
                  className="w-full h-44 object-cover rounded-2xl border border-[#d6e2d9]"
                />
              </div>
            )}

            <div className="p-3.5 rounded-2xl bg-[#fafbfa] border border-[#e2e8df] space-y-1">
              <span className="text-[#627367] font-bold block">Doorstep Address</span>
              <p className="text-[#14231b] font-medium leading-relaxed">
                {selectedPickup.address?.street}, {selectedPickup.address?.city}, {selectedPickup.address?.state} - {selectedPickup.address?.zipCode}
              </p>
            </div>

            {selectedPickup.collectorId && (
              <div className="p-4 rounded-2xl bg-[#f0f9ff] border border-[#bae6fd] flex items-center gap-3.5">
                <img
                  src={selectedPickup.collectorId.profileImage}
                  alt="Collector"
                  className="w-11 h-11 rounded-xl object-cover border border-[#7dd3fc]"
                />
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0369a1] block">
                    Assigned Logistics Collector
                  </span>
                  <p className="text-sm font-extrabold text-[#0c4a6e]">{selectedPickup.collectorId.name}</p>
                  <p className="text-xs text-[#0284c7] font-medium">{selectedPickup.collectorId.phone}</p>
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
