"use client";

import React, { useState } from 'react';

export default function AssessmentReadinessMap({ masteryData = [], examData = [] }) {
  const [expandedTopic, setExpandedTopic] = useState(null);

  // Group mastery by topic to calculate average conceptual mastery per topic
  const topicMastery = masteryData.reduce((acc, m) => {
    if (!acc[m.topic]) acc[m.topic] = { total: 0, count: 0 };
    acc[m.topic].total += m.synapseStrength;
    acc[m.topic].count += 1;
    return acc;
  }, {});

  // Combine with exam data
  const boardData = examData.map(exam => {
    const conceptualMastery = topicMastery[exam.topic] 
      ? Math.round(topicMastery[exam.topic].total / topicMastery[exam.topic].count) 
      : 0;
    
    const gap = conceptualMastery - exam.accuracy;
    const executionRisk = gap > 20;

    return {
      ...exam,
      conceptualMastery,
      gap,
      executionRisk
    };
  });

  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-black tracking-tight flex items-center gap-3 text-indigo-950 uppercase">
          <span className="w-8 h-8 bg-indigo-100 text-indigo-900 flex items-center justify-center rounded-lg text-sm">03</span>
          Assessment Audit Board
        </h2>
        <p className="text-sm font-bold uppercase text-indigo-900/60 tracking-widest pl-11">
          Mechanical Mastery vs. Timed Exam Performance
        </p>
      </div>
      
      <div className="space-y-6 pl-11">
        {boardData.map((item, index) => (
          <div key={`${item.topicId || item.topic}-${index}`} className="bg-white border border-indigo-100 rounded-[2.5rem] shadow-sm overflow-hidden transition-all hover:shadow-md hover:-translate-y-1">
            {/* Header / Summary Row */}
            <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
              
              {/* Topic Info */}
              <div className="flex-1">
                <h3 className="font-black text-indigo-950 text-2xl uppercase leading-tight mb-2">{item.topic}</h3>
                {item.executionRisk && (
                  <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-600 font-black text-[10px] uppercase tracking-widest px-3 py-1 border border-rose-200 rounded-full">
                    ⚠️ Execution Risk
                  </span>
                )}
              </div>

              {/* Metrics Grid */}
              <div className="flex gap-4 items-center">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black tracking-widest text-indigo-900/40 uppercase">Conceptual Mastery</span>
                  <span className="text-3xl font-black tabular-nums text-indigo-950">{item.conceptualMastery}%</span>
                </div>
                <div className="w-8 h-px bg-indigo-100 rotate-90 md:rotate-0"></div>
                <div className="flex flex-col items-start">
                  <span className="text-[10px] font-black tracking-widest text-indigo-500 uppercase">Exam Performance</span>
                  <span className={`text-3xl font-black tabular-nums ${item.executionRisk ? 'text-rose-500' : 'text-indigo-600'}`}>
                    {item.accuracy}%
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="w-full md:w-auto">
                <button 
                  onClick={() => setExpandedTopic(expandedTopic === item.topicId ? null : item.topicId)}
                  className="w-full px-6 py-3 bg-indigo-50 text-indigo-600 font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-indigo-100 transition-colors"
                >
                  {expandedTopic === item.topicId ? 'Close Breakdown' : 'View Breakdown'}
                </button>
              </div>
            </div>

            {/* Expanded Detail View */}
            {expandedTopic === item.topicId && (
              <div className="border-t border-indigo-50 bg-indigo-50/30 p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* Speed Analysis */}
                <div className="space-y-3">
                  <h4 className="font-black text-sm uppercase tracking-widest text-indigo-900/60 flex items-center gap-2">
                    ⏱️ Speed Analysis
                  </h4>
                  <div className="bg-white p-4 border border-indigo-100 rounded-xl">
                    <p className="text-[10px] font-bold text-indigo-900/40 uppercase mb-1">Slowest Mechanic</p>
                    <p className="font-black text-indigo-950 uppercase">{item.speedAnalysis?.slowestMechanic || 'N/A'}</p>
                    <p className="text-xs font-bold text-rose-500 mt-2">Avg: {item.speedAnalysis?.avgTime || 0}s per Q</p>
                  </div>
                </div>

                {/* Error Patterns */}
                <div className="space-y-3">
                  <h4 className="font-black text-sm uppercase tracking-widest text-indigo-900/60 flex items-center gap-2">
                    🔍 Error Patterns
                  </h4>
                  <div className="bg-white p-4 border border-indigo-100 rounded-xl h-full">
                    {item.errorPatterns?.length > 0 ? (
                      <ul className="space-y-2">
                        {item.errorPatterns.map((err, i) => (
                          <li key={i} className="text-xs font-black text-rose-500 uppercase flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-rose-400 rounded-full"></span>
                            {err}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs font-bold text-indigo-900/40 uppercase">No distinct patterns</p>
                    )}
                  </div>
                </div>

                {/* Sectional Performance */}
                <div className="space-y-3">
                  <h4 className="font-black text-sm uppercase tracking-widest text-indigo-900/60 flex items-center gap-2">
                    📊 Sectional Breakdown
                  </h4>
                  <div className="bg-white p-4 border border-indigo-100 rounded-xl space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-indigo-900/50 uppercase">MCQ</span>
                      <span className="font-black tabular-nums text-indigo-950">{item.sectionBreakdown?.mcq || 0}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-indigo-900/50 uppercase">Short Answer</span>
                      <span className="font-black tabular-nums text-indigo-950">{item.sectionBreakdown?.short || 0}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-indigo-900/50 uppercase">Structured</span>
                      <span className="font-black tabular-nums text-indigo-950">{item.sectionBreakdown?.structured || 0}%</span>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>
        ))}
        {boardData.length === 0 && (
          <div className="p-12 border border-dashed border-indigo-200 rounded-[2.5rem] text-center text-indigo-900/40 font-bold uppercase tracking-widest">
            No Exam Data Available
          </div>
        )}
      </div>
    </section>
  );
}
