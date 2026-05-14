'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getMissingHintCount, processHintBatchAction } from '@/lib/admin/hintActions';

export default function AdminSettingsPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dbStatus, setDbStatus] = useState('checking'); // 'checking' | 'online' | 'offline'
  const [dbError, setDbError] = useState(null);

  // AI Hint Backfill States
  const [hintStatus, setHintStatus] = useState('idle'); // 'idle' | 'running' | 'finished'
  const [hintProgress, setHintProgress] = useState({ current: 0, total: 0 });

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

  const runHintGeneration = async () => {
    try {
      setHintStatus('running');
      
      const totalToProcess = await getMissingHintCount();
      if (totalToProcess === 0) {
        setHintStatus('finished');
        return;
      }
      setHintProgress({ current: 0, total: totalToProcess });

      let processed = 0;
      while (processed < totalToProcess) {
        const result = await processHintBatchAction(5);
        // Break loop if the server action fails or returns no progress
        if (!result || result.count === 0) break;
        
        processed += result.count;
        setHintProgress(prev => ({ ...prev, current: processed }));
      }

      setHintStatus('finished');
    } catch (err) {
      console.error("Neural Processing interrupted:", err);
      alert(`Sync Failed: ${err.message}. Please restart the container to clear Server Action cache.`);
      setHintStatus('idle');
    }
  };

  useEffect(() => {
    checkDbStatus();
  }, []);

  const hintPercentage = hintProgress.total > 0 
    ? Math.round((hintProgress.current / hintProgress.total) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="border-b-4 border-slate-900 pb-6">
          <Link href="/admin/questions" className="text-blue-600 font-bold text-xs uppercase tracking-[0.2em] hover:underline mb-4 block">
            ← Return to Command Center
          </Link>
          <h1 className="text-5xl font-black italic tracking-tighter uppercase">Engine Room</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">System Maintenance // Data Calibration</p>
        </header>

        <div className="grid grid-cols-1 gap-8">
          {/* Module: Infrastructure Health */}
          <section className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Infrastructure Health</h2>
            <div className="flex items-center gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <div className={`w-3 h-3 rounded-full ${dbStatus === 'online' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : dbStatus === 'checking' ? 'bg-slate-300 animate-pulse' : 'bg-red-500 animate-pulse'}`} />
              <div>
                <p className="font-bold text-slate-900">PostgreSQL Database (Synology Container)</p>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{dbStatus}</p>
                {dbError && <p className="text-[10px] text-red-500 font-mono mt-1 max-w-md break-words">{dbError}</p>}
              </div>
            </div>
          </section>

          {/* Module: AI Hint Backfill */}
          <section className="bg-white rounded-[3rem] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-10 border-4 border-slate-900 space-y-8">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-2xl font-black">AI HINT BACKFILL</h2>
                <p className="text-slate-500 font-medium text-sm">Injecting conceptual scaffolding into the Question Bank.</p>
              </div>
              <button 
                onClick={runHintGeneration}
                disabled={hintStatus === 'running'}
                className={`px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-md ${
                  hintStatus === 'running' 
                    ? 'bg-slate-100 text-slate-400' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 shadow-lg'
                }`}
              >
                {hintStatus === 'running' ? 'CALIBRATING...' : 'START SYNC'}
              </button>
            </div>

            {(hintStatus === 'running' || hintStatus === 'finished') && (
              <div className="space-y-4 animate-in fade-in zoom-in-95 duration-500">
                <div className="flex justify-between font-black text-[10px] uppercase tracking-widest text-slate-400">
                  <span>{hintStatus === 'finished' ? 'Sync Complete' : 'Neural Processing...'}</span>
                  <span>{hintProgress.current} / {hintProgress.total} Questions</span>
                </div>
                <div className="h-10 w-full bg-slate-50 rounded-2xl overflow-hidden border-4 border-slate-900 p-1">
                  <div 
                    className="h-full bg-indigo-500 rounded-xl transition-all duration-500 ease-out flex items-center justify-end px-4"
                    style={{ width: `${hintPercentage}%` }}
                  >
                    <span className="text-white text-[10px] font-black">{hintPercentage}%</span>
                  </div>
                </div>
                {hintStatus === 'finished' && (
                  <p className="text-center text-green-600 font-black text-xs uppercase tracking-widest">✅ Question Bank successfully enriched.</p>
                )}
              </div>
            )}
          </section>

          {/* Module: AI Performance & Benchmarks */}
          <section className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">AI Performance Module</h2>
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

            <div className="overflow-hidden rounded-2xl border border-slate-100">
              <table className="min-w-full divide-y divide-slate-100">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Model ID</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Latency</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {results.map((row, idx) => (
                    <tr key={row.modelId} className={`hover:bg-slate-50/50 transition-colors ${row.role !== 'UNRANKED' && row.status === 'online' ? 'bg-blue-50/20' : ''}`}>
                      <td className="px-6 py-5 font-bold text-slate-900">{row.modelId}</td>
                      <td className="px-6 py-5 font-mono text-sm text-slate-600">
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