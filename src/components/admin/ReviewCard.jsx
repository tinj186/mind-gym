'use client';

import React from 'react';
import VisualRenderer from '@/components/math/VisualRenderer';
import { toggleArchiveQuestionAction } from '@/app/actions/workoutActions';
import { normalizeQuestionData, deriveVisualProps } from '@/lib/intelligence/workout-utils';

// Helper to map technical modelData keys to pedagogical labels
const MAP_KEY = (key) => {
  const mapping = {
    whole: "Total Amount",
    parts: "Segments",
    part1: "First Part",
    part2: "Second Part",
    tens: "Tens Count",
    ones: "Ones Count",
    hundreds: "Hundreds Count",
    icon: "Primary Icon",
    icons: "Emoji Set",
    groups: "Logical Grouping",
    itemsPerGroup: "Quantity per Group",
    crossOut: "Subtracted Items",
    sequence: "Number Chain",
    rule: "Pattern Logic",
    numbers: "Card Values",
    sets: "Comparison Sets",
    items: "Queue Items",
  };
  return mapping[key] || key.charAt(0).toUpperCase() + key.slice(1);
};

export default function ReviewCard({ 
  q, 
  processingId, 
  isViewOnly, 
  handleApprove, 
  handleDelete, 
  handleRegenerate, 
  mutate, 
  setActiveTool 
}) {
  // Normalize question data once to get consistent visualEngine and modelData
  const normalizedQuestion = normalizeQuestionData(q);
  const visualProps = deriveVisualProps(normalizedQuestion);
  const visualType = normalizedQuestion.visualEngine?.componentToRender; // Raw type from normalized question

  // Define visual categories
  const isQuestionVisual = !!visualType && visualType !== 'NONE' && !normalizedQuestion.modelData?.hideVisual;
  const isBusy = processingId === q.id || processingId === 'bulk';
  const isArchived = q.isArchived === true;

  return (
    <div className={`p-6 rounded-3xl border-2 transition-all duration-300 relative ${
      isArchived
        ? 'bg-slate-100/70 border-slate-200/80 text-slate-400 opacity-60 shadow-none filter grayscale'
        : 'bg-white border-slate-100 shadow-sm hover:shadow-md'
    } ${isBusy ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="p-8 space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">The Question</span>
              <p className="text-xl font-bold text-slate-900 leading-tight">{q.question}</p>
            </div>
            {visualType && (
              <div className="px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-lg shrink-0">
                <span className="text-[9px] font-black text-indigo-600 uppercase tracking-tighter">
                  {visualType.replace('_', ' ')}
                </span>
              </div>
            )}
          </div>
          
          {/* Question-level Visuals (Concrete) */}
          {isQuestionVisual && (
            <div className="pt-4">
              <div className="p-6 bg-slate-50 border-2 border-slate-200 rounded-2xl flex justify-center items-center">
                <VisualRenderer
                  type={normalizedQuestion.visualEngine?.componentToRender}
                  data={normalizedQuestion.visualEngine?.componentData}
                  modelData={normalizedQuestion.modelData}
                  visualProps={visualProps}
                  attempts={0}
                  setIsToolOpen={() => setActiveTool({
                    modelData: normalizedQuestion.modelData,
                    id: normalizedQuestion.id,
                    difficulty: normalizedQuestion.difficulty,
                    topic: normalizedQuestion.topic,
                    visualProps
                  })}
                  questionId={normalizedQuestion.id}
                  difficulty={normalizedQuestion.difficulty}
                  topic={normalizedQuestion.topic}
                  hideCardStyles={true}
                />
              </div>
            </div>
          )}

          {/* Metadata Grid */}
          {normalizedQuestion.modelData && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-slate-50">
              {Object.entries(normalizedQuestion.modelData).filter(([k]) => {
                const isNumericIndex = !isNaN(k) && !isNaN(parseFloat(k));
                return !isNumericIndex && !['type', 'items', 'groups', 'visualitems', 'hidevisual', 'modelvisualizer', 'modeldrawing'].includes(k.toLowerCase());
              }).map(([key, val]) => (
                <div key={key} className="p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    {MAP_KEY(key)}
                  </p>
                  {key === 'inputRequirement' && typeof val === 'object' && val?.inputType === 'MULTI_STEP_INPUT' && val?.steps ? (
                    <div className="text-xs font-bold text-slate-700 space-y-1 mt-2">
                      <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-[10px] uppercase">Multi-Step</span>
                      {val.steps.map((step, idx) => (
                        <div key={idx} className="flex justify-between border-b border-slate-200 border-dashed pb-1">
                          <span className="text-slate-500">{step.label}</span>
                          <span className="text-blue-600 font-mono">{step.expectedAnswer}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs font-bold text-slate-700 truncate">
                      {typeof val === 'object' && val !== null && !Array.isArray(val) ? JSON.stringify(val) : Array.isArray(val) ? val.join(', ') : String(val)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Performance Stats Panel */}
          {q.stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t border-slate-50">
              <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex flex-col gap-1 md:col-span-1">
                <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">Logic Variant</span>
                <span className="text-sm font-bold text-slate-700 leading-snug">
                  {q.stats?.variantDescription || (q.heuristic && q.heuristic !== q.topic && q.heuristic !== q.subtopic ? q.heuristic.replace(/_/g, ' ') : 'Standard Logic')}
                </span>
              </div>
              <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100 flex flex-col gap-1">
                <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Global Attempts</span>
                <span className="text-sm font-black text-slate-800">{q.stats.attemptsCount} Reps</span>
              </div>
              <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 flex flex-col gap-1">
                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Success Rate</span>
                <span className="text-sm font-black text-slate-800">{q.stats.successRate}% First-Try</span>
              </div>
            </div>
          )}
        </div>

        {q.type === 'MCQ' && q.options && Array.isArray(q.options) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {q.options.map((opt, i) => {
              const optStr = String(opt ?? "");
              const extractValue = (s) => {
                const str = String(s ?? "").trim();
                if (/^\d{1,2}:\d{2}/.test(str)) return str;
                return str.includes(':') ? str.split(':').slice(1).join(':').trim() : str;
              };

              const cleanOpt = extractValue(optStr);
              const cleanFinal = extractValue(q.finalAnswer);
              const isCorrect = cleanOpt !== '' && cleanOpt === cleanFinal;

              return (
                <div 
                  key={i} 
                  className={`p-4 rounded-2xl border text-sm font-bold transition-all ${
                    isCorrect 
                      ? 'bg-green-50 border-green-200 text-green-700 shadow-sm' 
                      : 'bg-slate-50 border-slate-100 text-slate-600'
                  }`}
                >
                  {opt}
                </div>
              );
            })}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-50">
          <div className="space-y-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Model Solution</span>
            <p className="text-sm text-slate-600 leading-relaxed italic whitespace-pre-line">{q.solution}</p>
            
            {q.hint && (
              <div className="mt-4 p-4 bg-amber-50 border-2 border-amber-100 rounded-2xl animate-in fade-in slide-in-from-bottom-2">
                <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1 flex items-center gap-1">
                  <span>💡</span> Pedagogical Scaffolding (Hint)
                </p>
                <p className="text-xs text-amber-900 font-bold italic leading-relaxed">{q.hint}</p>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Final Answer</span>
            {q.type === 'Structured' ? (
              <div className="space-y-3">
                {(() => {
                  try {
                    const data = typeof q.finalAnswer === 'string' ? JSON.parse(q.finalAnswer) : q.finalAnswer;
                    const eqParts = data.equation.split(/[\+\-=]/).map(p => p.trim());
                    const op = data.equation.includes('+') ? '+' : '-';
                    return (
                      <>
                        <div className="p-4 bg-green-50 border-2 border-green-100 rounded-2xl flex items-center justify-center gap-2 font-black text-green-800">
                          <div className="w-12 h-10 flex items-center justify-center bg-white border-2 border-green-200 rounded-xl">{eqParts[0]}</div>
                          <div className="w-10 h-10 flex items-center justify-center bg-white border-2 border-green-200 rounded-xl text-lg">{op}</div>
                          <div className="w-12 h-10 flex items-center justify-center bg-white border-2 border-green-200 rounded-xl">{eqParts[1]}</div>
                          <span>=</span>
                          <div className="w-16 h-10 flex items-center justify-center bg-white border-2 border-green-400 rounded-xl shadow-sm">{data.value}</div>
                        </div>
                        <div className="p-4 bg-green-50 border-2 border-green-100 rounded-2xl text-left italic font-bold text-green-900">
                          Answer: {data.statement}
                        </div>
                      </>
                    );
                  } catch (e) {
                    return <div className="p-4 bg-green-50 border-2 border-green-100 rounded-2xl text-center text-3xl font-black text-green-700">{q.finalAnswer}</div>;
                  }
                })()}
              </div>
            ) : (
              <div className="p-4 bg-green-50 border-2 border-green-100 rounded-2xl text-center">
                <div className="text-3xl font-black text-green-700">{q.finalAnswer}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-slate-50 px-8 py-4 flex justify-between items-center border-t border-slate-100">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">ID: {q.id}</span>
        <div className="flex gap-3">
          <button 
            onClick={async () => {
              const actionLabel = isArchived ? 'unarchive' : 'archive';
              if (confirm(`Are you sure you want to ${actionLabel} this question?`)) {
                const res = await toggleArchiveQuestionAction(q.id, q.isArchived);
                if (res.success) {
                  mutate(); 
                } else {
                  alert("Failed to update question status: " + res.error);
                }
              }
            }}
            className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all border-2 ${
              isArchived
                ? 'bg-slate-200 text-slate-600 border-slate-300 hover:bg-slate-300'
                : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
            }`}
          >
            {isArchived ? '📁 Unarchive' : '📦 Archive'}
          </button>
          <button 
            onClick={() => handleDelete(q.id)}
            className="px-4 py-2 text-[10px] font-black uppercase text-red-500 hover:bg-red-50 rounded-xl transition-colors"
          >
            Delete
          </button>
          <a 
            href={`/math?previewId=${q.id}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl text-[10px] font-black uppercase transition-all inline-flex items-center gap-1"
          >
            👁️ Test Visual Canvas
          </a>
          <button 
            onClick={() => handleRegenerate(q)}
            className="px-4 py-2 text-[10px] font-black uppercase text-amber-600 hover:bg-amber-50 rounded-xl transition-colors"
          >
            Regenerate
          </button>
          {!isViewOnly && (
            <button 
              onClick={() => handleApprove(q.id)}
              className="px-6 py-2 bg-slate-900 text-white text-[10px] font-black uppercase rounded-xl hover:bg-green-600 transition-all shadow-lg active:scale-95"
            >
              Approve Question
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
