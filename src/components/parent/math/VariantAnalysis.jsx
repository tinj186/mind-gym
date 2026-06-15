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
  // Group mastery data by Topic
  const topicsMap = data.reduce((acc, curr) => {
    const tId = curr.topicId || curr.topic;
    if (!acc[tId]) {
      acc[tId] = {
        id: tId,
        name: curr.topic,
        subtopics: [],
        totalReps: 0,
        totalStrength: 0,
        validSubtopicCount: 0,
        defectLog: curr.defectLog || {} // Grab the first defectLog
      };
    }
    acc[tId].subtopics.push(curr);
    acc[tId].totalReps += curr.totalReps;
    if ((curr.synapseStrength || 0) > 0) {
      acc[tId].totalStrength += curr.synapseStrength;
      acc[tId].validSubtopicCount += 1;
    }
    // Also try to grab defect log if the first one was empty but a subsequent one has it
    if (curr.defectLog && curr.defectLog.topicDiagnostic && !acc[tId].defectLog.topicDiagnostic) {
      acc[tId].defectLog = curr.defectLog;
    }
    return acc;
  }, {});

  const topicArray = Object.values(topicsMap).map(t => ({
    ...t,
    averageStrength: t.validSubtopicCount > 0 ? Math.round(t.totalStrength / t.validSubtopicCount) : 0
  }));

  // Isolate topic bottlenecks (average strength < 50%)
  const topicBottlenecks = topicArray.filter(t => t.averageStrength < 50 && t.averageStrength > 0);

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
        <h2 className="text-2xl font-black tracking-tight flex items-center gap-3 text-indigo-950 uppercase">
          <span className="w-8 h-8 bg-indigo-100 text-indigo-900 flex items-center justify-center rounded-lg text-sm">02</span>
          Diagnostic Deep-Dive
        </h2>
        <p className="text-sm font-bold uppercase text-indigo-900/60 tracking-widest pl-11">
          Identifying cross-mechanic conceptual gaps within root topics
        </p>
      </div>
      
      <div className="space-y-4 pl-11">
        {topicBottlenecks.map(topic => {
          const rawId = topic.id;
          const friendlyName = topic.name || formatVariantName(rawId);
          const isQueued = queuedVariants.has(rawId);
          const aiDiagnostic = topic.defectLog?.topicDiagnostic || "Gathering sufficient error data across this topic to generate deep diagnostic...";
          
          return (
            <div key={topic.id} className="p-6 bg-white border border-rose-100 rounded-[2.5rem] flex flex-col md:flex-row gap-6 items-start md:items-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
              <div className="w-16 h-16 bg-rose-50 border border-rose-200 text-rose-500 flex items-center justify-center rounded-[1.5rem] flex-shrink-0 text-3xl">
                ⚠️
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-900/40 mb-1 block">Topic Signature</span>
                <h3 className="font-black text-indigo-950 text-xl uppercase leading-tight">{friendlyName}</h3>
                <p className="text-sm font-medium text-rose-700 mt-2">
                  <span className="text-rose-400 font-bold uppercase tracking-widest text-[10px] mr-2 block mb-1">Deep Diagnostics:</span> 
                  {aiDiagnostic}
                </p>
              </div>
              
              <div className="flex flex-col gap-3 min-w-[200px]">
                <div className="px-6 py-3 bg-white border border-rose-100 rounded-2xl text-rose-600 font-black text-lg tabular-nums flex justify-between items-center h-full">
                  <span className="text-[10px] text-rose-400 tracking-widest uppercase">TOPIC MASTERY</span>
                  {topic.averageStrength}%
                </div>
              </div>
            </div>
          );
        })}
        {topicBottlenecks.length === 0 && (
          <div className="p-12 border border-indigo-100 bg-white rounded-[2.5rem] text-center shadow-sm">
            <span className="text-5xl block mb-4">🏆</span>
            <h3 className="text-xl font-black text-indigo-950 uppercase tracking-tight">No Critical Bottlenecks</h3>
            <p className="text-indigo-900/60 font-medium">All trained variants are exceeding the minimum viability threshold.</p>
          </div>
        )}
      </div>
    </section>
  );
}
