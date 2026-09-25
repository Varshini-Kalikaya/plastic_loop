import React, { useEffect, useState } from 'react';
import { Factory, CheckCircle2, RefreshCw, AlertCircle, Award, Sparkles, Scale, Info } from 'lucide-react';
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
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e8f0ea] text-[#1b4332] text-xs font-semibold uppercase tracking-wider mb-2">
            <Factory className="w-3.5 h-3.5" />
            <span>Industrial Processing</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14231b] tracking-tight">Recycling Processing Queue</h1>
          <p className="text-sm text-[#526458] mt-1">Receive material shipments, record processed yields, and credit citizen reward points upon completion.</p>
        </div>
        <div className="text-xs font-semibold text-[#526458] bg-white px-4 py-2 rounded-xl border border-[#e2e8df] self-start sm:self-auto shadow-sm">
          Active Batches: <span className="font-bold text-[#1b4332]">{materials.length}</span>
        </div>
      </div>

      {materials.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-[#e2e8df] text-center shadow-sm max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-[#e8f0ea] flex items-center justify-center mx-auto mb-4 text-[#1b4332]">
            <Factory className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-[#14231b]">No Materials In Queue</h3>
          <p className="text-xs text-[#526458] mt-1">
            There are currently no shipments assigned or awaiting processing at your plant facility.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials.map((m) => (
            <div
              key={m._id}
              className="bg-white p-6 rounded-3xl border border-[#e2e8df] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-[#1b4332] bg-[#e8f0ea] px-2.5 py-1 rounded-md">
                    #{m._id.slice(-6).toUpperCase()}
                  </span>
                  <StatusBadge status={m.status} />
                </div>

                <div>
                  <h4 className="font-bold text-base text-[#14231b]">{m.plasticTypeId?.name || 'Recyclable Plastic'}</h4>
                  <p className="text-xs text-[#526458] mt-1">
                    Shipment Received Weight: <strong className="text-[#14231b] font-bold">{m.receivedWeight} KG</strong>
                  </p>
                  <p className="text-xs text-[#1b4332] font-semibold mt-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Reward Rate: +{m.plasticTypeId?.pointsPerKg || 10} points/kg</span>
                  </p>
                </div>

                {m.pickupId?.userId && (
                  <div className="p-3.5 rounded-2xl bg-[#fbfbf9] border border-[#edf2ec] text-xs space-y-1">
                    <p className="text-[#718477]">Contributing Citizen:</p>
                    <p className="font-bold text-[#14231b]">{m.pickupId.userId.name}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#edf2ec] space-y-2">
                {m.status === 'RECEIVED' && (
                  <button
                    onClick={() => handleReceive(m._id)}
                    className="w-full py-2.5 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Start Material Processing</span>
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
                    className="w-full py-2.5 rounded-xl bg-[#2d6a4f] hover:bg-[#1b4332] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Complete & Credit Points</span>
                  </button>
                )}

                {m.status === 'COMPLETED' && (
                  <div className="p-3 rounded-xl bg-[#e8f0ea] border border-[#d8e2dc] text-xs text-[#1b4332] font-bold text-center flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Yield: {m.recycledWeight} KG Recycled ({m.rejectedWeight} KG Rejected)</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Completion Modal */}
      {activeModalRecord && (
        <Modal
          isOpen={!!activeModalRecord}
          onClose={() => setActiveModalRecord(null)}
          title={`Complete Batch Processing — #${activeModalRecord._id.slice(-6).toUpperCase()}`}
        >
          <form onSubmit={handleCompleteSubmit} className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#fbfbf9] border border-[#edf2ec] text-xs space-y-1.5">
              <p className="text-[#526458]">
                Plastic Material: <strong className="text-[#14231b]">{activeModalRecord.plasticTypeId?.name}</strong>
              </p>
              <p className="text-[#526458]">
                Total Received Weight: <strong className="text-[#1b4332] font-bold">{activeModalRecord.receivedWeight} KG</strong>
              </p>
              <p className="text-[#526458]">
                Citizen Reward Rate: <strong className="text-amber-700 font-bold">+{activeModalRecord.plasticTypeId?.pointsPerKg} pts/kg</strong>
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#14231b] mb-1.5">Recycled Yield (KG)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max={activeModalRecord.receivedWeight}
                  required
                  value={recycledWeight}
                  onChange={(e) => setRecycledWeight(e.target.value)}
                  className="w-full bg-[#fbfbf9] border border-[#d8e2dc] rounded-xl px-3.5 py-2.5 text-sm font-bold text-[#1b4332] focus:outline-none focus:ring-2 focus:ring-[#1b4332]/20 focus:border-[#1b4332] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#14231b] mb-1.5">Rejected Contaminants (KG)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max={activeModalRecord.receivedWeight}
                  required
                  value={rejectedWeight}
                  onChange={(e) => setRejectedWeight(e.target.value)}
                  className="w-full bg-[#fbfbf9] border border-[#d8e2dc] rounded-xl px-3.5 py-2.5 text-sm font-bold text-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#fefce8] border border-[#fef08a] flex items-center justify-between text-xs">
              <span className="text-[#854d0e] font-medium flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" /> Points Credited:
              </span>
              <strong className="text-[#713f12] font-extrabold text-sm">
                +{Math.round((Number(recycledWeight) || 0) * (activeModalRecord.plasticTypeId?.pointsPerKg || 10))} PTS
              </strong>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#14231b] mb-1.5">Processing Notes (Optional)</label>
              <textarea
                rows="2"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Flakes washed, extruded into rPET pellets for commercial packaging."
                className="w-full bg-[#fbfbf9] border border-[#d8e2dc] rounded-xl p-3 text-xs text-[#14231b] placeholder-[#a0afa5] focus:outline-none focus:ring-2 focus:ring-[#1b4332]/20 focus:border-[#1b4332] transition"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-bold text-sm shadow-sm transition disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{submitting ? 'Crediting Points...' : 'Complete Batch & Credit User Points'}</span>
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default RecyclerMaterialsPage;
