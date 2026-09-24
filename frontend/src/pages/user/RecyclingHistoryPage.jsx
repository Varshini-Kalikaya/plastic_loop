import React, { useEffect, useState } from 'react';
import { History, RefreshCw, Award, CheckCircle2 } from 'lucide-react';
import API from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

const RecyclingHistoryPage = () => {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecyclingHistory = async () => {
      try {
        const res = await API.get('/pickups/my-pickups?status=RECYCLED');
        setPickups(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecyclingHistory();
  }, []);

  if (loading) return <LoadingSpinner message="Fetching recycling history..." />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Recycling History</h1>
        <p className="text-xs text-slate-400 mt-1">Verified recycling records processed at certified recycling plants</p>
      </div>

      {pickups.length === 0 ? (
        <EmptyState title="No recycling records yet" description="Completed recycling events will appear here after waste processing." />
      ) : (
        <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase bg-slate-900/60">
                  <th className="py-3.5 px-5">Pickup ID</th>
                  <th className="py-3.5 px-5">Plastic Material</th>
                  <th className="py-3.5 px-5">Recycled Weight</th>
                  <th className="py-3.5 px-5">Points Earned</th>
                  <th className="py-3.5 px-5">Completed Date</th>
                  <th className="py-3.5 px-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs text-slate-200">
                {pickups.map((p) => {
                  const pointsEarned = Math.round((p.actualWeight || p.estimatedWeight) * (p.plasticTypeId?.pointsPerKg || 10));
                  return (
                    <tr key={p._id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 px-5 font-mono font-bold text-emerald-400">#{p._id.slice(-6).toUpperCase()}</td>
                      <td className="py-4 px-5 font-bold text-white">
                        {p.plasticTypeId?.name} <span className="text-slate-400 font-normal">({p.plasticTypeId?.code})</span>
                      </td>
                      <td className="py-4 px-5 font-extrabold text-teal-300">{p.actualWeight || p.estimatedWeight} KG</td>
                      <td className="py-4 px-5 font-extrabold text-amber-400">+{pointsEarned} PTS</td>
                      <td className="py-4 px-5 text-slate-400">{new Date(p.updatedAt).toLocaleDateString()}</td>
                      <td className="py-4 px-5">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 className="w-3.5 h-3.5" /> RECYCLED
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecyclingHistoryPage;
