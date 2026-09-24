import React, { useState } from 'react';
import { User, Phone, MapPin, Mail, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import ImageUploader from '../../components/ImageUploader';

const ProfilePage = () => {
  const { user, refreshUser, showToast } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    profileImage: user?.profileImage || '',
    address: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      zipCode: user?.address?.zipCode || '',
    },
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.put('/auth/profile', formData);
      await refreshUser();
      showToast('Profile updated successfully!', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Account Profile Settings</h1>
        <p className="text-xs text-slate-400 mt-1">Manage your personal information, contact numbers and delivery address</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-800">
          <ImageUploader
            label="Profile Image"
            currentImage={formData.profileImage}
            onUploadSuccess={(url) => setFormData({ ...formData, profileImage: url })}
          />
          <div>
            <h3 className="text-lg font-bold text-white">{user?.name}</h3>
            <p className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">{user?.role} ACCOUNT</p>
            <p className="text-xs text-slate-400 mt-1">{user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1">Phone Number</label>
            <input
              type="text"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-200 mb-1">Street Address</label>
          <input
            type="text"
            required
            value={formData.address.street}
            onChange={(e) => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-200 mb-1">City</label>
            <input
              type="text"
              required
              value={formData.address.city}
              onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-200 mb-1">State</label>
            <input
              type="text"
              required
              value={formData.address.state}
              onChange={(e) => setFormData({ ...formData, address: { ...formData.address, state: e.target.value } })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-200 mb-1">Zip Code</label>
            <input
              type="text"
              required
              value={formData.address.zipCode}
              onChange={(e) => setFormData({ ...formData, address: { ...formData.address, zipCode: e.target.value } })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 rounded-xl eco-button-gradient text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg"
        >
          <Save className="w-4 h-4" /> {submitting ? 'Saving Changes...' : 'Save Profile Changes'}
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
