"use client";

import { useState, useEffect } from 'react';

export default function UserRosterPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setUsers(data.users);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    if (!confirm("Are you sure you want to permanently delete this user? This cannot be undone.")) return;
    
    try {
      const res = await fetch(`/api/admin/users?userId=${userId}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }
      setUsers(users.filter(u => u.id !== userId));
    } catch (err) {
      alert("Failed to delete user: " + err.message);
    }
  };

  const handleUpdateStatus = async (userId, newStatus) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, subscriptionStatus: newStatus })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }
      
      setUsers(users.map(u => u.id === userId ? { ...u, subscriptionStatus: newStatus } : u));
    } catch (err) {
      alert("Failed to update status: " + err.message);
    }
  };

  if (isLoading) return <div className="p-8">Loading user roster...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-2">User Roster</h1>
          <p className="text-slate-500 font-medium">Manage parent accounts, subscription status, and access.</p>
        </div>
        <div className="bg-slate-100 px-4 py-2 rounded-lg text-sm font-bold text-slate-600">
          Total Users: {users.length}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Subscription</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Linked Students</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4">
                  <div className="font-bold text-slate-900">{user.name || "Unknown"}</div>
                  <div className="text-sm text-slate-500">{user.email || "No email"}</div>
                  <div className="text-xs text-slate-400 mt-1 font-mono">{user.id}</div>
                </td>
                
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs font-bold rounded-md ${
                    user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {user.role}
                  </span>
                </td>

                <td className="p-4">
                  <select 
                    value={user.subscriptionStatus}
                    onChange={(e) => handleUpdateStatus(user.id, e.target.value)}
                    className={`text-sm font-bold p-2 border rounded-lg cursor-pointer outline-none ${
                      user.subscriptionStatus === 'ACTIVE' 
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <option value="INACTIVE">INACTIVE</option>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="PAST_DUE">PAST_DUE</option>
                    <option value="CANCELED">CANCELED</option>
                  </select>
                </td>

                <td className="p-4">
                  {user.studentProfiles.length > 0 ? (
                    <div className="flex flex-col gap-1">
                      {user.studentProfiles.map((s, idx) => (
                        <span key={idx} className="text-sm text-slate-700 bg-slate-100 px-2 py-1 rounded inline-block w-max">
                          {s.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-sm text-slate-400 italic">None</span>
                  )}
                </td>

                <td className="p-4 text-right">
                  <button 
                    onClick={() => handleDelete(user.id)}
                    className="text-red-500 hover:text-red-700 text-sm font-bold px-3 py-1 bg-red-50 hover:bg-red-100 rounded transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            
            {users.length === 0 && (
              <tr>
                <td colSpan="5" className="p-8 text-center text-slate-500 font-medium">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
