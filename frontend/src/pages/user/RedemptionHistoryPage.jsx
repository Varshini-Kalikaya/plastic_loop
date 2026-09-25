import React, { useEffect, useState } from 'react';
import { Gift, Copy, Check, Calendar, Tag } from 'lucide-react';
import API from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

const RedemptionHistoryPage = () => {
  const [redemptions, setRedemptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    const fetchRedemptions = async () => {
      try {
        const res = await API.get('/rewards/my-redemptions');
        setRedemptions(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRedemptions();
  }, []);

  const handleCopy = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) return <LoadingSpinner message="Fetching your claimed vouchers..." />;

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e2e8df] shadow-sm">
        <span className="text-xs font-extrabold text-[#1b4332] uppercase tracking-widest bg-[#edf6f0] px-3 py-1 rounded-full border border-[#cadbc5]">
          Wallet Records
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14231b] mt-2 tracking-tight">
          Claimed Vouchers & Redemptions
        </h1>
        <p className="text-xs sm:text-sm text-[#5a6c60] mt-0.5">
          View and copy your active digital codes for partnering supermarkets, gifts, and eco-initiatives.
        </p>
      </div>

      {redemptions.length === 0 ? (
        <EmptyState
          title="No claimed vouchers yet"
          description="Exchange your recycling points in the rewards catalog to generate instant redemption codes."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {redemptions.map((r) => (
            <div
              key={r._id}
              className="bg-white rounded-3xl border border-[#e2e8df] p-6 shadow-sm hover:border-[#b8cfbf] transition-all space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <img
                    src={r.rewardId?.image}
                    alt={r.rewardId?.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-[#d6e3d9]"
                  />
                  <div>
                    <h3 className="font-extrabold text-sm text-[#14231b]">{r.rewardId?.name}</h3>
                    <span className="text-xs text-[#92400e] font-extrabold">-{r.pointsUsed} Points Used</span>
                  </div>
                </div>
                <StatusBadge status={r.status} />
              </div>

              <div className="p-4 rounded-2xl bg-[#fafbfa] border border-[#e2e8df] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-[#6b7d71] uppercase font-bold tracking-wider block">
                    Voucher Redemption Code
                  </span>
                  <span className="font-mono font-black text-base text-[#1b4332] tracking-wider select-all">
                    {r.redemptionCode}
                  </span>
                </div>
                <button
                  onClick={() => handleCopy(r.redemptionCode, r._id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                    copiedId === r._id
                      ? 'bg-[#edf6f0] text-[#1b4332] border border-[#cbe3d3]'
                      : 'eco-btn-secondary'
                  }`}
                >
                  {copiedId === r._id ? <Check className="w-3.5 h-3.5 text-[#1b4332]" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId === r._id ? 'Copied!' : 'Copy Code'}
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#718477] pt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#8fa295]" />
                  Claimed: {new Date(r.redeemedAt).toLocaleDateString()}
                </span>
                <span className="font-medium text-[#2d6a4f]">Verified Digital Code</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RedemptionHistoryPage;
