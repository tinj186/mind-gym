'use client';

import Link from 'next/link';

export default function OverallView() {
  const subjects = [
    {
      id: 'math',
      name: 'Mathematics',
      icon: '📐',
      status: 'Active',
      progress: 68,
      lastSession: '2 hours ago',
      color: 'blue'
    },
    {
      id: 'science',
      name: 'Science',
      icon: '🧪',
      status: 'Coming Soon',
      progress: 0,
      lastSession: 'N/A',
      color: 'slate'
    },
    {
      id: 'english',
      name: 'English',
      icon: '📚',
      status: 'Coming Soon',
      progress: 0,
      lastSession: 'N/A',
      color: 'slate'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <main className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Welcome Section */}
        <section className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">THE TRAINING GROUND</h1>
          <p className="text-slate-500 font-medium">Select a wing to begin your neural conditioning.</p>
        </section>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {subjects.map((subject) => (
            <div 
              key={subject.id}
              className={`group relative bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm transition-all ${
                subject.status === 'Active' ? 'hover:shadow-xl hover:border-blue-200 cursor-pointer' : 'opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="text-4xl bg-slate-50 w-16 h-16 flex items-center justify-center rounded-2xl group-hover:bg-blue-50 transition-colors">
                  {subject.icon}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                  subject.status === 'Active' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-100 text-slate-400 border-slate-200'
                }`}>
                  {subject.status}
                </span>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mb-2">{subject.name}</h2>
              <p className="text-sm text-slate-400 mb-8">
                {subject.status === 'Active' ? `Last session: ${subject.lastSession}` : 'Enrollment currently closed'}
              </p>

              {/* Progress Bar (Visible for Active) */}
              {subject.status === 'Active' && (
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-bold text-slate-500 uppercase">Synapse Strength</span>
                    <span className="text-lg font-black text-blue-600">{subject.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-600 h-full rounded-full transition-all duration-1000"
                      style={{ width: `${subject.progress}%` }}
                    />
                  </div>
                  <Link href="/gym">
                    <button className="w-full mt-6 bg-slate-900 text-white py-4 rounded-2xl font-bold group-hover:bg-blue-600 transition-all">
                      Open Wing →
                    </button>
                  </Link>
                </div>
              )}
            </div>
          ))}

          {/* New Subject Placeholder */}
          <div className="border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center p-8 text-center text-slate-300">
            <div className="text-3xl mb-2">+</div>
            <p className="text-sm font-bold uppercase tracking-widest">Request Wing</p>
          </div>
        </div>
      </main>
    </div>
  );
}