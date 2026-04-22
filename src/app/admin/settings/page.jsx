'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminSettingsPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dbStatus, setDbStatus] = useState('checking'); // 'checking' | 'online' | 'offline'
  const [dbError, setDbError] = useState(null);

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
      const res = await fetch('/api/admin/system/benchmark');
      
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned HTML instead of JSON. Ensure the benchmark route is correctly placed.");
      }

      const data = await res.json();
      setResults(data);
    } catch (err) {
      alert(`Benchmark failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkDbStatus();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <header>
          <Link href="/admin/questions" className="text-blue-600 font-bold text-sm uppercase tracking-widest hover:underline mb-2 block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tighter uppercase">
            Admin Settings
          </h1>
          <p className="text-slate-400 font-medium">Manage AI models and core infrastructure health.</p>
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
                    <tr key={row.modelId} className={`hover:bg-slate-50/50 transition-colors ${idx === 0 && row.status === 'online' ? 'bg-blue-50/30' : ''}`}>
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
                        {idx === 0 && row.status === 'online' && (
                          <span className="bg-blue-600 text-white text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-widest">
                            Primary
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