import React, { useEffect, useState } from 'react';
import { History, CheckCircle2, Calendar, Weight, Package } from 'lucide-react';
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

  const totalKg = history.reduce((sum, item) => sum + (item.actualWeight || 0), 0);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e8f0ea] text-[#1b4332] text-xs font-semibold uppercase tracking-wider mb-2">
            <History className="w-3.5 h-3.5" />
            <span>Verified Collections</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14231b] tracking-tight">Collection History</h1>
          <p className="text-sm text-[#526458] mt-1">Audit log of plastic waste pickups verified and collected by your account.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2.5 rounded-2xl border border-[#e2e8df] shadow-sm text-xs">
            <span className="text-[#718477]">Total Verified: </span>
            <strong className="text-[#1b4332] font-bold text-sm">{totalKg.toFixed(1)} KG</strong>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-3xl border border-[#e2e8df] shadow-sm overflow-hidden">
        {history.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="w-12 h-12 rounded-full bg-[#e8f0ea] flex items-center justify-center mx-auto mb-3 text-[#1b4332]">
              <History className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-[#14231b]">No completed collections recorded yet</p>
            <p className="text-xs text-[#718477] mt-1">Verified and weighed collections will appear here once submitted.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#edf2ec] text-[11px] font-bold text-[#718477] uppercase bg-[#fbfbf9]">
                  <th className="py-3.5 px-6">Pickup ID</th>
                  <th className="py-3.5 px-6">Citizen</th>
                  <th className="py-3.5 px-6">Plastic Category</th>
                  <th className="py-3.5 px-6">Verified Weight</th>
                  <th className="py-3.5 px-6">Collected Date</th>
                  <th className="py-3.5 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#edf2ec] text-xs text-[#14231b]">
                {history.map((c) => (
                  <tr key={c._id} className="hover:bg-[#fbfbf9] transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-[#1b4332]">
                      #{c.pickupId?._id ? c.pickupId._id.slice(-6).toUpperCase() : 'N/A'}
                    </td>
                    <td className="py-4 px-6 font-semibold text-[#14231b]">{c.userId?.name || 'Citizen'}</td>
                    <td className="py-4 px-6 text-[#526458] font-medium">{c.plasticTypeId?.name || 'Plastic'}</td>
                    <td className="py-4 px-6 font-bold text-[#1b4332]">{c.actualWeight} KG</td>
                    <td className="py-4 px-6 text-[#718477]">
                      {c.collectedAt ? new Date(c.collectedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#e8f0ea] text-[#1b4332] border border-[#d8e2dc]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>VERIFIED</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectorHistoryPage;
