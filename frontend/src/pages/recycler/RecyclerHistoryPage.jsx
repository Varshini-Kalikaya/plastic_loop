import React, { useEffect, useState } from 'react';
import { History, CheckCircle2 } from 'lucide-react';
import API from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const RecyclerHistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await API.get('/recycler/materials?status=COMPLETED');
        setHistory(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) return <LoadingSpinner message="Fetching recycling plant history..." />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Recycling Batch History</h1>
        <p className="text-xs text-slate-400 mt-1">Processed material yield logs and completed recycling batches</p>
      </div>

      <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase bg-slate-900/60">
                <th className="py-3.5 px-5">Batch ID</th>
                <th className="py-3.5 px-5">Plastic Category</th>
                <th className="py-3.5 px-5">Received Weight</th>
                <th className="py-3.5 px-5">Recycled Yield</th>
                <th className="py-3.5 px-5">Rejected Weight</th>
                <th className="py-3.5 px-5">Completed Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs text-slate-200">
              {history.map((r) => (
                <tr key={r._id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-5 font-mono font-bold text-purple-400">#{r._id.slice(-6).toUpperCase()}</td>
                  <td className="py-4 px-5 font-semibold text-white">{r.plasticTypeId?.name}</td>
                  <td className="py-4 px-5 font-bold text-slate-300">{r.receivedWeight} KG</td>
                  <td className="py-4 px-5 font-extrabold text-emerald-400">{r.recycledWeight} KG</td>
                  <td className="py-4 px-5 font-bold text-rose-400">{r.rejectedWeight} KG</td>
                  <td className="py-4 px-5 text-slate-400">{new Date(r.completedAt || r.updatedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RecyclerHistoryPage;
