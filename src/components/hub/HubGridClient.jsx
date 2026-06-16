"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { playClickSound } from '@/lib/audio';

export default function HubGridClient({ subjects, themePrimaryBg, themePrimaryColor, isP6 }) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {subjects.map((subj) => (
        <motion.div 
          key={subj.id}
          variants={item}
          className={`group relative p-8 rounded-[2.5rem] border shadow-sm transition-all ${
            subj.isActive 
              ? isP6 
                ? 'bg-slate-900 text-slate-100 border-slate-700 hover:border-amber-500 hover:shadow-xl cursor-pointer' 
                : 'bg-white border-slate-200 hover:border-sky-200 hover:shadow-xl cursor-pointer'
              : 'bg-slate-50 border-slate-200 opacity-60 grayscale cursor-not-allowed'
          }`}
        >
          <div className="flex justify-between items-start mb-6">
            <div className={`text-4xl w-16 h-16 flex items-center justify-center rounded-2xl transition-colors ${
              subj.isActive 
                ? isP6 ? 'bg-slate-800 group-hover:bg-slate-700' : 'bg-slate-50 group-hover:bg-sky-50'
                : 'bg-slate-100'
            }`}>
              {subj.icon}
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
              subj.isActive 
                ? isP6 ? 'bg-slate-800 text-amber-500 border-amber-500/30' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                : 'bg-slate-100 text-slate-500 border-slate-200'
            }`}>
              {subj.status}
            </span>
          </div>

          <h2 className="text-2xl font-bold mb-2">{subj.name}</h2>
          <p className="text-sm opacity-60 mb-8">
            {subj.isActive ? `Last session: ${subj.lastSession}` : subj.lastSession}
          </p>

          {/* Progress Bar (Visible for Active) */}
          {subj.isActive ? (
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <span className="text-xs font-bold uppercase opacity-60">Synapse Confidence</span>
                <span className={`text-lg font-black ${themePrimaryColor}`}>{subj.progress}%</span>
              </div>
              <div className={`w-full h-2 rounded-full overflow-hidden ${isP6 ? 'bg-slate-800' : 'bg-slate-100'}`}>
                <div 
                  className={`${themePrimaryBg} h-full rounded-full transition-all duration-1000`}
                  style={{ width: `${subj.progress}%` }}
                />
              </div>
              <Link href="/math">
                <button 
                  onClick={() => playClickSound()}
                  className={`w-full mt-6 py-4 rounded-2xl font-bold transition-all cursor-pointer ${isP6 ? 'bg-amber-500 text-slate-900 hover:bg-amber-400' : 'bg-slate-900 text-white hover:bg-sky-600'}`}
                >
                  Open Wing →
                </button>
              </Link>
            </div>
          ) : (
            <div className="mt-6 pt-6 border-t border-slate-200">
              <button disabled className="w-full py-4 rounded-2xl font-bold bg-slate-200 text-slate-400 cursor-not-allowed">
                In Development
              </button>
            </div>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}
