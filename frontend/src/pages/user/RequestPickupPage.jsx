import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Bot, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import ImageUploader from '../../components/ImageUploader';
import AIPlasticScannerModal from '../../components/AIPlasticScannerModal';
import LoadingSpinner from '../../components/LoadingSpinner';

const RequestPickupPage = () => {
  const { user, showToast } = useAuth();
  const navigate = useNavigate();

  const [plasticTypes, setPlasticTypes] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    plasticTypeId: '',
    estimatedWeight: 5,
    images: [],
    address: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      zipCode: user?.address?.zipCode || '',
    },
    preferredDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    preferredTimeSlot: 'Morning (8AM - 12PM)',
    description: '',
  });

  useEffect(() => {
    const fetchPlasticTypes = async () => {
      try {
        const res = await API.get('/plastic-types');
        setPlasticTypes(res.data || []);
        if (res.data?.length > 0) {
          setFormData((prev) => ({ ...prev, plasticTypeId: res.data[0]._id }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingTypes(false);
      }
    };
    fetchPlasticTypes();
  }, []);

  const handleAiSelectCategory = (code) => {
    const matched = plasticTypes.find((p) => p.code === code);
    if (matched) {
      setFormData((prev) => ({ ...prev, plasticTypeId: matched._id }));
      showToast(`AI Scanner selected plastic category: ${matched.name}`, 'success');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.plasticTypeId) {
      showToast('Please select a plastic category', 'error');
      return;
    }

    if (Number(formData.estimatedWeight) <= 0) {
      showToast('Weight must be greater than 0 kg', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await API.post('/pickups', formData);
      showToast('Pickup request created successfully! 🚚', 'success');
      navigate('/my-pickups');
    } catch (err) {
      showToast(err.message, 'error');
      setSubmitting(false);
    }
  };

  if (loadingTypes) return <LoadingSpinner message="Loading plastic categories..." />;

  const selectedPlastic = plasticTypes.find((p) => p._id === formData.plasticTypeId);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Request Plastic Waste Pickup</h1>
          <p className="text-xs text-slate-400 mt-1">Submit your recyclable plastic for doorstep collection</p>
        </div>

        {/* AI Scanner Helper Button */}
        <button
          onClick={() => setAiModalOpen(true)}
          className="py-2.5 px-4 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 font-bold text-xs flex items-center gap-2 hover:bg-purple-500/30 transition-colors shadow-lg"
        >
          <Bot className="w-4 h-4 text-purple-400 animate-pulse" /> AI Plastic Scanner Helper
        </button>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        {/* Plastic Category Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-200 mb-2">Select Plastic Waste Category</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {plasticTypes.map((p) => {
              const isSelected = formData.plasticTypeId === p._id;
              return (
                <div
                  key={p._id}
                  onClick={() => setFormData({ ...formData, plasticTypeId: p._id })}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-emerald-500/15 border-emerald-500 shadow-lg shadow-emerald-500/10'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-emerald-400">{p.code}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                      +{p.pointsPerKg} pts/kg
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-white mt-1.5">{p.name}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{p.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weight & Photo Upload */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1.5">Estimated Waste Weight (KG)</label>
            <input
              type="number"
              step="0.5"
              min="0.5"
              required
              value={formData.estimatedWeight}
              onChange={(e) => setFormData({ ...formData, estimatedWeight: Number(e.target.value) })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 font-bold"
            />
            {selectedPlastic && (
              <p className="text-[11px] text-emerald-400 mt-1.5 font-semibold">
                Estimated Earnings: ≈ {Math.round(formData.estimatedWeight * selectedPlastic.pointsPerKg)} Reward Points
              </p>
            )}
          </div>

          <ImageUploader
            label="Upload Plastic Waste Photo"
            onUploadSuccess={(url) => setFormData((prev) => ({ ...prev, images: [url] }))}
          />
        </div>

        {/* Date & Time Slot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1.5">Preferred Pickup Date</label>
            <input
              type="date"
              required
              min={new Date().toISOString().split('T')[0]}
              value={formData.preferredDate}
              onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1.5">Preferred Time Slot</label>
            <select
              value={formData.preferredTimeSlot}
              onChange={(e) => setFormData({ ...formData, preferredTimeSlot: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500"
            >
              <option value="Morning (8AM - 12PM)">Morning (8AM - 12PM)</option>
              <option value="Afternoon (12PM - 4PM)">Afternoon (12PM - 4PM)</option>
              <option value="Evening (4PM - 8PM)">Evening (4PM - 8PM)</option>
            </select>
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-xs font-bold text-slate-200 mb-1.5">Pickup Address</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              required
              placeholder="Street / House No."
              value={formData.address.street}
              onChange={(e) => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            />
            <input
              type="text"
              required
              placeholder="City"
              value={formData.address.city}
              onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            />
            <input
              type="text"
              required
              placeholder="State"
              value={formData.address.state}
              onChange={(e) => setFormData({ ...formData, address: { ...formData.address, state: e.target.value } })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            />
            <input
              type="text"
              required
              placeholder="Zip Code"
              value={formData.address.zipCode}
              onChange={(e) => setFormData({ ...formData, address: { ...formData.address, zipCode: e.target.value } })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-200 mb-1.5">Additional Notes / Instructions (Optional)</label>
          <textarea
            rows="2"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="e.g. Cleaned beverage bottles packed in blue recycling bag near gate."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 rounded-2xl eco-button-gradient text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-xl"
        >
          {submitting ? 'Submitting Request...' : 'Submit Pickup Request'} <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* AI Scanner Modal */}
      <AIPlasticScannerModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        onSelectCategory={handleAiSelectCategory}
      />
    </div>
  );
};

export default RequestPickupPage;
