export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-6">
      <div className="w-full max-w-2xl bg-white p-12 rounded-[2.5rem] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] border-4 border-slate-900 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-yellow-400 border-4 border-slate-900 rounded-2xl flex items-center justify-center rotate-3">
            <svg className="w-10 h-10 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase text-slate-900 mb-4">
          Under Construction
        </h1>
        
        <p className="text-slate-600 font-medium text-lg mb-8 max-w-lg mx-auto">
          Learn Reps is currently offline for scheduled maintenance and core engine upgrades. We will be back online shortly.
        </p>

        <div className="inline-block bg-slate-100 border-2 border-slate-200 px-6 py-3 rounded-xl">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            System Status: <span className="text-red-500 animate-pulse ml-2">Offline</span>
          </p>
        </div>
      </div>
    </div>
  );
}
