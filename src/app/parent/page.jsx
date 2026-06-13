import Link from 'next/link';
import SignOutButton from '@/components/auth/SignOutButton';

export default function ParentHub() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="p-8 border-b border-slate-200 bg-white shadow-sm flex justify-between items-center">
        <div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Portal</span>
          <h1 className="text-3xl font-black text-slate-900">Parent Command Center</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link 
            href="/" 
            className="px-6 py-2 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
          >
            Back to Entry
          </Link>
          <SignOutButton />
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-8 py-12">
        <h2 className="text-xl font-bold text-slate-700 mb-6">Subject Analytics Hub</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/parent/math" className="group">
            <div className="bg-white p-8 rounded-3xl border-2 border-slate-200 shadow-sm hover:border-blue-500 hover:shadow-lg transition-all flex flex-col h-full">
              <div className="text-4xl bg-blue-50 w-16 h-16 flex flex-col items-center justify-center rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                📐
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Mathematics</h3>
              <p className="text-slate-500 font-medium">
                View neural training progress, mastery analytics, and bottleneck metrics.
              </p>
            </div>
          </Link>

          {/* Placeholders for future subjects */}
          <div className="bg-slate-100 p-8 rounded-3xl border-2 border-slate-200 border-dashed opacity-60 flex flex-col items-center justify-center text-center">
            <div className="text-3xl mb-2 text-slate-400">🧪</div>
            <h3 className="text-xl font-bold text-slate-500 mb-1">Science</h3>
            <span className="text-[10px] font-black tracking-widest uppercase text-slate-400">Coming Soon</span>
          </div>

          <div className="bg-slate-100 p-8 rounded-3xl border-2 border-slate-200 border-dashed opacity-60 flex flex-col items-center justify-center text-center">
            <div className="text-3xl mb-2 text-slate-400">📚</div>
            <h3 className="text-xl font-bold text-slate-500 mb-1">English</h3>
            <span className="text-[10px] font-black tracking-widest uppercase text-slate-400">Coming Soon</span>
          </div>
        </div>
      </main>
    </div>
  );
}
