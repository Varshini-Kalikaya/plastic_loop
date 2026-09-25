import React, { useEffect, useState } from 'react';
import { Gift, Plus, Edit2, CheckCircle2, Sparkles, Package, Tag } from 'lucide-react';
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
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e8f0ea] text-[#1b4332] text-xs font-semibold uppercase tracking-wider mb-2">
            <Gift className="w-3.5 h-3.5" />
            <span>Incentives & Gamification</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14231b] tracking-tight">Rewards & Redemptions Control</h1>
          <p className="text-sm text-[#526458] mt-1">Manage catalog vouchers, stock levels, and audit citizen reward fulfillment.</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-bold text-xs shadow-sm transition self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Reward Voucher</span>
        </button>
      </div>

      {/* Rewards Catalog */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-[#14231b]">Active Reward Catalog ({rewards.length})</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rewards.map((r) => (
            <div key={r._id} className="bg-white p-4 rounded-3xl border border-[#e2e8df] shadow-sm flex items-center gap-3.5 hover:shadow-md transition">
              {r.image ? (
                <img src={r.image} alt={r.name} className="w-16 h-16 rounded-2xl object-cover border border-[#edf2ec] shrink-0" />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-[#e8f0ea] text-[#1b4332] flex items-center justify-center shrink-0">
                  <Gift className="w-7 h-7" />
                </div>
              )}
              <div className="flex-1 overflow-hidden">
                <h4 className="font-bold text-xs text-[#14231b] truncate">{r.name}</h4>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-xs font-extrabold text-[#92400e] bg-[#fefce8] px-2 py-0.5 rounded-md border border-[#fef08a]">
                    {r.pointsRequired} PTS
                  </span>
                </div>
                <p className="text-[11px] text-[#718477] mt-1">Stock: {r.quantity} available</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Redemptions Table */}
      <div className="bg-white rounded-3xl border border-[#e2e8df] shadow-sm overflow-hidden space-y-0">
        <div className="p-6 border-b border-[#edf2ec]">
          <h3 className="font-bold text-base text-[#14231b]">Citizen Redemptions Audit Log</h3>
          <p className="text-xs text-[#718477] mt-0.5">Track voucher codes claimed by citizens and process fulfillment</p>
        </div>

        {redemptions.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="w-12 h-12 rounded-full bg-[#e8f0ea] flex items-center justify-center mx-auto mb-3 text-[#1b4332]">
              <Gift className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-[#14231b]">No redemptions logged yet</p>
            <p className="text-xs text-[#718477] mt-1">When users redeem their eco points for vouchers, logs appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#edf2ec] text-[11px] font-bold text-[#718477] uppercase bg-[#fbfbf9]">
                  <th className="py-3.5 px-6">Voucher Code</th>
                  <th className="py-3.5 px-6">Citizen</th>
                  <th className="py-3.5 px-6">Reward Item</th>
                  <th className="py-3.5 px-6">Points Debited</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#edf2ec] text-xs text-[#14231b]">
                {redemptions.map((r) => (
                  <tr key={r._id} className="hover:bg-[#fbfbf9] transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-[#1b4332] tracking-wider">
                      {r.redemptionCode}
                    </td>
                    <td className="py-4 px-6 font-semibold text-[#14231b]">{r.userId?.name || 'Citizen'}</td>
                    <td className="py-4 px-6 text-[#526458] font-medium">{r.rewardId?.name || 'Voucher'}</td>
                    <td className="py-4 px-6 font-bold text-[#92400e]">-{r.pointsUsed} PTS</td>
                    <td className="py-4 px-6">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="py-4 px-6 text-right">
                      {r.status === 'APPROVED' && (
                        <button
                          onClick={() => handleStatusUpdate(r._id, 'FULFILLED')}
                          className="px-3 py-1.5 rounded-lg bg-[#e8f0ea] hover:bg-[#d5e4d9] border border-[#d8e2dc] text-[#1b4332] font-bold text-xs transition cursor-pointer"
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
        )}
      </div>

      {/* Add Modal */}
      {modalOpen && (
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Reward Item to Catalog">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#14231b] mb-1.5">Reward Title</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. ₹250 Amazon E-Voucher"
                className="w-full bg-[#fbfbf9] border border-[#d8e2dc] rounded-xl px-3.5 py-2.5 text-sm text-[#14231b] placeholder-[#a0afa5] focus:outline-none focus:ring-2 focus:ring-[#1b4332]/20 focus:border-[#1b4332] transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#14231b] mb-1.5">Points Required</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.pointsRequired}
                  onChange={(e) => setFormData({ ...formData, pointsRequired: Number(e.target.value) })}
                  className="w-full bg-[#fbfbf9] border border-[#d8e2dc] rounded-xl px-3.5 py-2.5 text-sm font-bold text-[#1b4332] focus:outline-none focus:ring-2 focus:ring-[#1b4332]/20 focus:border-[#1b4332] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#14231b] mb-1.5">Stock Quantity</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                  className="w-full bg-[#fbfbf9] border border-[#d8e2dc] rounded-xl px-3.5 py-2.5 text-sm font-bold text-[#14231b] focus:outline-none focus:ring-2 focus:ring-[#1b4332]/20 focus:border-[#1b4332] transition"
                />
              </div>
            </div>

            <div>
              <ImageUploader label="Reward Banner Image" onUploadSuccess={(url) => setFormData((prev) => ({ ...prev, image: url }))} />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#14231b] mb-1.5">Description & Terms</label>
              <textarea
                rows="2"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Redemption guidelines, voucher validity, and partner conditions..."
                className="w-full bg-[#fbfbf9] border border-[#d8e2dc] rounded-xl p-3 text-xs text-[#14231b] placeholder-[#a0afa5] focus:outline-none focus:ring-2 focus:ring-[#1b4332]/20 focus:border-[#1b4332] transition"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-bold text-sm shadow-sm transition disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
            >
              <Gift className="w-4 h-4" />
              <span>{submitting ? 'Saving...' : 'Add Reward to Catalog'}</span>
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default RewardsManagementPage;
