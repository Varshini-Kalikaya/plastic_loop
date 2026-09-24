import React, { useEffect, useState } from 'react';
import { History, CheckCircle2 } from 'lucide-react';
import API from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const CollectorHistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await API.get('/collector/history');
        setHistory(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) return <LoadingSpinner message="Fetching collection history..." />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Collection History</h1>
        <p className="text-xs text-slate-400 mt-1">Log of verified plastic waste collections completed by your account</p>
      </div>

      <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase bg-slate-900/60">
                <th className="py-3.5 px-5">Pickup ID</th>
                <th className="py-3.5 px-5">Citizen</th>
                <th className="py-3.5 px-5">Plastic Category</th>
                <th className="py-3.5 px-5">Verified Weight</th>
                <th className="py-3.5 px-5">Collected Date</th>
                <th className="py-3.5 px-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs text-slate-200">
              {history.map((c) => (
                <tr key={c._id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-5 font-mono font-bold text-blue-400">#{c.pickupId?._id ? c.pickupId._id.slice(-6).toUpperCase() : 'N/A'}</td>
                  <td className="py-4 px-5 font-semibold text-white">{c.userId?.name}</td>
                  <td className="py-4 px-5">{c.plasticTypeId?.name}</td>
                  <td className="py-4 px-5 font-extrabold text-emerald-400">{c.actualWeight} KG</td>
                  <td className="py-4 px-5 text-slate-400">{new Date(c.collectedAt).toLocaleDateString()}</td>
                  <td className="py-4 px-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/10 text-teal-400 border border-teal-500/30">
                      <CheckCircle2 className="w-3.5 h-3.5" /> VERIFIED
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CollectorHistoryPage;
