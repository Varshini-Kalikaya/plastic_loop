import React, { useEffect, useState } from 'react';
import { Layers, Plus, Edit2, Trash2, Sparkles, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';

const PlasticTypesPage = () => {
  const { showToast } = useAuth();
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [formData, setFormData] = useState({ name: '', code: 'PET', pointsPerKg: 10, description: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchTypes = async () => {
    setLoading(true);
    try {
      const res = await API.get('/plastic-types');
      setTypes(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  const handleOpenAdd = () => {
    setEditingType(null);
    setFormData({ name: '', code: 'PET', pointsPerKg: 10, description: '' });
    setModalOpen(true);
  };

  const handleOpenEdit = (t) => {
    setEditingType(t);
    setFormData({ name: t.name, code: t.code, pointsPerKg: t.pointsPerKg, description: t.description || '' });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingType) {
        await API.put(`/plastic-types/${editingType._id}`, formData);
        showToast('Plastic category updated', 'success');
      } else {
        await API.post('/plastic-types', formData);
        showToast('Plastic category created', 'success');
      }
      setModalOpen(false);
      fetchTypes();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading plastic types..." />;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e8f0ea] text-[#1b4332] text-xs font-semibold uppercase tracking-wider mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>Material Classification</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14231b] tracking-tight">Plastic Waste Categories</h1>
          <p className="text-sm text-[#526458] mt-1">Configure resin identification codes, polymer descriptions, and citizen point reward rates.</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-bold text-xs shadow-sm transition self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Plastic Type</span>
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {types.map((t) => (
          <div
            key={t._id}
            className="bg-white p-6 rounded-3xl border border-[#e2e8df] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-[#e8f0ea] text-[#1b4332] font-extrabold text-xs tracking-wide">
                  Resin #{t.code}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#fefce8] text-[#854d0e] border border-[#fef08a] text-xs font-bold">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  +{t.pointsPerKg} pts / kg
                </span>
              </div>

              <div>
                <h3 className="font-bold text-base text-[#14231b]">{t.name}</h3>
                <p className="text-xs text-[#526458] leading-relaxed mt-1.5">{t.description || 'No description provided.'}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-[#edf2ec] flex justify-end">
              <button
                onClick={() => handleOpenEdit(t)}
                className="px-3.5 py-1.5 rounded-xl bg-[#fbfbf9] hover:bg-[#edf2ec] border border-[#d8e2dc] text-[#14231b] text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5 text-[#1b4332]" />
                <span>Edit Category</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingType ? 'Edit Plastic Category' : 'Add Plastic Category'}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#14231b] mb-1.5">Plastic Category Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Polyethylene Terephthalate"
                className="w-full bg-[#fbfbf9] border border-[#d8e2dc] rounded-xl px-3.5 py-2.5 text-sm text-[#14231b] placeholder-[#a0afa5] focus:outline-none focus:ring-2 focus:ring-[#1b4332]/20 focus:border-[#1b4332] transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#14231b] mb-1.5">Resin Identification Code</label>
                <select
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full bg-[#fbfbf9] border border-[#d8e2dc] rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#14231b] focus:outline-none focus:ring-2 focus:ring-[#1b4332]/20 focus:border-[#1b4332] transition cursor-pointer"
                >
                  {['PET', 'HDPE', 'PVC', 'LDPE', 'PP', 'PS', 'OTHER'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#14231b] mb-1.5">Reward Points / KG</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.pointsPerKg}
                  onChange={(e) => setFormData({ ...formData, pointsPerKg: Number(e.target.value) })}
                  className="w-full bg-[#fbfbf9] border border-[#d8e2dc] rounded-xl px-3.5 py-2.5 text-sm font-bold text-[#1b4332] focus:outline-none focus:ring-2 focus:ring-[#1b4332]/20 focus:border-[#1b4332] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#14231b] mb-1.5">Description & Guidelines</label>
              <textarea
                rows="3"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Common packaging items, consumer instructions (e.g. water bottles, beverage containers)"
                className="w-full bg-[#fbfbf9] border border-[#d8e2dc] rounded-xl p-3 text-xs text-[#14231b] placeholder-[#a0afa5] focus:outline-none focus:ring-2 focus:ring-[#1b4332]/20 focus:border-[#1b4332] transition"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-bold text-sm shadow-sm transition disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{submitting ? 'Saving Category...' : 'Save Plastic Category'}</span>
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default PlasticTypesPage;
