import React, { useEffect, useState } from 'react';
import { Truck, Check, Weight, Send, MapPin, Phone, Eye, Scale, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import ImageUploader from '../../components/ImageUploader';
import LoadingSpinner from '../../components/LoadingSpinner';

const CollectorPickupsPage = () => {
  const { showToast } = useAuth();
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);

  const [verifyModalPickup, setVerifyModalPickup] = useState(null);
  const [actualWeight, setActualWeight] = useState('');
  const [proofImage, setProofImage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchPickups = async () => {
    setLoading(true);
    try {
      const res = await API.get('/collector/pickups');
      setPickups(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPickups();
  }, []);

  const handleAccept = async (id) => {
    try {
      await API.put(`/collector/pickups/${id}/accept`);
      showToast('Pickup request ACCEPTED! 🚚', 'success');
      fetchPickups();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleMarkPickedUp = async (id) => {
    try {
      await API.put(`/collector/pickups/${id}/pickup`);
      showToast('Status updated to PICKED UP!', 'success');
      fetchPickups();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleVerifyWeightSubmit = async (e) => {
    e.preventDefault();
    if (!actualWeight || Number(actualWeight) <= 0) {
      showToast('Please enter a valid positive scale weight', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await API.put(`/collector/pickups/${verifyModalPickup._id}/verify-weight`, {
        actualWeight: Number(actualWeight),
        proofImages: proofImage ? [proofImage] : verifyModalPickup.images,
      });
      showToast('Weight verified & Collection recorded! ⚖️', 'success');
      setVerifyModalPickup(null);
      fetchPickups();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendToRecycler = async (id) => {
    try {
      await API.put(`/collector/pickups/${id}/send-to-recycler`);
      showToast('Material dispatched to recycling center! 🏭', 'success');
      fetchPickups();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  if (loading) return <LoadingSpinner message="Loading assigned pickups..." />;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e8f0ea] text-[#1b4332] text-xs font-semibold uppercase tracking-wider mb-2">
            <Truck className="w-3.5 h-3.5" />
            <span>Active Assignments</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14231b] tracking-tight">Assigned Waste Pickups</h1>
          <p className="text-sm text-[#526458] mt-1">Accept requests, perform scale weight verification, and dispatch materials to certified recyclers.</p>
        </div>
        <div className="text-xs font-semibold text-[#526458] bg-white px-4 py-2 rounded-xl border border-[#e2e8df] self-start sm:self-auto shadow-sm">
          Total In-Queue: <span className="font-bold text-[#1b4332]">{pickups.length}</span>
        </div>
      </div>

      {pickups.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-[#e2e8df] text-center shadow-sm max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-[#e8f0ea] flex items-center justify-center mx-auto mb-4 text-[#1b4332]">
            <Truck className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-[#14231b]">No Pickups Assigned</h3>
          <p className="text-xs text-[#526458] mt-1">
            There are currently no active or pending pickup requests assigned to your vehicle. Check back shortly.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pickups.map((p) => (
            <div
              key={p._id}
              className="bg-white p-6 rounded-3xl border border-[#e2e8df] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow space-y-5"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-[#1b4332] bg-[#e8f0ea] px-2.5 py-1 rounded-md">
                    #{p._id.slice(-6).toUpperCase()}
                  </span>
                  <StatusBadge status={p.status} />
                </div>

                <div>
                  <h4 className="font-bold text-base text-[#14231b]">{p.plasticTypeId?.name || 'Recyclable Plastic'}</h4>
                  <div className="flex items-center gap-2 mt-1 text-xs text-[#526458]">
                    <span>Est: <strong className="text-[#14231b] font-bold">{p.estimatedWeight} KG</strong></span>
                    {p.actualWeight > 0 && (
                      <span className="font-bold text-[#1b4332] bg-[#e8f0ea] px-2 py-0.5 rounded-full">
                        Scale Verified: {p.actualWeight} KG
                      </span>
                    )}
                  </div>
                </div>

                {/* Citizen Details Pill Box */}
                <div className="p-3.5 rounded-2xl bg-[#fbfbf9] border border-[#edf2ec] space-y-1.5 text-xs">
                  <p className="font-bold text-[#14231b]">{p.userId?.name || 'Anonymous Citizen'}</p>
                  {p.userId?.phone && (
                    <p className="text-[#526458] flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#8fa895]" />
                      <span>{p.userId.phone}</span>
                    </p>
                  )}
                  <p className="text-[#526458] flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#8fa895] shrink-0 mt-0.5" />
                    <span className="truncate">{p.address?.street}, {p.address?.city}</span>
                  </p>
                </div>
              </div>

              {/* Collector Action Buttons */}
              <div className="pt-3 border-t border-[#edf2ec] space-y-2">
                {p.status === 'ASSIGNED' && (
                  <button
                    onClick={() => handleAccept(p._id)}
                    className="w-full py-2.5 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
                  >
                    <Check className="w-4 h-4" />
                    <span>Accept Assignment</span>
                  </button>
                )}

                {p.status === 'ACCEPTED' && (
                  <button
                    onClick={() => handleMarkPickedUp(p._id)}
                    className="w-full py-2.5 rounded-xl bg-[#2d6a4f] hover:bg-[#1b4332] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
                  >
                    <Truck className="w-4 h-4" />
                    <span>Mark Material Picked Up</span>
                  </button>
                )}

                {p.status === 'PICKED_UP' && (
                  <button
                    onClick={() => {
                      setVerifyModalPickup(p);
                      setActualWeight(p.estimatedWeight);
                      setProofImage('');
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
                  >
                    <Weight className="w-4 h-4" />
                    <span>Verify Actual Scale Weight</span>
                  </button>
                )}

                {p.status === 'VERIFIED' && (
                  <button
                    onClick={() => handleSendToRecycler(p._id)}
                    className="w-full py-2.5 rounded-xl bg-[#0f766e] hover:bg-[#115e59] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
                  >
                    <Send className="w-4 h-4" />
                    <span>Dispatch to Recycler</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Weight Verification Modal */}
      {verifyModalPickup && (
        <Modal
          isOpen={!!verifyModalPickup}
          onClose={() => setVerifyModalPickup(null)}
          title={`Weight Scale Verification — #${verifyModalPickup._id.slice(-6).toUpperCase()}`}
        >
          <form onSubmit={handleVerifyWeightSubmit} className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#fbfbf9] border border-[#edf2ec] text-xs space-y-1.5">
              <p className="text-[#526458]">
                Plastic Type: <strong className="text-[#14231b]">{verifyModalPickup.plasticTypeId?.name}</strong>
              </p>
              <p className="text-[#526458]">
                Citizen: <strong className="text-[#14231b]">{verifyModalPickup.userId?.name}</strong>
              </p>
              <p className="text-[#526458]">
                Estimated Weight: <strong className="text-[#1b4332] font-bold">{verifyModalPickup.estimatedWeight} KG</strong>
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#14231b] mb-1.5">Enter Verified Scale Weight (KG)</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                required
                value={actualWeight}
                onChange={(e) => setActualWeight(e.target.value)}
                placeholder="e.g. 5.4"
                className="w-full bg-[#fbfbf9] border border-[#d8e2dc] rounded-xl px-4 py-2.5 text-sm font-bold text-[#14231b] focus:outline-none focus:ring-2 focus:ring-[#1b4332]/20 focus:border-[#1b4332] transition"
              />
            </div>

            <div>
              <ImageUploader
                label="Scale Photo / Weight Slip Proof"
                onUploadSuccess={(url) => setProofImage(url)}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-bold text-sm shadow-sm transition disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
            >
              <Scale className="w-4 h-4" />
              <span>{submitting ? 'Recording Verification...' : 'Confirm Verified Weight'}</span>
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default CollectorPickupsPage;
