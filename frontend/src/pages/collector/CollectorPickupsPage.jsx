import React, { useEffect, useState } from 'react';
import { Truck, Check, Weight, Send, MapPin, Phone, Eye } from 'lucide-react';
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
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Assigned Waste Pickups</h1>
        <p className="text-xs text-slate-400 mt-1">Accept requests, perform scale weight verification and dispatch waste to recycling plants.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pickups.map((p) => (
          <div key={p._id} className="glass-card p-6 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-blue-400">#{p._id.slice(-6).toUpperCase()}</span>
                <StatusBadge status={p.status} />
              </div>

              <div>
                <h4 className="font-bold text-base text-white">{p.plasticTypeId?.name}</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Est. Weight: <strong className="text-emerald-400">{p.estimatedWeight} KG</strong>
                  {p.actualWeight > 0 && <span className="ml-2 font-bold text-teal-300">(Verified: {p.actualWeight} KG)</span>}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-1 text-xs">
                <p className="font-bold text-white">{p.userId?.name}</p>
                <p className="text-slate-400 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-500" /> {p.userId?.phone}
                </p>
                <p className="text-slate-400 flex items-center gap-1 truncate">
                  <MapPin className="w-3 h-3 text-slate-500 shrink-0" /> {p.address?.street}, {p.address?.city}
                </p>
              </div>
            </div>

            {/* Collector Workflow Action Buttons */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              {p.status === 'ASSIGNED' && (
                <button
                  onClick={() => handleAccept(p._id)}
                  className="w-full py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Check className="w-4 h-4" /> Accept Assignment
                </button>
              )}

              {p.status === 'ACCEPTED' && (
                <button
                  onClick={() => handleMarkPickedUp(p._id)}
                  className="w-full py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Truck className="w-4 h-4" /> Mark Material Picked Up
                </button>
              )}

              {p.status === 'PICKED_UP' && (
                <button
                  onClick={() => {
                    setVerifyModalPickup(p);
                    setActualWeight(p.estimatedWeight);
                    setProofImage('');
                  }}
                  className="w-full py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Weight className="w-4 h-4" /> Verify Actual Scale Weight
                </button>
              )}

              {p.status === 'VERIFIED' && (
                <button
                  onClick={() => handleSendToRecycler(p._id)}
                  className="w-full py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Send className="w-4 h-4" /> Dispatch Shipment to Recycler
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Weight Verification Modal */}
      {verifyModalPickup && (
        <Modal
          isOpen={!!verifyModalPickup}
          onClose={() => setVerifyModalPickup(null)}
          title={`Weight Verification - Pickup #${verifyModalPickup._id.slice(-6).toUpperCase()}`}
        >
          <form onSubmit={handleVerifyWeightSubmit} className="space-y-4">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <p className="text-slate-400">Plastic Type: <strong className="text-white">{verifyModalPickup.plasticTypeId?.name}</strong></p>
              <p className="text-slate-400 mt-1">Citizen: <strong className="text-white">{verifyModalPickup.userId?.name}</strong></p>
              <p className="text-slate-400 mt-1">Estimated Weight: <strong className="text-emerald-400">{verifyModalPickup.estimatedWeight} KG</strong></p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">Enter Verified Scale Weight (KG)</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                required
                value={actualWeight}
                onChange={(e) => setActualWeight(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white font-bold"
              />
            </div>

            <ImageUploader
              label="Upload Scale Verification Proof Photo"
              onUploadSuccess={(url) => setProofImage(url)}
            />

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs shadow-lg"
            >
              {submitting ? 'Recording Verification...' : 'Confirm Verified Weight'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default CollectorPickupsPage;
