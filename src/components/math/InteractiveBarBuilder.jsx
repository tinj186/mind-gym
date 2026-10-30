import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, ArrowRight, Layers, Scale, RefreshCw, HelpCircle, Sparkles, ChevronDown, Eye } from 'lucide-react';
import MathInput from '@/components/math/MathInput';

/**
 * Miniature Preview Diagrams for each Bar Model Archetype
 */
function ComparisonPreview() {
  return (
    <div className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4">
      <div className="flex items-center justify-between text-xs font-black text-slate-500 uppercase tracking-wider">
        <span>Parallel Comparison Bars</span>
        <span className="text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
          Aligned Baseline
        </span>
      </div>

      <div className="space-y-3 max-w-lg mx-auto py-2">
        {/* Entity A */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-bold text-slate-600">
            <span>Entity A</span>
            <span className="text-slate-400 font-mono">Base Value</span>
          </div>
          <div className="h-9 bg-indigo-500 rounded-xl w-3/5 flex items-center justify-center text-white text-xs font-black shadow-sm">
            Base Quantity
          </div>
        </div>

        {/* Entity B */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-bold text-slate-600">
            <span>Entity B</span>
            <span className="text-emerald-600 font-bold font-mono">+ Difference</span>
          </div>
          <div className="flex items-center h-9 gap-1.5">
            <div className="h-full bg-indigo-500 rounded-xl w-3/5 flex items-center justify-center text-white text-xs font-black shadow-sm">
              Same as A
            </div>
            <div className="h-full bg-emerald-500 rounded-xl flex-1 flex items-center justify-center text-white text-xs font-black shadow-sm border border-emerald-400 border-dashed">
              + More
            </div>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-200 text-center">
        <p className="text-xs font-bold text-slate-600">
          Compares distinct quantities side-by-side using parallel bars aligned to a common baseline, highlighting differences.
        </p>
      </div>
    </div>
  );
}

function PartWholePreview() {
  return (
    <div className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4">
      <div className="flex items-center justify-between text-xs font-black text-slate-500 uppercase tracking-wider">
        <span>Single Partitioned Bar</span>
        <span className="text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
          Parts of a Whole
        </span>
      </div>

      <div className="space-y-3 max-w-lg mx-auto py-2">
        {/* Whole Bracket */}
        <div className="text-center">
          <span className="text-xs font-black text-slate-700 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-xs">
            Total / Whole
          </span>
          <div className="w-full h-2.5 border-x-2 border-t-2 border-slate-400 rounded-t-lg mt-1" />
        </div>

        {/* Single bar divided into parts */}
        <div className="flex h-10 w-full rounded-xl overflow-hidden border-2 border-slate-300 shadow-sm">
          <div className="w-2/5 bg-blue-500 flex items-center justify-center text-white text-xs font-black border-r-2 border-white">
            Part 1
          </div>
          <div className="w-3/5 bg-amber-500 flex items-center justify-center text-white text-xs font-black">
            Part 2
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-200 text-center">
        <p className="text-xs font-bold text-slate-600">
          Divides a single whole amount into two or more parts to find unknown parts or the combined total.
        </p>
      </div>
    </div>
  );
}

function BeforeAfterPreview() {
  return (
    <div className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4">
      <div className="flex items-center justify-between text-xs font-black text-slate-500 uppercase tracking-wider">
        <span>Two Time States</span>
        <span className="text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
          Transfer / Change
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto py-1">
        {/* BEFORE */}
        <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2 shadow-xs">
          <div className="text-[10px] font-black uppercase text-slate-400">1. Before State</div>
          <div className="space-y-1.5">
            <div className="h-6 bg-indigo-400 rounded-lg w-4/5 text-[10px] font-black text-white flex items-center px-2">A (Initial)</div>
            <div className="h-6 bg-slate-400 rounded-lg w-2/5 text-[10px] font-black text-white flex items-center px-2">B (Initial)</div>
          </div>
        </div>

        {/* AFTER */}
        <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2 shadow-xs">
          <div className="text-[10px] font-black uppercase text-emerald-600 flex items-center justify-between">
            <span>2. After Transfer</span>
            <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1.5 rounded font-black">Change</span>
          </div>
          <div className="space-y-1.5">
            <div className="h-6 bg-indigo-500 rounded-lg w-3/5 text-[10px] font-black text-white flex items-center px-2">A (New)</div>
            <div className="h-6 bg-slate-500 rounded-lg w-3/5 text-[10px] font-black text-white flex items-center px-2">B (New)</div>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-200 text-center">
        <p className="text-xs font-bold text-slate-600">
          Tracks internal transfers, giving/receiving, or state changes between entities across time.
        </p>
      </div>
    </div>
  );
}

function EmptyPreview() {
  return (
    <div className="w-full bg-slate-50/70 border-2 border-dashed border-slate-300 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-2">
      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
        <Eye className="w-5 h-5" />
      </div>
      <h5 className="text-sm font-black text-slate-700">Model Preview Window</h5>
      <p className="text-xs text-slate-400 max-w-xs font-medium">
        Select a bar model archetype from the dropdown above to preview how its structure works.
      </p>
    </div>
  );
}

/**
 * InteractiveBarBuilder
 * 
 * An interactive 3-stage bar model solver designed for structured problem sums.
 * Stage 1: Model Type Selection (Metacognition)
 * Stage 2: Model Inspection & Variable Assignment (Pictorial Blueprint)
 * Stage 3: Step-by-Step Equation Solving (Abstract Calculation)
 */
export default function InteractiveBarBuilder({ 
  config = {}, 
  steps = [], 
  onSubmit, 
  disabled = false, 
  level,
  initialStage = 1,
  isAdminReview = false
}) {
  const correctModelType = config.correctModelType || "COMPARISON";
  const [currentStage, setCurrentStage] = useState(initialStage);
  const [selectedModel, setSelectedModel] = useState(isAdminReview ? correctModelType : null);
  const [confirmationStatus, setConfirmationStatus] = useState('idle'); // 'idle' | 'correct' | 'incorrect'
  const [answers, setAnswers] = useState({});
  const [showModelMiniView, setShowModelMiniView] = useState(true);

  const modelOptions = config.modelOptions || [
    { id: "COMPARISON", label: "Comparison Model", description: "Compare quantities across distinct entities" },
    { id: "PART_WHOLE", label: "Part-Whole Model", description: "Divide a single whole quantity into parts" },
    { id: "BEFORE_AFTER", label: "Before & After Model", description: "Show transfers or changes across time states" }
  ];
  const entities = config.entities || [];
  const target = config.target || { type: "TOTAL", label: "Total" };
  const calculationSteps = steps.length > 0 ? steps : (config.steps || []);

  const handleSelectModel = (modelId) => {
    if (disabled) return;
    setSelectedModel(modelId || null);
    setConfirmationStatus('idle'); // User can freely consider options without immediate verification
  };

  const handleConfirmModel = () => {
    if (disabled || !selectedModel) return;
    if (confirmationStatus === 'correct') {
      handleProceedToStage2();
      return;
    }
    if (selectedModel === correctModelType) {
      setConfirmationStatus('correct');
    } else {
      setConfirmationStatus('incorrect');
    }
  };

  const handleProceedToStage2 = () => {
    if (selectedModel === correctModelType || isAdminReview) {
      setCurrentStage(2);
    }
  };

  const handleProceedToStage3 = () => {
    setCurrentStage(3);
  };

  const handleAnswerChange = (index, value) => {
    setAnswers(prev => ({ ...prev, [index]: value }));
  };

  const handleStepEnter = (e, index) => {
    if (index === calculationSteps.length - 1) {
      handleSubmitAll();
    } else {
      setTimeout(() => {
        const nextInput = document.getElementById(`builder-step-${index + 1}`);
        if (nextInput) nextInput.focus();
      }, 50);
    }
  };

  const handleSubmitAll = () => {
    if (onSubmit) {
      onSubmit(answers);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* 🧭 Stage Progress Header (Single-line) */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 bg-slate-900 text-white rounded-2xl shadow-md border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-sm shrink-0">
            {currentStage}
          </div>
          <div className="text-sm font-black tracking-tight">
            {currentStage === 1 && "Step 1: Choose the Bar Model Type"}
            {currentStage === 2 && "Step 2: Inspect & Verify the Bar Blueprint"}
            {currentStage === 3 && "Step 3: Calculate & Solve Equations"}
          </div>
        </div>

        {/* Stage Pills */}
        <div className="flex items-center gap-1.5">
          {[1, 2, 3].map((stageNum) => (
            <button
              key={stageNum}
              type="button"
              onClick={() => {
                if (isAdminReview || selectedModel === correctModelType) {
                  setCurrentStage(stageNum);
                }
              }}
              disabled={!isAdminReview && selectedModel !== correctModelType && stageNum > 1}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                currentStage === stageNum
                  ? 'bg-indigo-500 text-white shadow-md scale-105'
                  : isAdminReview || (selectedModel === correctModelType && currentStage > stageNum)
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer border border-slate-700'
                  : 'bg-slate-900/50 text-slate-600 cursor-not-allowed'
              }`}
            >
              {stageNum === 1 ? "1. Archetype" : stageNum === 2 ? "2. Blueprint" : "3. Equations"}
            </button>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          STAGE 1: MODEL TYPE SELECTION (SIMPLIFIED WITH DROPDOWN & PREVIEW)
         ══════════════════════════════════════════════════════════════════════ */}
      {currentStage === 1 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="space-y-4"
        >
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
            
            {/* Dropdown Selector */}
            <div className="space-y-2">
              <label htmlFor="bar-model-select" className="block text-sm font-black text-slate-800">
                Select the type of Bar Model to use:
              </label>
              <div className="relative max-w-xl">
                <select
                  id="bar-model-select"
                  disabled={disabled}
                  value={selectedModel || ""}
                  onChange={(e) => handleSelectModel(e.target.value)}
                  className="w-full appearance-none bg-slate-50 border-2 border-slate-300 hover:border-indigo-500 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100 rounded-2xl px-4 py-3 text-base font-bold text-slate-900 transition-all cursor-pointer shadow-xs pr-10"
                >
                  <option value="" disabled>-- Choose a Bar Model archetype --</option>
                  {modelOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label} ({opt.id === 'COMPARISON' ? 'Compare distinct entities' : opt.id === 'PART_WHOLE' ? 'Divide a total into parts' : 'Track transfers / change over time'})
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                  <ChevronDown className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Dedicated Model Preview Window (Clean header without redundant label) */}
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-indigo-500" />
                  Model Preview Window
                </span>
              </div>

              {selectedModel === 'COMPARISON' && <ComparisonPreview />}
              {selectedModel === 'PART_WHOLE' && <PartWholePreview />}
              {selectedModel === 'BEFORE_AFTER' && <BeforeAfterPreview />}
              {!selectedModel && <EmptyPreview />}
            </div>

            {/* Bottom Confirmation Bar */}
            <div className="pt-2">
              {!selectedModel ? (
                <button
                  type="button"
                  disabled
                  className="w-full py-3.5 px-6 rounded-2xl font-black text-xs uppercase tracking-wider bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Select a Bar Model to Confirm
                </button>
              ) : confirmationStatus === 'correct' ? (
                <motion.button
                  type="button"
                  initial={{ scale: 0.99 }}
                  animate={{ scale: 1 }}
                  onClick={handleProceedToStage2}
                  className="w-full py-3.5 px-6 rounded-2xl font-black text-xs uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer transition-all active:scale-[0.99] shadow-md ring-4 ring-emerald-100 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Confirm & Build Blueprint
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              ) : confirmationStatus === 'incorrect' ? (
                <motion.button
                  type="button"
                  initial={{ x: -4 }}
                  animate={{ x: [-4, 4, -4, 4, 0] }}
                  transition={{ duration: 0.3 }}
                  onClick={handleConfirmModel}
                  className="w-full py-3.5 px-6 rounded-2xl font-black text-xs uppercase tracking-wider bg-rose-500 hover:bg-rose-600 text-white cursor-pointer transition-all active:scale-[0.99] shadow-sm flex items-center justify-center gap-2"
                >
                  <AlertCircle className="w-4 h-4" />
                  Incorrect Model — Try Another Type
                </motion.button>
              ) : (
                <button
                  type="button"
                  disabled={disabled}
                  onClick={handleConfirmModel}
                  className="w-full py-3.5 px-6 rounded-2xl font-black text-xs uppercase tracking-wider bg-slate-900 hover:bg-slate-800 text-white cursor-pointer transition-all active:scale-[0.99] shadow-sm flex items-center justify-center gap-2"
                >
                  Confirm Model Selection
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>
        </motion.div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          STAGE 2: VISUAL BLUEPRINT & VARIABLE VERIFICATION
         ══════════════════════════════════════════════════════════════════════ */}
      {currentStage === 2 && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="space-y-6"
        >
          <div className="bg-slate-900 text-white p-6 rounded-3xl flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Blueprint Verified</span>
              <h4 className="text-xl font-black">Comparative Bar Model Construction</h4>
              <p className="text-xs text-slate-300 font-semibold mt-1">
                Notice how the differences align relative to each entity's baseline bar.
              </p>
            </div>
            <span className="px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-black">
              Comparison Model
            </span>
          </div>

          {/* The Visual Bar Model Canvas */}
          <div className="p-8 bg-slate-50 border-4 border-slate-200 rounded-[2.5rem] shadow-inner space-y-8">
            <div className="space-y-6 max-w-2xl mx-auto">
              {entities.map((entity, idx) => {
                const isBase = entity.relation === 'BASE';
                const isMore = entity.relation === 'MORE';
                const isFewer = entity.relation === 'FEWER';
                const isTargetEntity = target.type === 'BAR' && target.targetEntity === entity.id;

                return (
                  <div key={entity.id} className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-black uppercase text-slate-600 tracking-wider">
                      <span>{entity.name}</span>
                      {entity.displayValue && (
                        <span className="text-slate-500 font-bold">{entity.displayValue} {config.itemName}</span>
                      )}
                    </div>

                    <div className="relative flex items-center gap-3">
                      {/* Bar Row */}
                      <div className="flex-1 flex items-center h-12 bg-white rounded-2xl border-2 border-slate-300 p-1 shadow-sm overflow-hidden">
                        {/* Base Segment */}
                        <div 
                          className={`h-full rounded-xl flex items-center justify-center text-xs font-black text-white shadow-sm transition-all ${
                            idx === 0 ? 'bg-indigo-600 w-3/5' : idx === 1 ? 'bg-indigo-500 w-3/5' : 'bg-indigo-400 w-3/5'
                          }`}
                        >
                          {isBase && entity.displayValue}
                        </div>

                        {/* Extended or Reduced Difference Segment */}
                        {isMore && (
                          <div className="h-full bg-emerald-500 rounded-xl ml-1 px-3 flex items-center justify-center text-xs font-black text-white shadow-sm border border-emerald-400 animate-in fade-in">
                            {entity.displayDiff || `+${entity.diffValue}`}
                          </div>
                        )}

                        {isFewer && (
                          <div className="h-full bg-rose-500 rounded-xl ml-1 px-3 flex items-center justify-center text-xs font-black text-white shadow-sm border border-rose-400 animate-in fade-in">
                            {entity.displayDiff || `-${entity.diffValue}`}
                          </div>
                        )}

                        {/* Target Marker Pill if Target is this bar */}
                        {isTargetEntity && (
                          <div className="ml-auto mr-2 px-3 py-1 rounded-lg bg-amber-400 text-slate-900 font-black text-xs flex items-center gap-1 shadow-md animate-bounce">
                            <span>?</span>
                            <span className="hidden sm:inline">Target</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Total Bracket if Finding Total */}
              {target.type === 'TOTAL' && (
                <div className="mt-8 pt-6 border-t-2 border-dashed border-slate-300 flex items-center justify-between bg-amber-50/80 p-4 rounded-2xl border-amber-300">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-600" />
                    <span className="text-sm font-black text-amber-950 uppercase tracking-wider">
                      Grand Total Across All 3
                    </span>
                  </div>
                  <div className="px-4 py-2 bg-amber-400 text-slate-900 font-black rounded-xl text-lg shadow-md animate-pulse">
                    ? {config.itemName}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={handleProceedToStage3}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-base flex items-center gap-3 transition-all active:scale-95 shadow-lg"
              >
                Model Understood! Solve Equations
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          STAGE 3: STEP-BY-STEP CALCULATION WORKSPACE
         ══════════════════════════════════════════════════════════════════════ */}
      {currentStage === 3 && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="space-y-6"
        >
          {/* Mini-Model Drawer / Collapsible Reference */}
          <div className="bg-slate-100 rounded-3xl border-2 border-slate-200 overflow-hidden">
            <button
              type="button"
              onClick={() => setShowModelMiniView(prev => !prev)}
              className="w-full p-4 flex items-center justify-between text-left text-xs font-black uppercase text-slate-700 tracking-wider hover:bg-slate-200 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-indigo-600" />
                <span>Model Reference Diagram</span>
              </div>
              <span>{showModelMiniView ? "Hide ▲" : "Show ▼"}</span>
            </button>

            {showModelMiniView && (
              <div className="p-6 pt-2 bg-white border-t border-slate-200 space-y-3">
                {entities.map(e => (
                  <div key={e.id} className="flex items-center gap-3 text-xs font-bold text-slate-600">
                    <span className="w-24 text-right font-black text-slate-800">{e.name}:</span>
                    <div className="h-6 flex-1 bg-slate-100 rounded-lg flex items-center px-2 gap-2 border border-slate-200">
                      <span className="text-indigo-600 font-black">{e.displayValue || "Base"}</span>
                      {e.displayDiff && (
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-black ${
                          e.relation === 'MORE' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                        }`}>
                          {e.displayDiff}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {target.type === 'TOTAL' && (
                  <div className="text-right text-xs font-black text-amber-700 pt-1">
                    🎯 Target: Total of all 3 entities (?)
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sequential Step Inputs */}
          <div className="space-y-4">
            {calculationSteps.map((step, idx) => (
              <div 
                key={idx} 
                className="bg-white p-6 rounded-3xl border-4 border-slate-100 shadow-sm space-y-3"
              >
                <label className="block text-sm font-black text-slate-700 uppercase tracking-wider">
                  {step.label}
                </label>
                <div className="w-full">
                  <MathInput
                    id={`builder-step-${idx}`}
                    value={answers[idx] || ''}
                    onChange={(val) => handleAnswerChange(idx, val)}
                    onEnter={(e) => handleStepEnter(e, idx)}
                    disabled={disabled}
                    autoFocus={idx === 0}
                    level={level}
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              disabled={disabled}
              onClick={handleSubmitAll}
              className="w-full py-6 mt-6 bg-blue-600 hover:bg-blue-700 text-white rounded-3xl font-black text-xl transition-all active:scale-95 shadow-xl disabled:opacity-50"
            >
              SUBMIT FINAL SOLUTION
            </button>
          </div>
        </motion.div>
      )}

    </div>
  );
}
