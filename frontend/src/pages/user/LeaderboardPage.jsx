import React, { useEffect, useState } from 'react';
import { Trophy, Medal, Award, Flame, Filter, Sparkles, Crown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const LeaderboardPage = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all-time');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/rewards/leaderboard?filter=${filter}`);
        setLeaderboard(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [filter]);

  if (loading) return <LoadingSpinner message="Calculating community eco rankings..." />;

  const top3 = leaderboard.slice(0, 3);
  const restList = leaderboard.slice(3);
  const currentUserEntry = leaderboard.find((item) => user && user._id === item.id);

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Header with Title and Timeframe Filters */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e2e8df] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-extrabold text-[#92400e] uppercase tracking-widest bg-[#fefce8] px-3 py-1 rounded-full border border-[#fef08a]">
            Community Impact Champions
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14231b] mt-2 tracking-tight">
            Plastic Diversion Leaderboard
          </h1>
          <p className="text-xs sm:text-sm text-[#5a6c60] mt-0.5">
            Recognizing citizens leading household and neighborhood plastic waste circularity.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-[#f4f7f4] p-1.5 rounded-2xl border border-[#dce6df] self-end sm:self-center">
          <button
            onClick={() => setFilter('all-time')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === 'all-time'
                ? 'bg-[#1b4332] text-white shadow-sm'
                : 'text-[#627367] hover:text-[#14231b]'
            }`}
          >
            All-Time Impact
          </button>
          <button
            onClick={() => setFilter('monthly')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === 'monthly'
                ? 'bg-[#1b4332] text-white shadow-sm'
                : 'text-[#627367] hover:text-[#14231b]'
            }`}
          >
            This Month
          </button>
        </div>
      </div>

      {/* Current User Standing Banner */}
      {currentUserEntry && (
        <div className="bg-[#edf6f0] p-5 sm:p-6 rounded-3xl border border-[#cbe3d3] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#1b4332] text-white flex items-center justify-center font-extrabold text-base shadow-sm">
              #{currentUserEntry.rank}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#2d6a4f] block">
                Your Community Ranking
              </span>
              <h3 className="text-lg font-black text-[#14231b]">{currentUserEntry.name} (You)</h3>
              <p className="text-xs text-[#526458]">
                {currentUserEntry.totalPlasticRecycled || 0} KG plastic recycled • {currentUserEntry.badge}
              </p>
            </div>
          </div>

          <div className="text-right self-end sm:self-center">
            <span className="text-2xl font-black text-[#92400e] block">+{currentUserEntry.points || 0} PTS</span>
            <span className="text-xs text-[#2d6a4f] font-semibold">Keep recycling to climb!</span>
          </div>
        </div>
      )}

      {/* Top 3 Visual Podium Showcase (Section 14) */}
      {top3.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Rank 2 */}
          {top3[1] && (
            <div className="bg-white p-6 rounded-3xl border border-[#e2e8df] shadow-sm text-center flex flex-col justify-between order-2 md:order-1">
              <div>
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-extrabold text-xs mb-3">
                  🥈 #2
                </span>
                <img
                  src={top3[1].profileImage}
                  alt={top3[1].name}
                  className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-slate-300 shadow-sm"
                />
                <h3 className="font-extrabold text-base text-[#14231b] mt-3">{top3[1].name}</h3>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#edf6f0] text-[#1b4332] border border-[#cbe3d3]">
                  {top3[1].badge}
                </span>
              </div>
              <div className="mt-5 pt-4 border-t border-[#edf2ec]">
                <p className="text-2xl font-black text-[#1b4332]">+{top3[1].points || 0} PTS</p>
                <p className="text-xs text-[#627367] mt-0.5">{top3[1].totalPlasticRecycled || 0} KG Recycled</p>
              </div>
            </div>
          )}

          {/* Rank 1 (Gold, elevated) */}
          {top3[0] && (
            <div className="bg-[#fefce8]/60 p-7 rounded-3xl border-2 border-[#fde047] shadow-md text-center flex flex-col justify-between order-1 md:order-2 md:-translate-y-2">
              <div>
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#fef08a] text-[#854d0e] font-black text-base mb-3 shadow-sm">
                  👑 #1
                </span>
                <img
                  src={top3[0].profileImage}
                  alt={top3[0].name}
                  className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-[#eab308] shadow-md"
                />
                <h3 className="font-black text-lg text-[#14231b] mt-3">{top3[0].name}</h3>
                <span className="inline-block mt-1 px-3 py-1 rounded-full text-xs font-black bg-[#fef08a] text-[#713f12]">
                  {top3[0].badge}
                </span>
              </div>
              <div className="mt-6 pt-4 border-t border-[#fef08a]">
                <p className="text-3xl font-black text-[#854d0e]">+{top3[0].points || 0} PTS</p>
                <p className="text-xs text-[#713f12] font-bold mt-0.5">{top3[0].totalPlasticRecycled || 0} KG Diverted</p>
              </div>
            </div>
          )}

          {/* Rank 3 */}
          {top3[2] && (
            <div className="bg-white p-6 rounded-3xl border border-[#e2e8df] shadow-sm text-center flex flex-col justify-between order-3 md:order-3">
              <div>
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-50 text-amber-800 font-extrabold text-xs mb-3">
                  🥉 #3
                </span>
                <img
                  src={top3[2].profileImage}
                  alt={top3[2].name}
                  className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-amber-300 shadow-sm"
                />
                <h3 className="font-extrabold text-base text-[#14231b] mt-3">{top3[2].name}</h3>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#edf6f0] text-[#1b4332] border border-[#cbe3d3]">
                  {top3[2].badge}
                </span>
              </div>
              <div className="mt-5 pt-4 border-t border-[#edf2ec]">
                <p className="text-2xl font-black text-[#1b4332]">+{top3[2].points || 0} PTS</p>
                <p className="text-xs text-[#627367] mt-0.5">{top3[2].totalPlasticRecycled || 0} KG Recycled</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Ranks 4+ List */}
      {restList.length > 0 && (
        <div className="bg-white rounded-3xl border border-[#e2e8df] shadow-sm overflow-hidden p-6 sm:p-8 space-y-4">
          <h3 className="font-extrabold text-base text-[#14231b] tracking-tight">Active Community Members</h3>

          <div className="divide-y divide-[#edf2ec]">
            {restList.map((item) => {
              const isCurrentUser = user && user._id === item.id;
              return (
                <div
                  key={item.id}
                  className={`py-4 flex items-center justify-between gap-4 transition-colors ${
                    isCurrentUser ? 'bg-[#edf6f0] px-4 rounded-2xl' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono font-extrabold text-xs text-[#6e8174] w-8">
                      {item.rank < 10 ? `0${item.rank}` : item.rank}
                    </span>
                    <img
                      src={item.profileImage}
                      alt={item.name}
                      className="w-10 h-10 rounded-full object-cover border border-[#c9d8cd]"
                    />
                    <div>
                      <h4 className="font-extrabold text-sm text-[#14231b]">
                        {item.name} {isCurrentUser && <span className="text-[#1b4332] text-xs font-bold">(You)</span>}
                      </h4>
                      <span className="text-[11px] text-[#617367] font-semibold">{item.badge}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-black text-[#1b4332] block">+{item.points || 0} PTS</span>
                    <span className="text-xs text-[#6b7e72]">{item.totalPlasticRecycled || 0} KG</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaderboardPage;
