'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getBackupStatusAction, triggerJsonDumpAction, restoreJsonBackupAction } from '@/app/actions/backupActions';

export default function AdminSettingsPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dbStatus, setDbStatus] = useState('checking'); // 'checking' | 'online' | 'offline'
  const [dbError, setDbError] = useState(null);

  // Data Fortress States
  const [backupStatus, setBackupStatus] = useState(null);
  const [backupLoading, setBackupLoading] = useState(false);

  const checkDbStatus = async () => {
    try {
      const res = await fetch('/api/admin/system/db-check');
      
      // Verify the response is JSON
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`Server returned HTML (likely a 404 or 500 error). Check if /api/admin/system/db-check/route.js exists.`);
      }

      const data = await res.json();
      if (res.ok) {
        setDbStatus('online');
        setDbError(null);
      } else {
        setDbStatus('offline');
        setDbError(data.message || 'Unknown database error');
      }
    } catch (err) {
      setDbStatus('offline');
      setDbError(err.message);
    }
  };

  const handleRunBenchmark = async () => {
    setLoading(true);
    try {
      // Update to the new Dynamic Model Router endpoint
      const res = await fetch('/api/admin/performance');
      const data = await res.json();
      setResults(data);
    } catch (err) {
      alert(`Benchmark failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchBackupStatus = async () => {
    const data = await getBackupStatusAction();
    setBackupStatus(data);
  };

  const handleDump = async () => {
    setBackupLoading(true);
    const result = await triggerJsonDumpAction();
    if (result.success) {
      await fetchBackupStatus();
      alert(`Fortress Updated: ${result.count} questions secured.`);
    }
    setBackupLoading(false);
  };

  const handleRestore = async () => {
    const confirmed = confirm("⚠️ EMERGENCY RESTORE: This will inject all questions from your JSON backup into the database. Proceed?");
    if (!confirmed) return;

    setBackupLoading(true);
    const result = await restoreJsonBackupAction();
    if (result.success) {
      alert(`NEURAL RECOVERY COMPLETE: ${result.count} questions restored.`);
      await fetchBackupStatus();
      await checkDbStatus();
    } else {
      alert(`RESTORATION FAILED: ${result.error}`);
    }
    setBackupLoading(false);
  };

  useEffect(() => {
    checkDbStatus();
    fetchBackupStatus();
  }, []);

  const isDesynced = backupStatus?.dbCount !== backupStatus?.backupCount;

  return (
    <div>
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="border-b-8 border-slate-900 pb-6 flex justify-between items-end">
          <div>
            <Link href="/admin/questions" className="text-blue-600 font-bold text-xs uppercase tracking-[0.2em] hover:underline mb-4 block">
              ← Return to Command Center
            </Link>
            <h1 className="text-5xl font-black italic tracking-tighter uppercase text-white">Engine Room</h1>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Data Persistence // Disaster Recovery</p>
          </div>

          {backupStatus?.dbCount === 0 && (
            <div className="bg-rose-600 text-white px-4 py-2 rounded-lg font-black animate-bounce text-xs">
              ⚠️ DATABASE EMPTY
            </div>
          )}
        </header>

        <div className="grid grid-cols-1 gap-8">
          {/* Module: Infrastructure Health */}
          <section className="bg-slate-700 rounded-3xl shadow-sm p-8 border border-slate-600">
            <h2 className="text-2xl font-bold text-white mb-6">Infrastructure Health</h2>
            <div className="flex items-center gap-4 p-6 bg-slate-800 rounded-2xl border border-slate-600">
              <div className={`w-3 h-3 rounded-full ${dbStatus === 'online' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : dbStatus === 'checking' ? 'bg-slate-300 animate-pulse' : 'bg-red-500 animate-pulse'}`} />
              <div>
                <p className="font-bold text-white">PostgreSQL Database (Supabase Cloud)</p>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{dbStatus}</p>
                {dbError && <p className="text-[10px] text-red-500 font-mono mt-1 max-w-md break-words">{dbError}</p>}
              </div>
            </div>
          </section>

          {/* Module: Data Fortress (Replacing AI Hint Backfill) */}
          <section className="bg-slate-700 rounded-[2rem] shadow-sm p-10 border border-slate-600 space-y-8">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-black italic text-white">DATA_FORTRESS</h2>
                <p className="text-slate-400 font-medium">Single-file JSON sync for Question Bank integrity.</p>
              </div>
              
              <div className="flex gap-4">
                <button 
                  onClick={handleDump}
                  disabled={backupLoading || !backupStatus}
                  className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50"
                >
                  TRIGGER DUMP
                </button>
                
                <button 
                  onClick={handleRestore}
                  disabled={backupLoading || !backupStatus?.exists}
                  className="bg-rose-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-rose-700 transition-all active:translate-y-[2px] disabled:opacity-50 disabled:grayscale"
                >
                  EMERGENCY RESTORE
                </button>
              </div>
            </div>

            {backupStatus ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StatusCard 
                    label="LIVE DB REPS" 
                    value={backupStatus.dbCount} 
                  />
                  <StatusCard 
                    label="VAULTED REPS" 
                    value={backupStatus.backupCount} 
                    highlight={isDesynced}
                  />
                  <StatusCard 
                    label="VAULT STATUS" 
                    value={backupStatus.exists ? "SECURED" : "MISSING"} 
                    color={backupStatus.exists ? "text-green-600" : "text-rose-600"}
                  />
                </div>

                {isDesynced && (
                  <div className="p-6 bg-amber-50 border-4 border-amber-400 rounded-2xl flex items-center gap-4 animate-pulse">
                    <span className="text-3xl">⚠️</span>
                    <p className="text-amber-900 font-black text-sm uppercase">
                      Desync Detected: {backupStatus.dbCount - backupStatus.backupCount} new questions are not yet protected!
                    </p>
                  </div>
                )}

                {backupStatus.exists && (
                  <div className="pt-4 border-t-2 border-slate-100 flex justify-between items-center text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                    <span>File Path: /public/backups/questions_backup.jsonl.gz</span>
                    <span>Last Sync: {new Date(backupStatus.lastGenerated).toLocaleString()}</span>
                  </div>
                )}
              </>
            ) : (
              <div className="p-6 font-black text-slate-400">LOADING BACKUP STATUS...</div>
            )}
          </section>

          {/* Module: AI Performance & Benchmarks */}
          <section className="bg-slate-700 rounded-3xl shadow-sm p-8 border border-slate-600">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white">AI Performance Module</h2>
                <p className="text-slate-400 text-sm">Automated model routing based on real-time speed tests.</p>
              </div>
              <button
                onClick={handleRunBenchmark}
                disabled={loading}
                className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-3 ${
                  loading ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-lg'
                }`}
              >
                {loading && <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />}
                {loading ? 'Testing Models...' : 'Run Speed Test'}
              </button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-600">
              <table className="min-w-full divide-y divide-slate-600">
                <thead className="bg-slate-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Model ID</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Latency</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-600">
                  {results.map((row, idx) => (
                    <tr key={row.modelId} className={`hover:bg-slate-600/50 transition-colors ${row.role !== 'UNRANKED' && row.status === 'online' ? 'bg-blue-900/20' : ''}`}>
                      <td className="px-6 py-5 font-bold text-white">{row.modelId}</td>
                      <td className="px-6 py-5 font-mono text-sm text-slate-300">
                        {row.latency === 99999 ? '—' : `${row.latency}ms`}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${row.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`} />
                          <span className={`text-[10px] font-black uppercase ${row.status === 'online' ? 'text-green-600' : 'text-red-600'}`}>
                            {row.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        {row.role !== 'UNRANKED' && row.status === 'online' && (
                          <span className={`text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-widest ${
                            row.role === 'PRIMARY' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                          }`}>
                            {row.role}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function StatusCard({ label, value, sub, highlight, color = "text-white" }) {
  return (
    <div className={`p-8 rounded-[2rem] border ${highlight ? 'border-amber-400 bg-amber-900/30' : 'border-slate-600 bg-slate-800 shadow-sm'}`}>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{label}</p>
      <p className={`text-5xl font-black tracking-tighter ${color}`}>{value}</p>
      {sub && <p className="text-xs font-bold text-slate-500 mt-1 uppercase">{sub}</p>}
    </div>
  );
}