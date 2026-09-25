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
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e8f0ea] text-[#1b4332] text-xs font-semibold uppercase tracking-wider mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Platform Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14231b] tracking-tight">Users & Stakeholders</h1>
          <p className="text-sm text-[#526458] mt-1">Manage Citizens, Logistics Collectors, Recycling Facilities, and System Administrators.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="w-4 h-4 text-[#8fa895] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
              className="w-full sm:w-60 bg-white border border-[#d8e2dc] rounded-xl pl-9 pr-3.5 py-2 text-xs text-[#14231b] placeholder-[#a0afa5] focus:outline-none focus:ring-2 focus:ring-[#1b4332]/20 focus:border-[#1b4332] shadow-sm transition"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-white border border-[#d8e2dc] rounded-xl px-3.5 py-2 text-xs font-semibold text-[#14231b] focus:outline-none focus:ring-2 focus:ring-[#1b4332]/20 focus:border-[#1b4332] shadow-sm cursor-pointer"
          >
            <option value="">All Roles</option>
            <option value="USER">Citizens (USER)</option>
            <option value="COLLECTOR">Collectors</option>
            <option value="RECYCLER">Recyclers</option>
            <option value="ADMIN">Admins</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-[#e2e8df] shadow-sm overflow-hidden">
        {users.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="w-12 h-12 rounded-full bg-[#e8f0ea] flex items-center justify-center mx-auto mb-3 text-[#1b4332]">
              <Users className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-[#14231b]">No users match the criteria</p>
            <p className="text-xs text-[#718477] mt-1">Try adjusting your search terms or filter selection.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#edf2ec] text-[11px] font-bold text-[#718477] uppercase bg-[#fbfbf9]">
                  <th className="py-3.5 px-6">User / Stakeholder</th>
                  <th className="py-3.5 px-6">Role Permission</th>
                  <th className="py-3.5 px-6">Contact Phone</th>
                  <th className="py-3.5 px-6">Reward Balance</th>
                  <th className="py-3.5 px-6">Account Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#edf2ec] text-xs text-[#14231b]">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-[#fbfbf9] transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {u.profileImage ? (
                          <img src={u.profileImage} alt={u.name} className="w-9 h-9 rounded-full object-cover border border-[#d8e2dc]" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-[#e8f0ea] text-[#1b4332] font-bold text-xs flex items-center justify-center">
                            {u.name?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-[#14231b] text-sm">{u.name}</p>
                          <p className="text-xs text-[#718477]">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="bg-[#fbfbf9] border border-[#d8e2dc] rounded-lg px-2.5 py-1 text-xs font-bold text-[#1b4332] focus:outline-none focus:ring-1 focus:ring-[#1b4332] cursor-pointer"
                      >
                        <option value="USER">USER</option>
                        <option value="COLLECTOR">COLLECTOR</option>
                        <option value="RECYCLER">RECYCLER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>

                    <td className="py-4 px-6 text-[#526458] font-medium">{u.phone || '—'}</td>

                    <td className="py-4 px-6 font-extrabold text-[#92400e]">
                      {u.points || 0} PTS
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          u.isActive
                            ? 'bg-[#e8f0ea] text-[#1b4332] border border-[#d8e2dc]'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {u.isActive ? 'Active' : 'Deactivated'}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleToggleActive(u)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                          u.isActive
                            ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                            : 'bg-[#e8f0ea] text-[#1b4332] hover:bg-[#d5e4d9] border border-[#d8e2dc]'
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
        )}
      </div>
    </div>
  );
};

export default UsersManagementPage;
