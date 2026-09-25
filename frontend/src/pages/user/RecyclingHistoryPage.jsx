import React, { useEffect, useState } from 'react';
import { History, RefreshCw, Award, CheckCircle2, List, Calendar, Sparkles } from 'lucide-react';
import API from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

const RecyclingHistoryPage = () => {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('timeline'); // 'timeline' or 'compact'

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

  if (loading) return <LoadingSpinner message="Fetching verified recycling records..." />;

  const totalKg = pickups.reduce((acc, p) => acc + (p.actualWeight || p.estimatedWeight || 0), 0);
  const totalPoints = pickups.reduce((acc, p) => {
    const rate = p.plasticTypeId?.pointsPerKg || 10;
    return acc + Math.round((p.actualWeight || p.estimatedWeight || 0) * rate);
  }, 0);

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e2e8df] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-extrabold text-[#1b4332] uppercase tracking-widest bg-[#edf6f0] px-3 py-1 rounded-full border border-[#cadbc5]">
            Verified Plant Records
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14231b] mt-2 tracking-tight">
            Recycling Milestones & History
          </h1>
          <p className="text-xs sm:text-sm text-[#5a6c60] mt-0.5">
            Certified recycling records processed and pelletized at partnered mechanical recycling centers.
          </p>
        </div>

        {/* View Toggle Mode */}
        <div className="flex items-center gap-2 bg-[#f4f7f4] p-1.5 rounded-2xl border border-[#dce6df] self-end sm:self-center">
          <button
            onClick={() => setViewMode('timeline')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              viewMode === 'timeline'
                ? 'bg-white text-[#1b4332] shadow-sm'
                : 'text-[#627367] hover:text-[#14231b]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" /> Timeline
          </button>
          <button
            onClick={() => setViewMode('compact')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              viewMode === 'compact'
                ? 'bg-white text-[#1b4332] shadow-sm'
                : 'text-[#627367] hover:text-[#14231b]'
            }`}
          >
            <List className="w-3.5 h-3.5" /> Compact Table
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8df] shadow-sm">
          <span className="text-[11px] font-bold text-[#627368] uppercase tracking-wider block">Total Diverted</span>
          <h3 className="text-2xl font-extrabold text-[#1b4332] mt-1">{totalKg.toFixed(1)} KG</h3>
          <p className="text-[11px] text-[#718477]">100% processed into secondary raw pellets</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8df] shadow-sm">
          <span className="text-[11px] font-bold text-[#627368] uppercase tracking-wider block">Total Reward Earned</span>
          <h3 className="text-2xl font-extrabold text-[#92400e] mt-1">+{totalPoints} PTS</h3>
          <p className="text-[11px] text-[#718477]">Credited to wallet balance</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8df] shadow-sm">
          <span className="text-[11px] font-bold text-[#627368] uppercase tracking-wider block">Completed Batches</span>
          <h3 className="text-2xl font-extrabold text-[#0369a1] mt-1">{pickups.length} Batches</h3>
          <p className="text-[11px] text-[#718477]">Verified recycling cycles</p>
        </div>
      </div>

      {pickups.length === 0 ? (
        <EmptyState
          title="No completed recycling records yet"
          description="Your completed recycling events will appear here once materials are processed at the plant."
        />
      ) : viewMode === 'timeline' ? (
        /* Timeline View (Section 12 requirement) */
        <div className="space-y-4 max-w-4xl mx-auto">
          {pickups.map((p) => {
            const date = new Date(p.updatedAt || p.createdAt);
            const formattedMonth = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
            const formattedDay = date.getDate();
            const weight = p.actualWeight || p.estimatedWeight || 0;
            const pointsEarned = Math.round(weight * (p.plasticTypeId?.pointsPerKg || 10));

            return (
              <div
                key={p._id}
                className="bg-white rounded-3xl border border-[#e2e8df] p-6 shadow-sm hover:border-[#b8cfbf] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
              >
                <div className="flex items-center gap-4">
                  {/* Date Pillar */}
                  <div className="w-14 h-14 rounded-2xl bg-[#edf6f0] border border-[#cbe3d3] flex flex-col items-center justify-center shrink-0">
                    <span className="text-[10px] font-extrabold text-[#2d6a4f]">{formattedMonth}</span>
                    <span className="text-xl font-black text-[#1b4332] leading-none mt-0.5">{formattedDay}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#1b4332] bg-[#f4f8f5] px-2 py-0.5 rounded">
                        #{p._id.slice(-6).toUpperCase()}
                      </span>
                      <h3 className="font-extrabold text-sm text-[#14231b]">{p.plasticTypeId?.name}</h3>
                    </div>
                    <p className="text-xs text-[#526458]">
                      Weight: <strong className="text-[#14231b]">{weight} KG</strong> ({p.plasticTypeId?.code})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center">
                  <div className="text-right">
                    <span className="text-base font-black text-[#92400e] block">+{pointsEarned} PTS</span>
                    <span className="text-[10px] text-[#718477]">Verified reward</span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#edf6f0] text-[#1b4332] border border-[#b8dfc4]">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Recycled
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Compact List View */
        <div className="bg-white rounded-3xl border border-[#e2e8df] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#edf2ec] text-[11px] font-bold text-[#627368] uppercase bg-[#fafbfa]">
                  <th className="py-4 px-6">Pickup ID</th>
                  <th className="py-4 px-6">Material Category</th>
                  <th className="py-4 px-6">Recycled Weight</th>
                  <th className="py-4 px-6">Points Credited</th>
                  <th className="py-4 px-6">Verified Date</th>
                  <th className="py-4 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#edf2ec] text-xs text-[#2a3830]">
                {pickups.map((p) => {
                  const weight = p.actualWeight || p.estimatedWeight || 0;
                  const pointsEarned = Math.round(weight * (p.plasticTypeId?.pointsPerKg || 10));
                  return (
                    <tr key={p._id} className="hover:bg-[#f6f9f7] transition-colors">
                      <td className="py-4 px-6 font-mono font-extrabold text-[#1b4332]">
                        #{p._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="py-4 px-6 font-bold text-[#14231b]">
                        {p.plasticTypeId?.name} <span className="text-[#65776c] font-normal">({p.plasticTypeId?.code})</span>
                      </td>
                      <td className="py-4 px-6 font-black text-[#1b4332]">{weight} KG</td>
                      <td className="py-4 px-6 font-black text-[#92400e]">+{pointsEarned} PTS</td>
                      <td className="py-4 px-6 text-[#627368]">
                        {new Date(p.updatedAt || p.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#edf6f0] text-[#1b4332] border border-[#b8dfc4]">
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
