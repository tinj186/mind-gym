"use client";

import { useState } from 'recharts';
// Next.js Link
import Link from 'next/link';
// React's useState
import React from 'react';

const VARIANT_MAP = {
  'visual_cross_out_subtraction': 'Visual Subtraction Pattern',
  'foundation_visual_grouping': 'Visual Grouping Basics',
  'foundation_visual_sharing': 'Visual Sharing Basics',
  'standard_word_problem': 'Standard Word Problem',
  'advanced_attribute_tf_matrix': 'Attribute Logic Matrix',
  'standard_equation': 'Standard Equation Solving',
  'number_bonds_missing_part': 'Number Bonds (Missing Part)',
  'number_bonds_missing_whole': 'Number Bonds (Missing Whole)',
};

function formatVariantName(rawId) {
  if (VARIANT_MAP[rawId]) return VARIANT_MAP[rawId];
  if (!rawId) return 'Unknown Variant';
  // Fallback: Title case the raw ID
  return rawId.split(/[-_]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

export default function VariantAnalysis({ data = [] }) {
  // Isolate bottlenecks (synapse strength < 50%)
  const bottlenecks = data.filter(m => m.synapseStrength < 50);

  // Local state to mock "Assign to Student" queues
  const [queuedVariants, setQueuedVariants] = React.useState(new Set());

  const toggleQueue = (variantId) => {
    setQueuedVariants(prev => {
      const newSet = new Set(prev);
      if (newSet.has(variantId)) newSet.delete(variantId);
      else newSet.add(variantId);
      return newSet;
    });
  };

  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-black tracking-tight flex items-center gap-3 text-slate-900 uppercase">
          <span className="w-8 h-8 bg-slate-900 text-white flex items-center justify-center rounded-lg text-sm">02</span>
          Diagnostic Deep-Dive
        </h2>
        <p className="text-sm font-bold uppercase text-slate-500 tracking-widest pl-11">
          Isolating mechanical variant bottlenecks within topics
        </p>
      </div>
      
      <div className="space-y-4 pl-11">
        {bottlenecks.map(b => {
          const rawId = b.subTopicId || b.topicId || b.subtopic || b.topic;
          const friendlyName = formatVariantName(rawId);
          const isQueued = queuedVariants.has(rawId);
          
          return (
            <div key={b.id} className="p-6 bg-white border-4 border-slate-900 rounded-[2rem] flex flex-col md:flex-row gap-6 items-start md:items-center shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 transition-transform">
              <div className="w-16 h-16 bg-rose-100 border-4 border-rose-500 flex items-center justify-center rounded-2xl flex-shrink-0 text-3xl shadow-sm">
                ⚠️
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Variant Signature</span>
                <h3 className="font-black text-slate-900 text-xl uppercase leading-tight">{friendlyName}</h3>
                <p className="text-xs font-bold text-rose-600 uppercase mt-2">
                  <span className="text-slate-500 mr-2">Diagnostics:</span> 
                  Pattern recognition failing. Form repair required.
                </p>
              </div>
              
              <div className="flex flex-col gap-3 min-w-[200px]">
                <div className="px-6 py-2 bg-rose-50 border-4 border-rose-500 rounded-xl text-rose-600 font-black text-lg shadow-sm tabular-nums text-center flex justify-between items-center">
                  <span className="text-[10px] text-rose-400">MASTERY</span>
                  {b.synapseStrength}%
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => toggleQueue(rawId)}
                    className={`px-3 py-3 font-black uppercase tracking-widest text-[9px] rounded-xl transition-colors border-2 shadow-sm text-center leading-tight ${
                      isQueued 
                        ? 'bg-emerald-500 text-white border-emerald-600 hover:bg-emerald-600'
                        : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {isQueued ? '✓ Queued' : '+ Assign'}
                  </button>
                  <Link 
                    href={`/science/audit?variant=${encodeURIComponent(rawId)}`}
                    className="px-3 py-3 bg-blue-600 text-white font-black uppercase tracking-widest text-[9px] rounded-xl hover:bg-blue-700 transition-colors border-2 border-blue-800 shadow-sm text-center flex items-center justify-center leading-tight"
                  >
                    View Logic
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
        {bottlenecks.length === 0 && (
          <div className="p-12 border-4 border-slate-900 bg-white rounded-[2rem] text-center shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
            <span className="text-5xl block mb-4">🏆</span>
            <h3 className="text-xl font-black text-slate-900 uppercase">No Critical Bottlenecks</h3>
            <p className="text-slate-500 font-medium">All trained variants are exceeding the minimum viability threshold.</p>
          </div>
        )}
      </div>
    </section>
  );
}
