import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, Gift, Sparkles, CheckCircle2, History, Filter } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';

const RewardsPage = () => {
  const { user, refreshUser, showToast } = useAuth();
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedReward, setSelectedReward] = useState(null);
  const [redeeming, setRedeeming] = useState(false);
  const [redemptionResult, setRedemptionResult] = useState(null);

  const fetchRewards = async () => {
    try {
      const res = await API.get('/rewards');
      setRewards(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRewards();
  }, []);

  const handleRedeem = async () => {
    if (!selectedReward) return;

    if ((user?.points || 0) < selectedReward.pointsRequired) {
      showToast(`Insufficient points! You need ${selectedReward.pointsRequired} points.`, 'error');
      return;
    }

    setRedeeming(true);
    try {
      const res = await API.post('/rewards/redeem', { rewardId: selectedReward._id });
      setRedemptionResult(res.data);
      await refreshUser();
      await fetchRewards();
      showToast('Reward redeemed successfully! 🎉', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setRedeeming(false);
    }
  };

  const categories = ['E-Voucher', 'Eco Product', 'Tree Planting', 'Discount Card', 'Merchandise'];
  const filteredRewards = selectedCategory
    ? rewards.filter((r) => r.category === selectedCategory)
    : rewards;

  if (loading) return <LoadingSpinner message="Loading rewards catalog..." />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs border border-amber-500/30">
            <Gift className="w-4 h-4" /> Rewards & Vouchers Marketplace
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">Eco Reward Catalog</h1>
          <p className="text-xs text-slate-400 mt-1">Exchange your plastic recycling reward points for vouchers and sustainable items</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="px-5 py-3 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Your Wallet Balance</span>
            <span className="text-2xl font-extrabold text-amber-400">{user?.points || 0} PTS</span>
          </div>

          <Link
            to="/rewards/history"
            className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <History className="w-4 h-4" /> My Vouchers
          </Link>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCategory('')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            selectedCategory === ''
              ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
              : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
          }`}
        >
          All Rewards
        </button>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setSelectedCategory(c)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              selectedCategory === c
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRewards.map((r) => {
          const canAfford = (user?.points || 0) >= r.pointsRequired;
          return (
            <div key={r._id} className="glass-card glass-card-hover rounded-3xl border border-slate-800 overflow-hidden flex flex-col justify-between">
              <div>
                <div className="relative h-44 overflow-hidden">
                  <img src={r.image} alt={r.name} className="w-full h-full object-cover" />
                  <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-400 font-extrabold text-xs border border-amber-500/30">
                    {r.pointsRequired} PTS
                  </span>
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-slate-900/90 text-slate-300 font-semibold text-[10px]">
                    {r.category}
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="font-bold text-sm text-white leading-snug">{r.name}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{r.description}</p>
                  <p className="text-[11px] text-slate-500 font-semibold">Stock Available: {r.quantity} left</p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => {
                    setSelectedReward(r);
                    setRedemptionResult(null);
                  }}
                  disabled={r.quantity <= 0}
                  className={`w-full py-3 rounded-xl font-extrabold text-xs transition-all shadow-lg ${
                    r.quantity <= 0
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : canAfford
                      ? 'eco-button-gradient text-slate-950 hover:scale-[1.02]'
                      : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'
                  }`}
                >
                  {r.quantity <= 0 ? 'Out of Stock' : canAfford ? 'Redeem Voucher' : `Requires ${r.pointsRequired} PTS`}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Redemption Confirmation Modal */}
      {selectedReward && (
        <Modal
          isOpen={!!selectedReward}
          onClose={() => {
            setSelectedReward(null);
            setRedemptionResult(null);
          }}
          title={redemptionResult ? '🎉 Redemption Successful!' : `Redeem ${selectedReward.name}`}
        >
          {redemptionResult ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/40">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Voucher Claimed!</h3>
                <p className="text-xs text-slate-400 mt-1">Your reward code has been generated.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/40 max-w-xs mx-auto">
                <p className="text-[10px] text-slate-400 uppercase font-bold">Voucher Code</p>
                <p className="text-xl font-mono font-extrabold text-emerald-400 mt-1 select-all tracking-wider">
                  {redemptionResult.redemptionCode}
                </p>
              </div>

              <div className="pt-2">
                <Link
                  to="/rewards/history"
                  onClick={() => setSelectedReward(null)}
                  className="inline-block py-2.5 px-6 rounded-xl bg-slate-800 text-xs font-bold text-white hover:bg-slate-700"
                >
                  View My Redemptions History →
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
                <img src={selectedReward.image} alt={selectedReward.name} className="w-16 h-16 object-cover rounded-xl" />
                <div>
                  <h4 className="font-bold text-sm text-white">{selectedReward.name}</h4>
                  <p className="text-xs text-amber-400 font-extrabold mt-0.5">{selectedReward.pointsRequired} Points Required</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Current Points Balance:</span>
                  <span className="font-bold text-white">{user?.points || 0} PTS</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Points After Redemption:</span>
                  <span className="font-bold text-emerald-400">{(user?.points || 0) - selectedReward.pointsRequired} PTS</span>
                </div>
              </div>

              <button
                onClick={handleRedeem}
                disabled={redeeming}
                className="w-full py-3.5 rounded-xl eco-button-gradient text-slate-950 font-extrabold text-xs shadow-xl"
              >
                {redeeming ? 'Processing Redemption...' : 'Confirm Redemption'}
              </button>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

export default RewardsPage;
