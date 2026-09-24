import React, { useEffect, useState } from 'react';
import { Factory, CheckCircle2, RefreshCw, AlertCircle, Award } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';

const RecyclerMaterialsPage = () => {
  const { showToast } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeModalRecord, setActiveModalRecord] = useState(null);
  const [recycledWeight, setRecycledWeight] = useState('');
  const [rejectedWeight, setRejectedWeight] = useState('0');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const res = await API.get('/recycler/materials');
      setMaterials(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleReceive = async (id) => {
    try {
      await API.put(`/recycler/materials/${id}/receive`);
      showToast('Shipment received into processing queue! 🏭', 'success');
      fetchMaterials();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleCompleteSubmit = async (e) => {
    e.preventDefault();

    const recKg = Number(recycledWeight);
    const rejKg = Number(rejectedWeight || 0);

    if (recKg < 0 || rejKg < 0) {
      showToast('Weight values cannot be negative', 'error');
      return;
    }

    if (recKg + rejKg > activeModalRecord.receivedWeight + 0.1) {
      showToast(`Recycled (${recKg}kg) + Rejected (${rejKg}kg) exceeds Received weight (${activeModalRecord.receivedWeight}kg)`, 'error');
      return;
    }

    setSubmitting(true);
    try {
      await API.put(`/recycler/materials/${activeModalRecord._id}/complete`, {
        recycledWeight: recKg,
        rejectedWeight: rejKg,
        notes,
      });
      showToast('Recycling process COMPLETED & Points credited to user! 🎉', 'success');
      setActiveModalRecord(null);
      fetchMaterials();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading incoming materials..." />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Recycling Processing Queue</h1>
        <p className="text-xs text-slate-400 mt-1">Receive material shipments, record processed yields, and credit user reward points.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {materials.map((m) => (
          <div key={m._id} className="glass-card p-6 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-purple-400">#{m._id.slice(-6).toUpperCase()}</span>
                <StatusBadge status={m.status} />
              </div>

              <div>
                <h4 className="font-bold text-base text-white">{m.plasticTypeId?.name}</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Shipment Received Weight: <strong className="text-emerald-400">{m.receivedWeight} KG</strong>
                </p>
                <p className="text-[11px] text-amber-400 font-semibold mt-1">
                  Point Rate: +{m.plasticTypeId?.pointsPerKg || 10} points/kg
                </p>
              </div>

              {m.pickupId?.userId && (
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                  <p className="text-slate-400">Citizen: <strong className="text-white">{m.pickupId.userId.name}</strong></p>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-800 space-y-2">
              {m.status === 'RECEIVED' && (
                <button
                  onClick={() => handleReceive(m._id)}
                  className="w-full py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" /> Start Material Processing
                </button>
              )}

              {m.status === 'PROCESSING' && (
                <button
                  onClick={() => {
                    setActiveModalRecord(m);
                    setRecycledWeight(m.receivedWeight);
                    setRejectedWeight('0');
                    setNotes('');
                  }}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" /> Complete & Credit Points
                </button>
              )}

              {m.status === 'COMPLETED' && (
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 font-semibold text-center">
                  ✅ Yield: {m.recycledWeight} KG Recycled ({m.rejectedWeight} KG Rejected)
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Completion Modal */}
      {activeModalRecord && (
        <Modal
          isOpen={!!activeModalRecord}
          onClose={() => setActiveModalRecord(null)}
          title={`Complete Recycling Process - Batch #${activeModalRecord._id.slice(-6).toUpperCase()}`}
        >
          <form onSubmit={handleCompleteSubmit} className="space-y-4">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
              <p className="text-slate-400">Plastic Material: <strong className="text-white">{activeModalRecord.plasticTypeId?.name}</strong></p>
              <p className="text-slate-400">Total Received Weight: <strong className="text-emerald-400">{activeModalRecord.receivedWeight} KG</strong></p>
              <p className="text-slate-400">Points Multiplier: <strong className="text-amber-400">{activeModalRecord.plasticTypeId?.pointsPerKg} pts/kg</strong></p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">Recycled Weight (KG)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max={activeModalRecord.receivedWeight}
                  required
                  value={recycledWeight}
                  onChange={(e) => setRecycledWeight(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-emerald-400 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">Rejected Weight (KG)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max={activeModalRecord.receivedWeight}
                  required
                  value={rejectedWeight}
                  onChange={(e) => setRejectedWeight(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-rose-400 font-bold"
                />
              </div>
            </div>

            <p className="text-[11px] text-amber-400 font-bold">
              Total Points to be Credited to User: +{Math.round((Number(recycledWeight) || 0) * (activeModalRecord.plasticTypeId?.pointsPerKg || 10))} PTS
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">Processing Notes (Optional)</label>
              <textarea
                rows="2"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Clean PET flakes produced for commercial bottle manufacturing."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl eco-button-gradient text-slate-950 font-extrabold text-xs shadow-xl"
            >
              {submitting ? 'Crediting Points...' : 'Complete Batch & Credit User Points'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default RecyclerMaterialsPage;
