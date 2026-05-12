"use client";

import { useState, useEffect } from 'react';
import DivisionModal from './DivisionModal';

export default function DivisionBadge({ studentId, currentLevel }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Step 1: Automated "Division" scaling check on page load
  useEffect(() => {
    if (!currentLevel) {
      setIsModalOpen(true);
    }
  }, [currentLevel]);

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-4 px-5 py-2.5 bg-white border-2 border-slate-100 rounded-2xl hover:border-blue-500 hover:shadow-md transition-all group active:scale-95"
      >
        <div className="flex flex-col items-start">
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Division</span>
          <span className="text-xs font-black text-slate-900">{currentLevel || 'Not Set'}</span>
        </div>
        <div className="w-8 h-8 flex items-center justify-center bg-slate-50 rounded-xl group-hover:bg-blue-50 transition-colors">
          <span className="text-[12px] group-hover:rotate-180 transition-transform duration-500">🔄</span>
        </div>
      </button>

      <DivisionModal 
        studentId={studentId} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}