"use client";

import { useState, useEffect } from 'react';

function StudentExhaustionCard({ student }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [drilldown, setDrilldown] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    if (isExpanded) {
      setIsExpanded(false);
      return;
    }
    
    setIsExpanded(true);
    if (!drilldown) {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/admin/users/exhaustion?studentId=${student.id}&level=${encodeURIComponent(student.primaryLevel)}`);
        const data = await res.json();
        if (data.breakdown) {
          setDrilldown(data.breakdown);
        }
      } catch (err) {
        console.error("Failed to fetch drilldown:", err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col gap-1 bg-slate-50 border border-slate-200 p-2 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors" onClick={handleToggle}>
      <div className="flex justify-between items-center">
        <span className="text-sm font-bold text-white">{student.name}</span>
        <span className={`text-[10px] font-black ${student.exhaustionPercent >= 95 ? 'text-red-600' : 'text-slate-500'}`}>
          {student.exhaustionPercent}% Vault
        </span>
      </div>
      {/* Main Progress Bar Container */}
      <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-500 ${student.exhaustionPercent >= 95 ? 'bg-red-500' : 'bg-blue-500'}`}
          style={{ width: `${Math.max(2, student.exhaustionPercent || 0)}%` }}
        />
      </div>

      {/* Expanded Drilldown */}
      {isExpanded && (
        <div className="mt-2 pt-2 border-t border-slate-200 space-y-2 cursor-default" onClick={e => e.stopPropagation()}>
          {isLoading ? (
            <div className="text-[10px] text-slate-400 font-bold uppercase text-center py-2">Loading breakdown...</div>
          ) : drilldown && drilldown.length > 0 ? (
            drilldown.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-bold text-slate-600 truncate max-w-[120px]" title={item.subtopic}>{item.subtopic}</span>
                  <span className={`font-black ${item.percentage >= 95 ? 'text-red-600' : 'text-slate-400'}`}>
                    {item.percentage}%
                  </span>
                </div>
                <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${item.percentage >= 95 ? 'bg-red-500' : 'bg-indigo-400'}`}
                    style={{ width: `${Math.max(2, item.percentage)}%` }}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="text-[10px] text-slate-400 font-bold uppercase text-center py-2">No subtopic data</div>
          )}
        </div>
      )}
    </div>
  );
}

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
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">User Roster</h1>
          <p className="text-slate-400 font-medium">Manage parent accounts, subscription status, and access.</p>
        </div>
        <div className="bg-slate-700 px-4 py-2 rounded-lg text-sm font-bold text-slate-300">
          Total Users: {users.length}
        </div>
      </div>

      <div className="bg-slate-700 border border-slate-600 rounded-3xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800 border-b border-slate-600">
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Subscription</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Linked Students</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-slate-600/50 transition-colors">
                <td className="p-4">
                  <div className="font-bold text-white flex items-center gap-2">
                    {user.name || "Unknown"}
                    {user.emailVerified ? (
                      <span className="bg-emerald-900/30 text-emerald-400 text-[10px] px-1.5 py-0.5 rounded border border-emerald-800" title="Email Verified">✓ Verified</span>
                    ) : (
                      <span className="bg-amber-900/30 text-amber-400 text-[10px] px-1.5 py-0.5 rounded border border-amber-800" title="Email Unverified">! Unverified</span>
                    )}
                  </div>
                  <div className="text-sm text-slate-400">{user.email || "No email"}</div>
                  <div className="text-xs text-slate-400 mt-1 font-mono">{user.id}</div>
                </td>
                
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs font-bold rounded-md ${
                    user.role === 'ADMIN' ? 'bg-purple-900/50 text-purple-300' : 'bg-slate-800 text-slate-300'
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
                        ? 'bg-emerald-900/30 border-emerald-800 text-emerald-400'
                        : 'bg-slate-800 border-slate-600 text-slate-300'
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
                    <div className="flex flex-col gap-3 w-56">
                      {user.studentProfiles.map((s, idx) => (
                        <StudentExhaustionCard key={idx} student={s} />
                      ))}
                    </div>
                  ) : (
                    <span className="text-sm text-slate-400 italic">None</span>
                  )}
                </td>

                <td className="p-4 text-right">
                  <button 
                    onClick={() => handleDelete(user.id)}
                    className="text-red-400 hover:text-red-300 text-sm font-bold px-3 py-1 bg-red-950/30 hover:bg-red-900/50 rounded transition-colors"
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
