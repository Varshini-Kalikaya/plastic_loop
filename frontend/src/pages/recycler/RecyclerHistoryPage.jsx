import React, { useEffect, useState } from 'react';
import { History, CheckCircle2, Factory, Scale, Check } from 'lucide-react';
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

  const totalYield = history.reduce((sum, r) => sum + (r.recycledWeight || 0), 0);
  const totalReceived = history.reduce((sum, r) => sum + (r.receivedWeight || 0), 0);
  const yieldEfficiency = totalReceived > 0 ? ((totalYield / totalReceived) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e8f0ea] text-[#1b4332] text-xs font-semibold uppercase tracking-wider mb-2">
            <History className="w-3.5 h-3.5" />
            <span>Industrial Yield Logs</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14231b] tracking-tight">Recycling Batch History</h1>
          <p className="text-sm text-[#526458] mt-1">Processed material yield logs, quality sorting ratios, and completed recycling batches.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-2xl border border-[#e2e8df] shadow-sm text-xs">
            <span className="text-[#718477]">Total Recycled Yield: </span>
            <strong className="text-[#1b4332] font-bold text-sm">{totalYield.toFixed(1)} KG</strong>
          </div>
          <div className="bg-white px-4 py-2 rounded-2xl border border-[#e2e8df] shadow-sm text-xs">
            <span className="text-[#718477]">Plant Efficiency: </span>
            <strong className="text-[#1b4332] font-bold text-sm">{yieldEfficiency}%</strong>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-3xl border border-[#e2e8df] shadow-sm overflow-hidden">
        {history.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="w-12 h-12 rounded-full bg-[#e8f0ea] flex items-center justify-center mx-auto mb-3 text-[#1b4332]">
              <Factory className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-[#14231b]">No completed recycling batches yet</p>
            <p className="text-xs text-[#718477] mt-1">Completed material runs and verified yields will be logged here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#edf2ec] text-[11px] font-bold text-[#718477] uppercase bg-[#fbfbf9]">
                  <th className="py-3.5 px-6">Batch ID</th>
                  <th className="py-3.5 px-6">Plastic Category</th>
                  <th className="py-3.5 px-6">Received Weight</th>
                  <th className="py-3.5 px-6">Recycled Yield</th>
                  <th className="py-3.5 px-6">Rejected Weight</th>
                  <th className="py-3.5 px-6">Completed Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#edf2ec] text-xs text-[#14231b]">
                {history.map((r) => (
                  <tr key={r._id} className="hover:bg-[#fbfbf9] transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-[#1b4332]">
                      #{r._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="py-4 px-6 font-semibold text-[#14231b]">{r.plasticTypeId?.name || 'Plastic'}</td>
                    <td className="py-4 px-6 text-[#526458] font-medium">{r.receivedWeight} KG</td>
                    <td className="py-4 px-6 font-bold text-[#1b4332]">{r.recycledWeight} KG</td>
                    <td className="py-4 px-6 font-medium text-rose-600">{r.rejectedWeight} KG</td>
                    <td className="py-4 px-6 text-[#718477]">
                      {new Date(r.completedAt || r.updatedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
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

export default RecyclerHistoryPage;
