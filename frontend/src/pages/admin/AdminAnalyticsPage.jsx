import React, { useEffect, useState } from 'react';
import { BarChart3, PieChart as PieChartIcon, TrendingUp, Layers } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Legend,
} from 'recharts';
import API from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const BOTANICAL_COLORS = ['#1b4332', '#2d6a4f', '#40916c', '#52b788', '#74c69d', '#8fa895', '#0f766e'];

const AdminAnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await API.get('/admin/analytics/overview');
        setAnalytics(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <LoadingSpinner message="Querying MongoDB ecosystem aggregations..." />;

  const { monthlyTrends, plasticDistribution, statusDistribution } = analytics || {};

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e8f0ea] text-[#1b4332] text-xs font-semibold uppercase tracking-wider mb-2">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Macro Analytics</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14231b] tracking-tight">Ecosystem Analytics & Aggregations</h1>
        <p className="text-sm text-[#526458] mt-1">Aggregated circular economy metrics calculated from live database transaction records.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Collection Trend */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#e2e8df] shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#e8f0ea] text-[#1b4332] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#14231b]">Monthly Plastic Collection (KG)</h3>
              <p className="text-xs text-[#718477]">Gross kilograms collected month-over-month</p>
            </div>
          </div>
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#edf2ec" />
                <XAxis dataKey="name" stroke="#718477" fontSize={11} tickLine={false} />
                <YAxis stroke="#718477" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8df',
                    borderRadius: '16px',
                    fontSize: '12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                    color: '#14231b',
                  }}
                />
                <Bar dataKey="Collected" fill="#1b4332" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Plastic Type Distribution */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#e2e8df] shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#e8f0ea] text-[#1b4332] flex items-center justify-center">
              <PieChartIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#14231b]">Plastic Category Volume Share</h3>
              <p className="text-xs text-[#718477]">Composition share by polymer resin classification</p>
            </div>
          </div>
          <div className="h-72 w-full pt-4 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={plasticDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={95}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {plasticDistribution?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={BOTANICAL_COLORS[index % BOTANICAL_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8df',
                    borderRadius: '16px',
                    fontSize: '12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                    color: '#14231b',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
