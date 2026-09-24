import React, { useEffect, useState } from 'react';
import { Users, Search, Filter, Shield, Edit2, UserCheck, UserX } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const UsersManagementPage = () => {
  const { showToast } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [roleFilter, setRoleFilter] = useState('');
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let query = `/admin/users?page=1&limit=50`;
      if (roleFilter) query += `&role=${roleFilter}`;
      if (search) query += `&search=${encodeURIComponent(search)}`;
      const res = await API.get(query);
      setUsers(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleToggleActive = async (userObj) => {
    try {
      await API.put(`/admin/users/${userObj._id}`, { isActive: !userObj.isActive });
      showToast(`User ${userObj.name} status updated`, 'success');
      fetchUsers();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await API.put(`/admin/users/${userId}`, { role: newRole });
      showToast('User role updated successfully', 'success');
      fetchUsers();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  if (loading) return <LoadingSpinner message="Loading user accounts database..." />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Platform Users & Stakeholders</h1>
          <p className="text-xs text-slate-400 mt-1">Manage Citizens, Collectors, Recyclers, and Admins</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search name/email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
              className="bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
          >
            <option value="">All Roles</option>
            <option value="USER">Citizens (USER)</option>
            <option value="COLLECTOR">Collectors</option>
            <option value="RECYCLER">Recyclers</option>
            <option value="ADMIN">Admins</option>
          </select>
        </div>
      </div>

      <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase bg-slate-900/60">
                <th className="py-3.5 px-5">User</th>
                <th className="py-3.5 px-5">Role</th>
                <th className="py-3.5 px-5">Contact Phone</th>
                <th className="py-3.5 px-5">Points</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs text-slate-200">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <img src={u.profileImage} alt={u.name} className="w-9 h-9 rounded-full object-cover border border-slate-700" />
                      <div>
                        <p className="font-bold text-white text-xs">{u.name}</p>
                        <p className="text-[11px] text-slate-400">{u.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-5">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-[11px] font-bold text-emerald-400"
                    >
                      <option value="USER">USER</option>
                      <option value="COLLECTOR">COLLECTOR</option>
                      <option value="RECYCLER">RECYCLER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>

                  <td className="py-4 px-5 text-slate-300 font-medium">{u.phone || 'N/A'}</td>
                  <td className="py-4 px-5 font-bold text-amber-400">{u.points || 0} PTS</td>

                  <td className="py-4 px-5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${u.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                      {u.isActive ? 'Active' : 'Deactivated'}
                    </span>
                  </td>

                  <td className="py-4 px-5">
                    <button
                      onClick={() => handleToggleActive(u)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                        u.isActive ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                      }`}
                    >
                      {u.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersManagementPage;
