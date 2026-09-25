import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RefreshCw, ArrowRight, CheckCircle2 } from 'lucide-react';
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
    <div className="min-h-screen bg-[#fbfbf9] flex items-center justify-center p-4 sm:p-8 selection:bg-[#1b4332] selection:text-white">
      <div className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-10 border border-[#e2e8df] shadow-lg">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#1b4332] flex items-center justify-center text-white shadow-sm">
              <RefreshCw className="w-5 h-5 animate-spin-slow" />
            </div>
          </Link>
          <h2 className="text-2xl font-extrabold text-[#14231b]">Join the Circular Movement</h2>
          <p className="text-xs text-[#5e7165] mt-1">Register as a Citizen, Collector, Recycler, or Admin</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role selector */}
          <div>
            <label className="block text-xs font-bold text-[#14231b] uppercase tracking-wider mb-2">
              Select Your Role
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'USER', label: 'Citizen', emoji: '👤' },
                { id: 'COLLECTOR', label: 'Collector', emoji: '🚚' },
                { id: 'RECYCLER', label: 'Recycler', emoji: '🏭' },
                { id: 'ADMIN', label: 'Admin', emoji: '🛡️' },
              ].map((r) => (
                <button
                  type="button"
                  key={r.id}
                  onClick={() => setFormData({ ...formData, role: r.id })}
                  className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all text-center flex flex-col items-center gap-0.5 ${
                    formData.role === r.id
                      ? 'bg-[#1b4332] text-white border-[#1b4332] shadow-sm'
                      : 'bg-[#f7f9f7] text-[#4f6055] border-[#dce5de] hover:bg-[#edf4ef]'
                  }`}
                >
                  <span className="text-sm">{r.emoji}</span>
                  <span>{r.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#14231b] uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Rahul Sharma"
                className="w-full bg-[#fbfcfb] border border-[#dce5de] rounded-xl px-3 py-2 text-xs text-[#14231b] focus:outline-none focus:border-[#1b4332]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#14231b] uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 9876543210"
                className="w-full bg-[#fbfcfb] border border-[#dce5de] rounded-xl px-3 py-2 text-xs text-[#14231b] focus:outline-none focus:border-[#1b4332]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#14231b] uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@example.com"
                className="w-full bg-[#fbfcfb] border border-[#dce5de] rounded-xl px-3 py-2 text-xs text-[#14231b] focus:outline-none focus:border-[#1b4332]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#14231b] uppercase tracking-wider mb-1">
                Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="At least 6 characters"
                className="w-full bg-[#fbfcfb] border border-[#dce5de] rounded-xl px-3 py-2 text-xs text-[#14231b] focus:outline-none focus:border-[#1b4332]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#14231b] uppercase tracking-wider mb-1">
              Street Address
            </label>
            <input
              type="text"
              required
              value={formData.address.street}
              onChange={(e) => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })}
              placeholder="Flat 101, Green Heights"
              className="w-full bg-[#fbfcfb] border border-[#dce5de] rounded-xl px-3 py-2 text-xs text-[#14231b] focus:outline-none focus:border-[#1b4332]"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[11px] font-bold text-[#14231b] uppercase tracking-wider mb-1">City</label>
              <input
                type="text"
                required
                value={formData.address.city}
                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })}
                placeholder="Chennai"
                className="w-full bg-[#fbfcfb] border border-[#dce5de] rounded-xl px-2.5 py-1.5 text-xs text-[#14231b] focus:outline-none focus:border-[#1b4332]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#14231b] uppercase tracking-wider mb-1">State</label>
              <input
                type="text"
                required
                value={formData.address.state}
                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, state: e.target.value } })}
                placeholder="Tamil Nadu"
                className="w-full bg-[#fbfcfb] border border-[#dce5de] rounded-xl px-2.5 py-1.5 text-xs text-[#14231b] focus:outline-none focus:border-[#1b4332]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#14231b] uppercase tracking-wider mb-1">Zip Code</label>
              <input
                type="text"
                required
                value={formData.address.zipCode}
                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, zipCode: e.target.value } })}
                placeholder="600001"
                className="w-full bg-[#fbfcfb] border border-[#dce5de] rounded-xl px-2.5 py-1.5 text-xs text-[#14231b] focus:outline-none focus:border-[#1b4332]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl eco-btn-primary font-bold text-xs flex items-center justify-center gap-2 shadow-sm mt-3"
          >
            {submitting ? 'Creating Account...' : 'Complete Registration'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-5 text-center text-xs text-[#63756a]">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-[#1b4332] hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
