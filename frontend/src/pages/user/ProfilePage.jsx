import React, { useState } from 'react';
import { User, Phone, MapPin, Mail, Save, ShieldCheck } from 'lucide-react';
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
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e8f0ea] text-[#1b4332] text-xs font-semibold uppercase tracking-wider mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Account Settings</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14231b] tracking-tight">Personal Profile</h1>
        <p className="text-sm text-[#526458] mt-1">Manage your contact credentials, address for collections, and member identity.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e2e8df] shadow-sm space-y-6">
        {/* Profile Avatar & Member Info */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-[#edf2ec]">
          <div className="flex-shrink-0">
            <ImageUploader
              label="Profile Photo"
              currentImage={formData.profileImage}
              onUploadSuccess={(url) => setFormData({ ...formData, profileImage: url })}
            />
          </div>
          <div className="text-center sm:text-left space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <h3 className="text-xl font-bold text-[#14231b]">{user?.name || 'PlasticLoop Member'}</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-[#1b4332] text-white text-[11px] font-bold tracking-wide uppercase">
                {user?.role || 'Member'}
              </span>
            </div>
            <p className="text-xs text-[#526458] flex items-center justify-center sm:justify-start gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#8fa895]" />
              {user?.email}
            </p>
            {user?.phone && (
              <p className="text-xs text-[#718477] flex items-center justify-center sm:justify-start gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#8fa895]" />
                {user?.phone}
              </p>
            )}
          </div>
        </div>

        {/* Basic Details */}
        <div>
          <h4 className="text-xs font-bold text-[#718477] uppercase tracking-wider mb-3">General Information</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#14231b] mb-1.5">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter full name"
                  className="w-full bg-[#fbfbf9] border border-[#d8e2dc] rounded-xl px-3.5 py-2.5 text-sm text-[#14231b] placeholder-[#a0afa5] focus:outline-none focus:ring-2 focus:ring-[#1b4332]/20 focus:border-[#1b4332] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#14231b] mb-1.5">Phone Number</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-[#fbfbf9] border border-[#d8e2dc] rounded-xl px-3.5 py-2.5 text-sm text-[#14231b] placeholder-[#a0afa5] focus:outline-none focus:ring-2 focus:ring-[#1b4332]/20 focus:border-[#1b4332] transition"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Address Details */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-[#1b4332]" />
            <h4 className="text-xs font-bold text-[#718477] uppercase tracking-wider">Pickup / Dispatch Address</h4>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-[#14231b] mb-1.5">Street Address</label>
              <input
                type="text"
                required
                value={formData.address.street}
                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })}
                placeholder="123 Eco Way, Apt 4B"
                className="w-full bg-[#fbfbf9] border border-[#d8e2dc] rounded-xl px-3.5 py-2.5 text-sm text-[#14231b] placeholder-[#a0afa5] focus:outline-none focus:ring-2 focus:ring-[#1b4332]/20 focus:border-[#1b4332] transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#14231b] mb-1.5">City</label>
                <input
                  type="text"
                  required
                  value={formData.address.city}
                  onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })}
                  placeholder="Greenfield"
                  className="w-full bg-[#fbfbf9] border border-[#d8e2dc] rounded-xl px-3 py-2 text-sm text-[#14231b] placeholder-[#a0afa5] focus:outline-none focus:ring-2 focus:ring-[#1b4332]/20 focus:border-[#1b4332] transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#14231b] mb-1.5">State</label>
                <input
                  type="text"
                  required
                  value={formData.address.state}
                  onChange={(e) => setFormData({ ...formData, address: { ...formData.address, state: e.target.value } })}
                  placeholder="California"
                  className="w-full bg-[#fbfbf9] border border-[#d8e2dc] rounded-xl px-3 py-2 text-sm text-[#14231b] placeholder-[#a0afa5] focus:outline-none focus:ring-2 focus:ring-[#1b4332]/20 focus:border-[#1b4332] transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#14231b] mb-1.5">Postal / Zip Code</label>
                <input
                  type="text"
                  required
                  value={formData.address.zipCode}
                  onChange={(e) => setFormData({ ...formData, address: { ...formData.address, zipCode: e.target.value } })}
                  placeholder="94016"
                  className="w-full bg-[#fbfbf9] border border-[#d8e2dc] rounded-xl px-3 py-2 text-sm text-[#14231b] placeholder-[#a0afa5] focus:outline-none focus:ring-2 focus:ring-[#1b4332]/20 focus:border-[#1b4332] transition"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 px-6 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition disabled:opacity-60 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{submitting ? 'Saving Changes...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
