import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, Gift, Sparkles, CheckCircle2, History, Filter, ArrowRight, ShieldCheck } from 'lucide-react';
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

  // Next reward progress calculation
  const userPoints = user?.points || 0;
  const upcomingRewards = [...rewards]
    .filter((r) => r.pointsRequired > userPoints)
    .sort((a, b) => a.pointsRequired - b.pointsRequired);

  const nextReward = upcomingRewards[0];
  const pointsToNext = nextReward ? nextReward.pointsRequired - userPoints : 0;
  const nextRewardPercent = nextReward
    ? Math.min(100, Math.round((userPoints / nextReward.pointsRequired) * 100))
    : 100;

  // Featured Reward (e.g. Tree planting or highest demand voucher)
  const featuredReward = rewards.find((r) => r.category === 'Eco Product') || rewards[0];

  if (loading) return <LoadingSpinner message="Loading rewards marketplace..." />;

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* 1. Points Balance Hero & Next Reward Progress Banner (Section 13) */}
      <div className="bg-white rounded-3xl border border-[#e2e8df] p-6 sm:p-10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#fefce8] rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-extrabold text-[#92400e] uppercase tracking-widest bg-[#fefce8] px-3 py-1 rounded-full border border-[#fef08a]">
              Sustainable Rewards Marketplace
            </span>
            <div>
              <span className="text-xs font-bold text-[#627368] uppercase tracking-wider block">Your Balance</span>
              <h1 className="text-3xl sm:text-5xl font-black text-[#14231b] mt-1 tracking-tight">
                {userPoints} <span className="text-2xl sm:text-3xl font-bold text-[#92400e]">POINTS</span>
              </h1>
            </div>

            {/* Progress to next reward */}
            <div className="pt-2 max-w-md space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-[#55695d]">
                  {nextReward ? `You're ${pointsToNext} points away from ${nextReward.name}` : 'You can afford all rewards!'}
                </span>
                <span className="text-[#1b4332]">{nextRewardPercent}%</span>
              </div>
              <div className="w-full h-2.5 bg-[#eef3ef] rounded-full overflow-hidden p-0.5 border border-[#d8e4db]">
                <div
                  className="h-full bg-[#1b4332] rounded-full transition-all duration-700"
                  style={{ width: `${Math.max(5, nextRewardPercent)}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <Link
              to="/rewards/history"
              className="px-6 py-3.5 rounded-2xl eco-btn-secondary text-xs font-bold flex items-center justify-center gap-2 text-center"
            >
              <History className="w-4 h-4 text-[#2d6a4f]" /> My Redeemed Vouchers
            </Link>
            <Link
              to="/request-pickup"
              className="px-6 py-3.5 rounded-2xl eco-btn-primary text-xs font-bold flex items-center justify-center gap-2 text-center shadow-sm"
            >
              <span>Recycle for More Points</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Featured Reward Spotlight Card */}
      {featuredReward && (
        <div className="bg-[#f5f8f5] rounded-3xl border border-[#dce6df] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <img
              src={featuredReward.image}
              alt={featuredReward.name}
              className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover border border-[#cbe0d1] shadow-sm shrink-0"
            />
            <div className="space-y-1.5 text-center sm:text-left">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#1b4332] bg-[#edf6f0] px-2.5 py-0.5 rounded-full border border-[#c6e0cc]">
                Featured Impact Item
              </span>
              <h3 className="text-lg sm:text-xl font-extrabold text-[#14231b]">{featuredReward.name}</h3>
              <p className="text-xs text-[#526458] max-w-lg leading-relaxed">{featuredReward.description}</p>
              <p className="text-xs font-black text-[#92400e] pt-1">Requires {featuredReward.pointsRequired} Points</p>
            </div>
          </div>

          <button
            onClick={() => {
              setSelectedReward(featuredReward);
              setRedemptionResult(null);
            }}
            disabled={featuredReward.quantity <= 0 || userPoints < featuredReward.pointsRequired}
            className={`px-7 py-3.5 rounded-2xl font-bold text-xs shrink-0 transition-all ${
              userPoints >= featuredReward.pointsRequired && featuredReward.quantity > 0
                ? 'eco-btn-primary shadow-sm hover:scale-105'
                : 'bg-white border border-[#d2ded5] text-[#8fa295] cursor-not-allowed'
            }`}
          >
            {userPoints >= featuredReward.pointsRequired ? 'Redeem Spotlight Reward' : `Need ${featuredReward.pointsRequired - userPoints} More Pts`}
          </button>
        </div>
      )}

      {/* 3. Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            selectedCategory === ''
              ? 'bg-[#1b4332] text-white shadow-sm'
              : 'bg-white text-[#526458] border border-[#e2e8df] hover:text-[#14231b]'
          }`}
        >
          All Marketplace Rewards
        </button>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setSelectedCategory(c)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              selectedCategory === c
                ? 'bg-[#1b4332] text-white shadow-sm'
                : 'bg-white text-[#526458] border border-[#e2e8df] hover:text-[#14231b]'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* 4. Rewards Grid with Clean Botanical Treatment */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRewards.map((r) => {
          const canAfford = userPoints >= r.pointsRequired;
          return (
            <div
              key={r._id}
              className="bg-white rounded-3xl border border-[#e2e8df] overflow-hidden flex flex-col justify-between shadow-sm hover:border-[#b8cfbf] transition-all"
            >
              <div>
                <div className="relative h-48 overflow-hidden bg-[#f4f7f4]">
                  <img src={r.image} alt={r.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-3.5 right-3.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#92400e] font-black text-xs border border-[#fef08a] shadow-sm">
                    {r.pointsRequired} PTS
                  </span>
                  <span className="absolute top-3.5 left-3.5 px-2.5 py-0.5 rounded-full bg-[#1b4332]/90 text-white font-bold text-[10px]">
                    {r.category}
                  </span>
                </div>

                <div className="p-6 space-y-2">
                  <h3 className="font-extrabold text-base text-[#14231b] leading-snug">{r.name}</h3>
                  <p className="text-xs text-[#526458] line-clamp-2 leading-relaxed">{r.description}</p>
                  <p className="text-[11px] text-[#718477] font-semibold pt-1">
                    Available Stock: {r.quantity} vouchers left
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  onClick={() => {
                    setSelectedReward(r);
                    setRedemptionResult(null);
                  }}
                  disabled={r.quantity <= 0}
                  className={`w-full py-3.5 rounded-xl font-bold text-xs transition-all ${
                    r.quantity <= 0
                      ? 'bg-[#f4f6f4] text-[#8fa295] cursor-not-allowed border border-[#e2e8df]'
                      : canAfford
                      ? 'eco-btn-primary shadow-sm'
                      : 'bg-[#f8faf8] text-[#718477] border border-[#dce6df] hover:border-[#b9cebf]'
                  }`}
                >
                  {r.quantity <= 0 ? 'Out of Stock' : canAfford ? 'Redeem Voucher' : `Requires ${r.pointsRequired} PTS (${r.pointsRequired - userPoints} more)`}
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
            <div className="text-center space-y-5 py-4">
              <div className="w-16 h-16 rounded-full bg-[#edf6f0] text-[#1b4332] mx-auto flex items-center justify-center border border-[#b8dfc4]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-[#14231b]">Voucher Claimed!</h3>
                <p className="text-xs text-[#526458] mt-1">Your verified digital reward code has been generated.</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#fafbfa] border border-[#cbe3d3] max-w-sm mx-auto space-y-1">
                <span className="text-[10px] text-[#627367] uppercase font-bold tracking-wider block">Voucher Code</span>
                <p className="text-2xl font-mono font-black text-[#1b4332] select-all tracking-wider">
                  {redemptionResult.redemptionCode}
                </p>
                <span className="text-[10px] text-[#718477]">Show or apply this code at checkout</span>
              </div>

              <div className="pt-2">
                <Link
                  to="/rewards/history"
                  onClick={() => setSelectedReward(null)}
                  className="inline-block py-3 px-6 rounded-xl eco-btn-secondary text-xs font-bold"
                >
                  View My Redemptions History →
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#fafbfa] border border-[#e2e8df]">
                <img src={selectedReward.image} alt={selectedReward.name} className="w-16 h-16 object-cover rounded-xl border border-[#d6e2d8]" />
                <div>
                  <h4 className="font-extrabold text-sm text-[#14231b]">{selectedReward.name}</h4>
                  <p className="text-xs text-[#92400e] font-extrabold mt-0.5">{selectedReward.pointsRequired} Points Required</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#fafbfa] border border-[#e2e8df] space-y-2 text-xs">
                <div className="flex justify-between text-[#5c6f62]">
                  <span>Current Points Balance:</span>
                  <span className="font-extrabold text-[#14231b]">{userPoints} PTS</span>
                </div>
                <div className="flex justify-between text-[#5c6f62]">
                  <span>Points After Redemption:</span>
                  <span className="font-extrabold text-[#1b4332]">{userPoints - selectedReward.pointsRequired} PTS</span>
                </div>
              </div>

              <button
                onClick={handleRedeem}
                disabled={redeeming}
                className="w-full py-3.5 rounded-xl eco-btn-primary text-xs font-bold shadow-sm"
              >
                {redeeming ? 'Processing Redemption...' : 'Confirm Redemption & Generate Code'}
              </button>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

export default RewardsPage;
