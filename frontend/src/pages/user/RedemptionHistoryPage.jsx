import React, { useEffect, useState } from 'react';
import { Gift, Copy, Check } from 'lucide-react';
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

  if (loading) return <LoadingSpinner message="Fetching redemption history..." />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Redemption History</h1>
        <p className="text-xs text-slate-400 mt-1">View your claimed reward vouchers and status</p>
      </div>

      {redemptions.length === 0 ? (
        <EmptyState title="No redemptions yet" description="Redeem vouchers from the rewards catalog to view your codes here." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {redemptions.map((r) => (
            <div key={r._id} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img src={r.rewardId?.image} alt={r.rewardId?.name} className="w-12 h-12 rounded-xl object-cover" />
                  <div>
                    <h4 className="font-bold text-sm text-white">{r.rewardId?.name}</h4>
                    <span className="text-xs text-amber-400 font-semibold">-{r.pointsUsed} PTS</span>
                  </div>
                </div>
                <StatusBadge status={r.status} />
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Voucher Code</span>
                  <span className="font-mono font-extrabold text-emerald-400 tracking-wider">{r.redemptionCode}</span>
                </div>
                <button
                  onClick={() => handleCopy(r.redemptionCode, r._id)}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1 font-bold text-[11px]"
                >
                  {copiedId === r._id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId === r._id ? 'Copied' : 'Copy'}
                </button>
              </div>

              <p className="text-[11px] text-slate-500">Redeemed on: {new Date(r.redeemedAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RedemptionHistoryPage;
