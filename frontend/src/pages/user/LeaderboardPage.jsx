import React, { useEffect, useState } from 'react';
import { Trophy, Medal, Award, Flame, Filter } from 'lucide-react';
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

  if (loading) return <LoadingSpinner message="Calculating eco rankings..." />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs border border-amber-500/30">
            <Trophy className="w-4 h-4" /> Community Leaderboard
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">Recycling Champions</h1>
          <p className="text-xs text-slate-400">Recognizing citizens leading plastic waste diversion</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setFilter('all-time')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              filter === 'all-time' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            All-Time
          </button>
          <button
            onClick={() => setFilter('monthly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              filter === 'monthly' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            This Month
          </button>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase bg-slate-900/60">
                <th className="py-3.5 px-5">Rank</th>
                <th className="py-3.5 px-5">Citizen</th>
                <th className="py-3.5 px-5">Eco Badge</th>
                <th className="py-3.5 px-5">Plastic Recycled</th>
                <th className="py-3.5 px-5">Total Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs text-slate-200">
              {leaderboard.map((item) => {
                const isCurrentUser = user && user._id === item.id;
                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      isCurrentUser ? 'bg-emerald-950/40 border-l-4 border-emerald-500 font-bold' : ''
                    }`}
                  >
                    <td className="py-4 px-5">
                      {item.rank === 1 ? (
                        <span className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 font-extrabold flex items-center justify-center border border-amber-500/40">
                          🥇
                        </span>
                      ) : item.rank === 2 ? (
                        <span className="w-8 h-8 rounded-full bg-slate-300/20 text-slate-300 font-extrabold flex items-center justify-center border border-slate-400/40">
                          🥈
                        </span>
                      ) : item.rank === 3 ? (
                        <span className="w-8 h-8 rounded-full bg-amber-700/20 text-amber-600 font-extrabold flex items-center justify-center border border-amber-700/40">
                          🥉
                        </span>
                      ) : (
                        <span className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 font-bold flex items-center justify-center text-xs">
                          #{item.rank}
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <img src={item.profileImage} alt={item.name} className="w-9 h-9 rounded-full object-cover border border-emerald-500/40" />
                        <div>
                          <p className="font-bold text-white text-xs">
                            {item.name} {isCurrentUser && <span className="text-[10px] text-emerald-400 font-bold ml-1">(You)</span>}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-5">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-800 text-emerald-400 border border-emerald-500/30">
                        {item.badge}
                      </span>
                    </td>

                    <td className="py-4 px-5 font-extrabold text-teal-300">{item.totalPlasticRecycled || 0} KG</td>
                    <td className="py-4 px-5 font-extrabold text-amber-400">+{item.points || 0} PTS</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
