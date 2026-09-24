import React, { useEffect, useState } from 'react';
import { Layers, Plus, Edit2, Trash2 } from 'lucide-react';
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
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Plastic Waste Categories</h1>
          <p className="text-xs text-slate-400 mt-1">Configure resin codes and point multiplier rates</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl eco-button-gradient text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg"
        >
          <Plus className="w-4 h-4" /> Add New Plastic Type
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {types.map((t) => (
          <div key={t._id} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold text-xs">
                {t.code}
              </span>
              <span className="text-xs font-bold text-amber-400">+{t.pointsPerKg} pts / kg</span>
            </div>

            <h3 className="font-bold text-sm text-white">{t.name}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{t.description}</p>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => handleOpenEdit(t)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit Category
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingType ? 'Edit Plastic Type' : 'Add Plastic Type'}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">Plastic Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Polyethylene Terephthalate"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">Resin Code</label>
                <select
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                >
                  {['PET', 'HDPE', 'PVC', 'LDPE', 'PP', 'PS', 'OTHER'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">Points / KG</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.pointsPerKg}
                  onChange={(e) => setFormData({ ...formData, pointsPerKg: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">Description</label>
              <textarea
                rows="2"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl eco-button-gradient text-slate-950 font-extrabold text-xs shadow-lg"
            >
              {submitting ? 'Saving Category...' : 'Save Plastic Category'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default PlasticTypesPage;
