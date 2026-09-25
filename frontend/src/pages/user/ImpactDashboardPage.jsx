import React, { useEffect, useState } from 'react';
import { TreePine, Zap, BookOpen, Sparkles, Building2, Wind, CheckCircle2 } from 'lucide-react';
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

  if (loading) return <LoadingSpinner message="Calculating your environmental metrics..." />;

  const { totals, records } = impactData || { totals: {}, records: [] };

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* 1. Impact Storytelling Hero (Section 9) */}
      <div className="bg-white rounded-3xl border border-[#e2e8df] p-6 sm:p-10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#edf6f0] rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 space-y-3 max-w-2xl">
          <span className="text-xs font-extrabold text-[#1b4332] uppercase tracking-widest bg-[#edf6f0] px-3 py-1 rounded-full border border-[#cadbc5]">
            Verified Environmental LCA
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#14231b] tracking-tight leading-tight">
            Your Tangible Ecological Contribution
          </h1>
          <p className="text-sm sm:text-base text-[#526458] leading-relaxed">
            By separating and diverting plastic waste into certified mechanical recyclers, you directly prevent greenhouse gas emissions and conserve municipal landfill space.
          </p>
        </div>
      </div>

      {/* 2. Visual Environmental Savings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-7 rounded-3xl border border-[#e2e8df] shadow-sm flex flex-col justify-between hover:border-[#b8cfbf] transition-all">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#edf6f0] text-[#1b4332] flex items-center justify-center border border-[#cbe3d3] text-xl">
              🌱
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#627368] uppercase tracking-wider block">Carbon Abated</span>
              <h3 className="text-3xl font-black text-[#1b4332] mt-1">{totals?.co2AvoidedKg || 0} KG</h3>
              <p className="text-xs text-[#526458] mt-1 leading-relaxed">CO2 greenhouse emissions prevented from the atmosphere.</p>
            </div>
          </div>
          <div className="mt-5 pt-3 border-t border-[#edf2ec] text-[11px] font-bold text-[#2d6a4f]">
            1 kg plastic ≈ 1.5 kg CO2 avoided
          </div>
        </div>

        <div className="bg-white p-7 rounded-3xl border border-[#e2e8df] shadow-sm flex flex-col justify-between hover:border-[#b8cfbf] transition-all">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#f0fdfa] text-[#0f766e] flex items-center justify-center border border-[#99f6e4] text-xl">
              ⚡
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#627368] uppercase tracking-wider block">Grid Energy Preserved</span>
              <h3 className="text-3xl font-black text-[#0f766e] mt-1">{totals?.energySavedKwh || 0} kWh</h3>
              <p className="text-xs text-[#526458] mt-1 leading-relaxed">Fossil-fuel refinery electricity saved vs virgin polymer synthesis.</p>
            </div>
          </div>
          <div className="mt-5 pt-3 border-t border-[#edf2ec] text-[11px] font-bold text-[#0f766e]">
            1 kg plastic ≈ 5.77 kWh energy saved
          </div>
        </div>

        <div className="bg-white p-7 rounded-3xl border border-[#e2e8df] shadow-sm flex flex-col justify-between hover:border-[#b8cfbf] transition-all">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#f0f9ff] text-[#0369a1] flex items-center justify-center border border-[#bae6fd] text-xl">
              🏙️
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#627368] uppercase tracking-wider block">Landfill Diverted</span>
              <h3 className="text-3xl font-black text-[#0369a1] mt-1">{totals?.landfillSavedM3 || 0} m³</h3>
              <p className="text-xs text-[#526458] mt-1 leading-relaxed">Municipal waste dumpsite volume permanently conserved.</p>
            </div>
          </div>
          <div className="mt-5 pt-3 border-t border-[#edf2ec] text-[11px] font-bold text-[#0369a1]">
            1 kg plastic ≈ 0.002 m³ space saved
          </div>
        </div>

        <div className="bg-white p-7 rounded-3xl border border-[#e2e8df] shadow-sm flex flex-col justify-between hover:border-[#b8cfbf] transition-all">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#fefce8] text-[#92400e] flex items-center justify-center border border-[#fde68a] text-xl">
              🌳
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#627368] uppercase tracking-wider block">Forest Equivalent</span>
              <h3 className="text-3xl font-black text-[#92400e] mt-1">{totals?.treesEquivalent || 0}</h3>
              <p className="text-xs text-[#526458] mt-1 leading-relaxed">Urban trees absorbing carbon for one entire year.</p>
            </div>
          </div>
          <div className="mt-5 pt-3 border-t border-[#edf2ec] text-[11px] font-bold text-[#92400e]">
            1 kg plastic ≈ 0.03 urban tree offset
          </div>
        </div>
      </div>

      {/* 3. Scientific Methodology & Standards Reference */}
      <div className="bg-[#f7faf8] p-6 sm:p-8 rounded-3xl border border-[#dce6df] flex items-start gap-4">
        <div className="w-10 h-10 rounded-2xl bg-white text-[#1b4332] flex items-center justify-center border border-[#cbe0d1] shrink-0 shadow-sm">
          <BookOpen className="w-5 h-5" />
        </div>
        <div className="space-y-1.5 text-xs text-[#4b5d51] leading-relaxed">
          <h4 className="font-extrabold text-sm text-[#14231b]">Scientific Methodology & Baseline Assessment</h4>
          <p>
            All emission avoidance equations are derived from the <strong>U.S. EPA Waste Reduction Model (WARM v15)</strong> and certified European Life Cycle Assessment (LCA) baselines. Mechanically pelletizing recovered PET, HDPE, and PP emits 67% less lifecycle carbon than synthesizing petrochemical virgin plastic resins from crude petroleum.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImpactDashboardPage;
