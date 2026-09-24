import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RefreshCw, User, Mail, Lock, Phone, MapPin, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'USER',
    address: { street: '', city: '', state: '', zipCode: '' },
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const userObj = await register(formData);
      if (userObj.role === 'ADMIN') navigate('/admin/dashboard');
      else if (userObj.role === 'COLLECTOR') navigate('/collector/dashboard');
      else if (userObj.role === 'RECYCLER') navigate('/recycler/dashboard');
      else navigate('/dashboard');
    } catch (err) {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-xl glass-card rounded-3xl p-8 border-slate-800 shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 mx-auto flex items-center justify-center shadow-lg mb-2">
            <RefreshCw className="w-6 h-6 text-slate-950" />
          </div>
          <h2 className="text-xl font-extrabold text-white">Join PlasticLoop Platform</h2>
          <p className="text-xs text-slate-400 mt-0.5">Register as a Citizen, Collector, Recycler, or Admin</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Select Your Role</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'USER', label: 'Citizen' },
                { id: 'COLLECTOR', label: 'Collector' },
                { id: 'RECYCLER', label: 'Recycler' },
                { id: 'ADMIN', label: 'Admin' },
              ].map((r) => (
                <button
                  type="button"
                  key={r.id}
                  onClick={() => setFormData({ ...formData, role: r.id })}
                  className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all ${
                    formData.role === r.id
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Rahul Sharma"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 9876543210"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@example.com"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="At least 6 characters"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Street Address</label>
            <input
              type="text"
              required
              value={formData.address.street}
              onChange={(e) => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })}
              placeholder="Flat 101, Green Heights"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">City</label>
              <input
                type="text"
                required
                value={formData.address.city}
                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })}
                placeholder="Chennai"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">State</label>
              <input
                type="text"
                required
                value={formData.address.state}
                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, state: e.target.value } })}
                placeholder="Tamil Nadu"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Zip Code</label>
              <input
                type="text"
                required
                value={formData.address.zipCode}
                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, zipCode: e.target.value } })}
                placeholder="600001"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl eco-button-gradient text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg mt-2"
          >
            {submitting ? 'Creating Account...' : 'Complete Registration'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-4 text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-emerald-400 hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
