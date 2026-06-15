"use client";

import { useState } from 'react';
import { updateStudentDivision } from '@/app/actions/studentActions';

export default function DivisionModal({ studentId, isOpen, onClose }) {
  const divisions = ['Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6'];
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSelect = async (level) => {
    setLoading(true);
    try {
      await updateStudentDivision(studentId, level);
      onClose();
    } catch (error) {
      console.error("Failed to save division", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-[3rem] p-12 max-w-4xl w-full shadow-2xl text-center space-y-12 border-4 border-slate-100">
        <div className="space-y-4">
          <span className="text-[12px] font-black text-blue-500 uppercase tracking-[0.3em] block">Training Initialization</span>
          <h2 className="text-5xl font-black text-slate-900">Select Your Division</h2>
          <p className="text-slate-400 font-bold max-w-md mx-auto">Your personal trainer curates daily workouts based on your school level logic.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {divisions.map((level) => {
            const isAvailable = level === 'Primary 1';
            return (
              <button
                key={level}
                disabled={loading || !isAvailable}
                onClick={() => handleSelect(level)}
                className={`group relative p-8 rounded-[2.5rem] border-2 transition-all text-left overflow-hidden ${
                  isAvailable 
                    ? "bg-slate-50 hover:bg-slate-900 border-slate-100 hover:border-slate-900 active:scale-95 cursor-pointer" 
                    : "bg-slate-50/50 border-slate-100/50 opacity-50 cursor-not-allowed"
                }`}
              >
                <div className="relative z-10 space-y-1">
                  <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${
                    isAvailable ? "text-slate-400 group-hover:text-blue-400" : "text-slate-300"
                  }`}>
                    {isAvailable ? "Available Now" : "Coming Soon"}
                  </span>
                  <p className={`text-2xl font-black transition-colors ${
                    isAvailable ? "text-slate-900 group-hover:text-white" : "text-slate-400"
                  }`}>
                    {level}
                  </p>
                </div>
                <div className="absolute -right-4 -bottom-6 text-9xl font-black text-slate-200 opacity-20 group-hover:opacity-10 transition-opacity italic">
                  {level.split(' ')[1]}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}