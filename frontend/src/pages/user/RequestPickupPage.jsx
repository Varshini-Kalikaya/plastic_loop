import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Bot,
  Calendar,
  Clock,
  MapPin,
  Scale,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import ImageUploader from '../../components/ImageUploader';
import AIPlasticScannerModal from '../../components/AIPlasticScannerModal';
import LoadingSpinner from '../../components/LoadingSpinner';

const RequestPickupPage = () => {
  const { user, showToast } = useAuth();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
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
      showToast(`AI Scanner selected: ${matched.name}`, 'success');
    }
  };

  const handleNext = () => {
    if (currentStep === 1 && !formData.plasticTypeId) {
      showToast('Please select a plastic waste category', 'error');
      return;
    }
    if (currentStep === 2 && Number(formData.estimatedWeight) <= 0) {
      showToast('Estimated weight must be greater than 0 kg', 'error');
      return;
    }
    if (currentStep === 3) {
      if (!formData.address.street || !formData.address.city || !formData.address.zipCode) {
        showToast('Please enter your complete address and zip code', 'error');
        return;
      }
    }
    if (currentStep === 4 && !formData.preferredDate) {
      showToast('Please select your preferred collection date', 'error');
      return;
    }
    setCurrentStep((prev) => Math.min(5, prev + 1));
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

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

  if (loadingTypes) return <LoadingSpinner message="Loading plastic recycling catalog..." />;

  const selectedPlastic = plasticTypes.find((p) => p._id === formData.plasticTypeId);

  const stepsList = [
    { num: 1, label: 'Material' },
    { num: 2, label: 'Weight & Photo' },
    { num: 3, label: 'Location' },
    { num: 4, label: 'Schedule' },
    { num: 5, label: 'Confirm' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header with Title & AI Scanner Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold text-[#1b4332] uppercase tracking-widest bg-[#edf6f0] px-3 py-1 rounded-full border border-[#cadbc5]">
            Guided Doorstep Collection
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14231b] mt-2 tracking-tight">
            Schedule a Plastic Waste Pickup
          </h1>
          <p className="text-xs sm:text-sm text-[#5a6c60] mt-1">
            Follow the 5 simple steps below to schedule collection and earn verified reward points.
          </p>
        </div>

        <button
          onClick={() => setAiModalOpen(true)}
          className="self-start sm:self-center py-2.5 px-4 rounded-xl bg-[#edf6f0] hover:bg-[#dcefe2] border border-[#b4d6bf] text-[#1b4332] font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
        >
          <Bot className="w-4 h-4 text-[#2d6a4f]" />
          <span>Need help? AI Plastic Classifier</span>
        </button>
      </div>

      {/* Guided Progressive Step Indicator Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-[#e2e8df] shadow-sm">
        <div className="grid grid-cols-5 gap-2 sm:gap-4 text-center">
          {stepsList.map((s) => {
            const isCompleted = currentStep > s.num;
            const isCurrent = currentStep === s.num;
            return (
              <div
                key={s.num}
                onClick={() => isCompleted && setCurrentStep(s.num)}
                className={`flex flex-col items-center gap-1.5 transition-all ${
                  isCompleted ? 'cursor-pointer' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                    isCurrent
                      ? 'bg-[#1b4332] text-white shadow-sm'
                      : isCompleted
                      ? 'bg-[#edf6f0] text-[#1b4332] border border-[#b8dfc4]'
                      : 'bg-[#f4f6f4] text-[#8fa295]'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : `0${s.num}`}
                </div>
                <span
                  className={`text-[11px] font-bold hidden sm:block ${
                    isCurrent ? 'text-[#14231b]' : isCompleted ? 'text-[#2d6a4f]' : 'text-[#8fa295]'
                  }`}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Guided Step Panels */}
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#e2e8df] shadow-sm">
        {/* STEP 1: What are you recycling? */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <span className="text-xs font-mono font-bold text-[#2d6a4f] uppercase tracking-wider block">
                Step 01 / 05
              </span>
              <h2 className="text-xl font-extrabold text-[#14231b] mt-1">What type of plastic are you recycling?</h2>
              <p className="text-xs text-[#5e7165] mt-1">
                Choose the plastic category from your containers. Point rates are credited per verified kilogram.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {plasticTypes.map((p) => {
                const isSelected = formData.plasticTypeId === p._id;
                return (
                  <div
                    key={p._id}
                    onClick={() => setFormData({ ...formData, plasticTypeId: p._id })}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#edf6f0] border-[#1b4332] shadow-sm ring-1 ring-[#1b4332]'
                        : 'bg-[#fbfcfb] hover:bg-[#f6f9f7] border-[#e2e8df]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-black text-[#1b4332] bg-white px-2 py-0.5 rounded border border-[#d2ded6]">
                        {p.code}
                      </span>
                      <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-[#fefce8] text-[#92400e] border border-[#fef08a]">
                        +{p.pointsPerKg} pts/kg
                      </span>
                    </div>
                    <h4 className="font-extrabold text-sm text-[#14231b] mt-2.5">{p.name}</h4>
                    <p className="text-xs text-[#596b60] mt-1 line-clamp-2 leading-relaxed">{p.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: How much do you have & photo? */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <span className="text-xs font-mono font-bold text-[#2d6a4f] uppercase tracking-wider block">
                Step 02 / 05
              </span>
              <h2 className="text-xl font-extrabold text-[#14231b] mt-1">How much plastic do you have?</h2>
              <p className="text-xs text-[#5e7165] mt-1">
                Provide an approximate weight estimate. Our collector will verify the final weight using digital scales.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="space-y-4 bg-[#f8faf8] p-6 rounded-2xl border border-[#e2ebe3]">
                <label className="block text-xs font-bold text-[#14231b] uppercase tracking-wider">
                  Estimated Waste Weight (KG)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    required
                    value={formData.estimatedWeight}
                    onChange={(e) => setFormData({ ...formData, estimatedWeight: Number(e.target.value) })}
                    className="w-32 bg-white border border-[#c9d9ce] rounded-xl px-4 py-2.5 text-base text-[#14231b] font-black focus:outline-none focus:border-[#1b4332]"
                  />
                  <span className="text-sm font-bold text-[#55685c]">Kilograms</span>
                </div>

                <input
                  type="range"
                  min="0.5"
                  max="50"
                  step="0.5"
                  value={formData.estimatedWeight}
                  onChange={(e) => setFormData({ ...formData, estimatedWeight: Number(e.target.value) })}
                  className="w-full h-2.5 bg-[#dbe6dc] rounded-lg appearance-none cursor-pointer accent-[#1b4332]"
                />

                {selectedPlastic && (
                  <div className="p-3.5 rounded-xl bg-white border border-[#cbe3d3] space-y-1">
                    <span className="text-[10px] font-bold text-[#6a7d71] uppercase tracking-wider block">
                      Estimated Earnings
                    </span>
                    <p className="text-lg font-black text-[#1b4332]">
                      ≈ {Math.round(formData.estimatedWeight * selectedPlastic.pointsPerKg)} Reward Points
                    </p>
                    <p className="text-[11px] text-[#718477]">
                      Based on {selectedPlastic.code} rate of {selectedPlastic.pointsPerKg} points per kg.
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-[#f8faf8] p-6 rounded-2xl border border-[#e2ebe3]">
                <ImageUploader
                  label="Attach Plastic Photo (Optional)"
                  currentImage={formData.images?.[0]}
                  onUploadSuccess={(url) => setFormData((prev) => ({ ...prev, images: [url] }))}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Where should we collect it? */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <span className="text-xs font-mono font-bold text-[#2d6a4f] uppercase tracking-wider block">
                Step 03 / 05
              </span>
              <h2 className="text-xl font-extrabold text-[#14231b] mt-1">Where should we collect it?</h2>
              <p className="text-xs text-[#5e7165] mt-1">
                Enter your doorstep address for our verified collection truck and agent.
              </p>
            </div>

            <div className="space-y-4 max-w-xl">
              <div>
                <label className="block text-xs font-bold text-[#14231b] uppercase tracking-wider mb-1.5">
                  Street Address / House Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="Flat 101, Green Heights, Velachery Main Rd"
                  value={formData.address.street}
                  onChange={(e) => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })}
                  className="w-full bg-[#fbfcfb] border border-[#dce5de] rounded-xl px-4 py-2.5 text-xs text-[#14231b] focus:outline-none focus:border-[#1b4332]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#14231b] uppercase tracking-wider mb-1.5">City</label>
                  <input
                    type="text"
                    required
                    placeholder="Chennai"
                    value={formData.address.city}
                    onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })}
                    className="w-full bg-[#fbfcfb] border border-[#dce5de] rounded-xl px-3 py-2 text-xs text-[#14231b] focus:outline-none focus:border-[#1b4332]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#14231b] uppercase tracking-wider mb-1.5">State</label>
                  <input
                    type="text"
                    required
                    placeholder="Tamil Nadu"
                    value={formData.address.state}
                    onChange={(e) => setFormData({ ...formData, address: { ...formData.address, state: e.target.value } })}
                    className="w-full bg-[#fbfcfb] border border-[#dce5de] rounded-xl px-3 py-2 text-xs text-[#14231b] focus:outline-none focus:border-[#1b4332]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#14231b] uppercase tracking-wider mb-1.5">Zip Code</label>
                  <input
                    type="text"
                    required
                    placeholder="600042"
                    value={formData.address.zipCode}
                    onChange={(e) => setFormData({ ...formData, address: { ...formData.address, zipCode: e.target.value } })}
                    className="w-full bg-[#fbfcfb] border border-[#dce5de] rounded-xl px-3 py-2 text-xs text-[#14231b] focus:outline-none focus:border-[#1b4332]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: When should we collect it? */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <span className="text-xs font-mono font-bold text-[#2d6a4f] uppercase tracking-wider block">
                Step 04 / 05
              </span>
              <h2 className="text-xl font-extrabold text-[#14231b] mt-1">When should we collect it?</h2>
              <p className="text-xs text-[#5e7165] mt-1">
                Pick a convenient collection date and time window when you will be available.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
              <div>
                <label className="block text-xs font-bold text-[#14231b] uppercase tracking-wider mb-2">
                  Preferred Pickup Date
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.preferredDate}
                  onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                  className="w-full bg-[#fbfcfb] border border-[#dce5de] rounded-xl px-4 py-2.5 text-xs text-[#14231b] focus:outline-none focus:border-[#1b4332]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#14231b] uppercase tracking-wider mb-2">
                  Preferred Time Window
                </label>
                <div className="space-y-2">
                  {[
                    { slot: 'Morning (8AM - 12PM)', label: 'Morning', hours: '8:00 AM – 12:00 PM' },
                    { slot: 'Afternoon (12PM - 4PM)', label: 'Afternoon', hours: '12:00 PM – 4:00 PM' },
                    { slot: 'Evening (4PM - 8PM)', label: 'Evening', hours: '4:00 PM – 8:00 PM' },
                  ].map((t) => {
                    const isSelected = formData.preferredTimeSlot === t.slot;
                    return (
                      <div
                        key={t.slot}
                        onClick={() => setFormData({ ...formData, preferredTimeSlot: t.slot })}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#edf6f0] border-[#1b4332] text-[#1b4332]'
                            : 'bg-[#fbfcfb] hover:bg-[#f6f9f7] border-[#e2e8df] text-[#4d5e53]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Clock className={`w-4 h-4 ${isSelected ? 'text-[#1b4332]' : 'text-[#8da094]'}`} />
                          <span className="text-xs font-bold">{t.label}</span>
                        </div>
                        <span className="text-[11px] font-semibold">{t.hours}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Confirm Request */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <span className="text-xs font-mono font-bold text-[#2d6a4f] uppercase tracking-wider block">
                Step 05 / 05
              </span>
              <h2 className="text-xl font-extrabold text-[#14231b] mt-1">Review & Confirm Request</h2>
              <p className="text-xs text-[#5e7165] mt-1">
                Please verify your collection details before submitting to the pickup dispatch queue.
              </p>
            </div>

            <div className="bg-[#f8faf8] p-6 rounded-2xl border border-[#e2ebe3] space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-[#e2ebe3]">
                <div>
                  <span className="text-[10px] font-bold text-[#6a7d71] uppercase tracking-wider block">Material</span>
                  <p className="text-base font-extrabold text-[#14231b] mt-0.5">{selectedPlastic?.name}</p>
                  <p className="text-xs text-[#2d6a4f] font-bold">{selectedPlastic?.code} • +{selectedPlastic?.pointsPerKg} pts/kg</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#6a7d71] uppercase tracking-wider block">Estimated Weight</span>
                  <p className="text-base font-extrabold text-[#14231b] mt-0.5">{formData.estimatedWeight} KG</p>
                  <p className="text-xs text-[#92400e] font-bold">
                    ≈ {Math.round(formData.estimatedWeight * (selectedPlastic?.pointsPerKg || 10))} Estimated Points
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-[#e2ebe3]">
                <div>
                  <span className="text-[10px] font-bold text-[#6a7d71] uppercase tracking-wider block">Pickup Address</span>
                  <p className="text-xs font-semibold text-[#14231b] mt-1">
                    {formData.address.street}, {formData.address.city}, {formData.address.state} - {formData.address.zipCode}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#6a7d71] uppercase tracking-wider block">Scheduled Slot</span>
                  <p className="text-xs font-semibold text-[#14231b] mt-1">
                    {new Date(formData.preferredDate).toLocaleDateString()} • {formData.preferredTimeSlot}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#14231b] uppercase tracking-wider mb-1.5">
                  Special Pickup Notes / Instructions (Optional)
                </label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. Recycled beverage bottles packed in green eco bag near front porch."
                  className="w-full bg-white border border-[#dce5de] rounded-xl p-3 text-xs text-[#14231b] focus:outline-none focus:border-[#1b4332]"
                ></textarea>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Navigation Action Controls */}
        <div className="mt-8 pt-6 border-t border-[#edf2ec] flex items-center justify-between gap-4">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="px-6 py-3 rounded-xl eco-btn-secondary text-xs font-bold flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <div></div>
          )}

          {currentStep < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-8 py-3.5 rounded-xl eco-btn-primary text-xs font-bold flex items-center gap-2 shadow-sm"
            >
              <span>Continue to Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="px-8 py-3.5 rounded-xl eco-btn-primary text-xs font-bold flex items-center gap-2 shadow-md"
            >
              {submitting ? 'Submitting Request...' : 'Confirm & Submit Pickup Request'}
              <CheckCircle2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* AI Classifier Modal */}
      <AIPlasticScannerModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        onSelectCategory={handleAiSelectCategory}
      />
    </div>
  );
};

export default RequestPickupPage;
