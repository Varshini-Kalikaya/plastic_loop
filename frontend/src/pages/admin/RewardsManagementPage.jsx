import React, { useEffect, useState } from 'react';
import { Gift, Plus, Edit2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import Modal from '../../components/Modal';
import StatusBadge from '../../components/StatusBadge';
import ImageUploader from '../../components/ImageUploader';
import LoadingSpinner from '../../components/LoadingSpinner';

const RewardsManagementPage = () => {
  const { showToast } = useAuth();
  const [rewards, setRewards] = useState([]);
  const [redemptions, setRedemptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingReward, setEditingReward] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    pointsRequired: 100,
    quantity: 50,
    category: 'E-Voucher',
    image: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const rewardRes = await API.get('/rewards');
      setRewards(rewardRes.data || []);

      const redRes = await API.get('/admin/redemptions');
      setRedemptions(redRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAdd = () => {
    setEditingReward(null);
    setFormData({ name: '', description: '', pointsRequired: 100, quantity: 50, category: 'E-Voucher', image: '' });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingReward) {
        await API.put(`/rewards/${editingReward._id}`, formData);
        showToast('Reward updated successfully', 'success');
      } else {
        await API.post('/rewards', formData);
        showToast('Reward added to catalog', 'success');
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await API.put(`/admin/redemptions/${id}`, { status });
      showToast(`Redemption marked as ${status}`, 'success');
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  if (loading) return <LoadingSpinner message="Loading rewards management..." />;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Rewards & Redemptions Control</h1>
          <p className="text-xs text-slate-400 mt-1">Manage catalog vouchers and audit citizen redemptions</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl eco-button-gradient text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg"
        >
          <Plus className="w-4 h-4" /> Add Reward Voucher
        </button>
      </div>

      {/* Rewards Catalog */}
      <div className="space-y-4">
        <h3 className="font-bold text-base text-white">Reward Catalog</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {rewards.map((r) => (
            <div key={r._id} className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
              <img src={r.image} alt={r.name} className="w-16 h-16 rounded-xl object-cover" />
              <div className="flex-1 overflow-hidden">
                <h4 className="font-bold text-xs text-white truncate">{r.name}</h4>
                <p className="text-[11px] text-amber-400 font-extrabold mt-0.5">{r.pointsRequired} PTS</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Stock: {r.quantity} left</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Redemptions Table */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="font-bold text-base text-white">Citizen Redemptions Audit Log</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase">
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Citizen</th>
                <th className="py-3 px-4">Reward Item</th>
                <th className="py-3 px-4">Points Used</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs text-slate-200">
              {redemptions.map((r) => (
                <tr key={r._id} className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-mono font-bold text-emerald-400">{r.redemptionCode}</td>
                  <td className="py-3 px-4 font-semibold">{r.userId?.name}</td>
                  <td className="py-3 px-4">{r.rewardId?.name}</td>
                  <td className="py-3 px-4 font-bold text-amber-400">-{r.pointsUsed} PTS</td>
                  <td className="py-3 px-4">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="py-3 px-4">
                    {r.status === 'APPROVED' && (
                      <button
                        onClick={() => handleStatusUpdate(r._id, 'FULFILLED')}
                        className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[11px]"
                      >
                        Mark Fulfilled
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Reward Item">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">Reward Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="₹250 Amazon Voucher"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">Points Required</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.pointsRequired}
                  onChange={(e) => setFormData({ ...formData, pointsRequired: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">Quantity Stock</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <ImageUploader label="Reward Banner Image" onUploadSuccess={(url) => setFormData((prev) => ({ ...prev, image: url }))} />

            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">Description</label>
              <textarea
                rows="2"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl eco-button-gradient text-slate-950 font-extrabold text-xs shadow-lg"
            >
              {submitting ? 'Saving...' : 'Add Reward to Catalog'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default RewardsManagementPage;
