import React, { useEffect, useState } from 'react';
import { TreePine, Zap, ShieldCheck, Factory, BookOpen } from 'lucide-react';
import API from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const ImpactDashboardPage = () => {
  const [impactData, setImpactData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImpact = async () => {
      try {
        const res = await API.get('/user/impact');
        setImpactData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchImpact();
  }, []);

  if (loading) return <LoadingSpinner message="Calculating environmental metrics..." />;

  const { totals, records } = impactData || { totals: {}, records: [] };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-emerald-500/30">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs border border-emerald-500/30 mb-3">
          <TreePine className="w-4 h-4" /> Scientific Environmental Impact Dashboard
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Your Environmental Footprint Saved</h1>
        <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
          Calculated using standard Waste Reduction Model (EPA WARM v15) and EcoInvent baseline life cycle assessment data.
        </p>
      </div>

      {/* Main Impact Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-6 rounded-2xl border border-emerald-500/30 text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center font-bold">
            🌱
          </div>
          <p className="text-xs text-slate-400 uppercase font-bold">CO2 Emissions Avoided</p>
          <h3 className="text-3xl font-extrabold text-emerald-400">{totals?.co2AvoidedKg || 0} KG</h3>
          <p className="text-[11px] text-slate-500">1 kg plastic recycled ≈ 1.5 kg CO2 avoided</p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-teal-500/30 text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 mx-auto flex items-center justify-center font-bold">
            ⚡
          </div>
          <p className="text-xs text-slate-400 uppercase font-bold">Grid Energy Conserved</p>
          <h3 className="text-3xl font-extrabold text-teal-400">{totals?.energySavedKwh || 0} kWh</h3>
          <p className="text-[11px] text-slate-500">1 kg plastic recycled ≈ 5.77 kWh saved</p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-blue-500/30 text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 mx-auto flex items-center justify-center font-bold">
            🏙️
          </div>
          <p className="text-xs text-slate-400 uppercase font-bold">Landfill Space Preserved</p>
          <h3 className="text-3xl font-extrabold text-blue-400">{totals?.landfillSavedM3 || 0} m³</h3>
          <p className="text-[11px] text-slate-500">1 kg plastic recycled ≈ 0.002 m³ saved</p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-amber-500/30 text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center font-bold">
            🌳
          </div>
          <p className="text-xs text-slate-400 uppercase font-bold">Trees Planted Equivalent</p>
          <h3 className="text-3xl font-extrabold text-amber-400">{totals?.treesEquivalent || 0}</h3>
          <p className="text-[11px] text-slate-500">1 kg plastic recycled ≈ 0.03 trees eq.</p>
        </div>
      </div>

      {/* Methodology note */}
      <div className="glass-card p-5 rounded-2xl border border-slate-800 text-xs text-slate-300 flex items-start gap-3">
        <BookOpen className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-white mb-1">Scientific Methodology & Assumptions</h4>
          <p className="leading-relaxed">
            Environmental impact factors are estimated using peer-reviewed environmental life-cycle metrics. Manufacturing virgin PET/HDPE resin consumes significantly more petroleum energy than mechanical pellet reprocessing.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImpactDashboardPage;
