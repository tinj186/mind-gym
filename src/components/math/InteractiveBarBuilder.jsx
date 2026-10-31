import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, ArrowRight, Layers, Scale, RefreshCw, HelpCircle, Sparkles, ChevronDown, ChevronUp, Eye, Plus, Trash2, Zap, RotateCcw } from 'lucide-react';
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

  // Stage 2: Interactive Bar Builder State
  const [userBars, setUserBars] = useState([]);
  const [stage2Status, setStage2Status] = useState('idle'); // 'idle' | 'correct' | 'incorrect'
  const [stage2ErrorMsg, setStage2ErrorMsg] = useState(null);

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

  // Stage 2 Bar Construction Handlers
  const handleAddBar = () => {
    if (disabled) return;
    const newBar = {
      id: `bar-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: "",
      length: 50,
      value: "",
      hasDifference: false,
      diffType: 'MORE',
      diffLength: 20,
      diffValue: "",
      bracketPosition: 'bottom',
      isTarget: false,
      isCollapsed: false
    };
    setUserBars(prev => [...prev, newBar]);
    setStage2Status('idle');
    setStage2ErrorMsg(null);
  };

  const handleToggleCollapseBar = (id) => {
    setUserBars(prev => prev.map(bar => {
      if (bar.id !== id) return bar;
      return { ...bar, isCollapsed: !bar.isCollapsed };
    }));
  };

  const handleToggleCollapseAll = () => {
    const anyExpanded = userBars.some(b => !b.isCollapsed);
    setUserBars(prev => prev.map(b => ({ ...b, isCollapsed: anyExpanded })));
  };

  const handleUpdateBar = (id, field, val) => {
    setUserBars(prev => prev.map(bar => {
      if (bar.id !== id) return bar;
      let finalVal = val;
      if (field === 'diffValue' && bar.diffType === 'FEWER') {
        finalVal = val.replace(/[+\-]/g, '');
      }
      if (field === 'diffType' && val === 'FEWER' && bar.diffValue) {
        return { ...bar, diffType: val, diffValue: bar.diffValue.replace(/[+\-]/g, '').trim(), bracketPosition: bar.bracketPosition || 'bottom' };
      }
      return { ...bar, [field]: finalVal };
    }));
    setStage2Status('idle');
    setStage2ErrorMsg(null);
  };

  const handleDeleteBar = (id) => {
    setUserBars(prev => prev.filter(bar => bar.id !== id));
    setStage2Status('idle');
    setStage2ErrorMsg(null);
  };

  const handleToggleDifference = (id) => {
    setUserBars(prev => prev.map(bar => {
      if (bar.id !== id) return bar;
      const willHave = !bar.hasDifference;
      return { 
        ...bar, 
        hasDifference: willHave,
        diffType: bar.diffType || 'MORE',
        diffLength: bar.diffLength || 20,
        diffValue: willHave ? (bar.diffValue ? bar.diffValue.replace(/[+\-]/g, '').trim() : '') : '',
        bracketPosition: bar.bracketPosition || 'bottom'
      };
    }));
    setStage2Status('idle');
    setStage2ErrorMsg(null);
  };

  const handleAutoFillBars = () => {
    if (!entities || entities.length === 0) {
      setUserBars([
        { id: 'bar-1', name: 'Entity A', length: 50, value: '10,000', hasDifference: false, diffType: 'MORE', diffLength: 20, diffValue: '', isTarget: false, isCollapsed: true },
        { id: 'bar-2', name: 'Entity B', length: 50, value: 'Same as A', hasDifference: true, diffType: 'MORE', diffLength: 20, diffValue: '5,000', isTarget: false, isCollapsed: true },
        { id: 'bar-3', name: 'Entity C', length: 50, value: 'Same as B', hasDifference: true, diffType: 'FEWER', diffLength: 20, diffValue: '5,000', bracketPosition: 'bottom', isTarget: true, isCollapsed: true }
      ]);
      setStage2Status('idle');
      return;
    }
    const filled = entities.map((e, idx) => {
      const rawDiff = e.displayDiff || e.diffValue || '';
      const cleanDiff = `${rawDiff}`.replace(/[+\-]/g, '').trim();
      return {
        id: `bar-${idx + 1}`,
        name: e.name,
        length: 50,
        value: e.relation === 'BASE' ? (e.displayValue || `${e.value}`) : 'Same as base',
        hasDifference: e.relation === 'MORE' || e.relation === 'FEWER',
        diffType: e.relation === 'FEWER' ? 'FEWER' : 'MORE',
        diffLength: 20,
        diffValue: cleanDiff,
        bracketPosition: 'bottom',
        isTarget: target?.type === 'BAR' && target?.targetEntity === e.id,
        isCollapsed: true // Default to tightly collapsed bar model view
      };
    });
    setUserBars(filled);
    setStage2Status('idle');
    setStage2ErrorMsg(null);
  };

  const handleClearBars = () => {
    setUserBars([]);
    setStage2Status('idle');
    setStage2ErrorMsg(null);
  };

  const handleVerifyStage2 = () => {
    if (disabled) return;
    if (stage2Status === 'correct') {
      handleProceedToStage3();
      return;
    }

    if (userBars.length === 0) {
      setStage2Status('incorrect');
      setStage2ErrorMsg("Click '+ Build Bar' to add your first entity bar!");
      return;
    }

    const missingName = userBars.some(b => !b.name || !b.name.trim());
    if (missingName) {
      setStage2Status('incorrect');
      setStage2ErrorMsg("Please enter a name label for all your bars.");
      return;
    }

    const expectedCount = entities.length > 0 ? entities.length : 2;
    if (userBars.length < expectedCount && !isAdminReview) {
      setStage2Status('incorrect');
      setStage2ErrorMsg(`Word problem has ${expectedCount} entities. Build all ${expectedCount} bars to complete the model!`);
      return;
    }

    setStage2Status('correct');
    setStage2ErrorMsg(null);
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
            {currentStage === 2 && "Step 2: Build the Bar Model Blueprint"}
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
          STAGE 2: BAR-BY-BAR MODEL BUILDER (INTERACTIVE)
         ══════════════════════════════════════════════════════════════════════ */}
      {currentStage === 2 && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="space-y-4"
        >
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
            
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  Comparative Bar Model Canvas
                </span>
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                  Aligned Baseline
                </span>
              </div>

              <div className="flex items-center gap-2">
                {userBars.length > 0 && (
                  <button
                    type="button"
                    onClick={handleToggleCollapseAll}
                    className="px-2.5 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 transition-all flex items-center gap-1 cursor-pointer"
                    title={userBars.some(b => !b.isCollapsed) ? "Collapse all parameters to show only bar models" : "Expand all parameters"}
                  >
                    {userBars.some(b => !b.isCollapsed) ? (
                      <>
                        <ChevronUp className="w-3.5 h-3.5" />
                        <span>Collapse All</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3.5 h-3.5" />
                        <span>Expand All</span>
                      </>
                    )}
                  </button>
                )}

                {isAdminReview && (
                  <>
                    <button
                      type="button"
                      onClick={handleAutoFillBars}
                      className="px-2.5 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl border border-indigo-200 transition-all flex items-center gap-1 cursor-pointer"
                      title="Auto-fill bars with problem data for rapid review"
                    >
                      <Zap className="w-3.5 h-3.5 text-indigo-600" />
                      Auto-Fill
                    </button>
                    {userBars.length > 0 && (
                      <button
                        type="button"
                        onClick={handleClearBars}
                        className="px-2.5 py-1.5 text-xs font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-slate-200 transition-all flex items-center gap-1 cursor-pointer"
                        title="Clear all bars"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Clear
                      </button>
                    )}
                  </>
                )}

                <button
                  type="button"
                  onClick={handleAddBar}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Build Bar
                </button>
              </div>
            </div>

            {/* Empty Canvas State */}
            {userBars.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-xs">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="text-sm font-black text-slate-800">Your Bar Model Canvas is Empty</h5>
                  <p className="text-xs text-slate-500 font-semibold max-w-sm mt-0.5">
                    Click "+ Build Bar" above to start constructing your model bar by bar.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddBar}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Build First Bar
                </button>
              </div>
            ) : (
              /* Unified Comparative Bar Canvas: Bars stack tightly on a shared baseline */
              <div className="p-4 sm:p-5 bg-slate-50/70 border-2 border-slate-200 rounded-2xl space-y-2.5">
                {userBars.map((bar, idx) => (
                  <div key={bar.id} className="transition-all duration-200">
                    
                    {/* ══ The Single-Line Bar Row (Matches the exact height of the bar!) ══ */}
                    <div className="flex items-center gap-2 sm:gap-3">
                      {/* Left of Starting Line: Entity Label */}
                      <div className="w-20 sm:w-24 text-right shrink-0">
                        <span className="text-xs font-black uppercase tracking-wider text-slate-800 truncate block">
                          {bar.name || `Bar ${idx + 1}`}
                        </span>
                        {bar.value && (
                          <span className="text-[10px] font-bold text-slate-400 font-mono block truncate">
                            {bar.value}
                          </span>
                        )}
                      </div>

                      {/* Vertical Starting Line & Bar Track */}
                      <div className="flex-1 pl-3 border-l-4 border-indigo-500 border-dashed py-0.5">
                        <div className="flex items-center gap-2">
                          {/* The Bar Track */}
                          <div className="flex-1 flex items-center h-11 bg-white rounded-xl border border-slate-200 p-1 shadow-xs overflow-visible relative">
                            {/* Base Solid Segment */}
                            <div
                              style={{ width: `${bar.length}%` }}
                              className={`h-full rounded-lg flex items-center justify-center text-xs font-black text-white shadow-xs transition-all duration-150 px-2 truncate shrink-0 ${
                                idx === 0 ? 'bg-indigo-600' : idx === 1 ? 'bg-indigo-500' : 'bg-indigo-400'
                              }`}
                            >
                              {bar.value || bar.name || "Base"}
                            </div>

                            {/* Difference Segment / Bracket */}
                            {bar.hasDifference && (
                              bar.diffType === 'FEWER' ? (
                                /* WHEN LESS / FEWER: Open shortage gap with bracket and unsigned numeric value */
                                (() => {
                                  const cleanDiffNum = (bar.diffValue || "").replace(/[+\-]/g, '').trim();
                                  const isBottomBracket = (bar.bracketPosition || (idx > 0 ? 'bottom' : 'top')) === 'bottom';
                                  return (
                                    <div
                                      style={{ width: `${bar.diffLength}%` }}
                                      className="relative h-full ml-1 flex flex-col justify-between items-center py-1 px-1 transition-all duration-150 overflow-visible select-none shrink-0"
                                      title="Difference bracket showing comparison with reference"
                                    >
                                      {/* Vertical dotted alignment reference line reaching down from the longer bar above (or to bar below) */}
                                      <div
                                        className={`absolute right-0 w-0 border-r-2 border-dotted border-rose-400 pointer-events-none z-10 ${
                                          isBottomBracket ? '-top-6 bottom-0' : 'top-0 -bottom-6'
                                        }`}
                                      >
                                        <span className="absolute -top-1 -right-[3px] w-1.5 h-1.5 bg-rose-500 rounded-full" />
                                        <span className="absolute -bottom-1 -right-[3px] w-1.5 h-1.5 bg-rose-500 rounded-full" />
                                      </div>

                                      {/* Subtle open gap floor/ceiling guide */}
                                      <div className={`absolute inset-0 bg-rose-50/20 rounded-lg pointer-events-none ${
                                        isBottomBracket ? 'border-b border-dashed border-rose-200' : 'border-t border-dashed border-rose-200'
                                      }`} />

                                      {isBottomBracket ? (
                                        <>
                                          {/* Unsigned Number (strictly numeric, no + or - sign) above bottom bracket */}
                                          <div className="relative z-10 flex-1 flex items-center justify-center">
                                            <span className="text-[11px] font-black text-rose-700 font-mono tracking-tight px-1.5 py-0.2 bg-white/95 rounded border border-rose-200 shadow-2xs truncate max-w-full">
                                              {cleanDiffNum || "5,000"}
                                            </span>
                                          </div>

                                          {/* Bottom Bracket: Horizontal line at bottom with upward ticks on left and right, and center downward cusp */}
                                          <div className="relative z-10 w-full h-2 border-x-2 border-b-2 border-rose-500 rounded-b-md">
                                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-x-3 border-x-transparent border-t-3 border-t-rose-500" />
                                          </div>
                                        </>
                                      ) : (
                                        <>
                                          {/* Top Bracket: Horizontal line at top with downward ticks on left and right, and center upward cusp */}
                                          <div className="relative z-10 w-full h-2 border-x-2 border-t-2 border-rose-500 rounded-t-md">
                                            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-x-3 border-x-transparent border-b-3 border-b-rose-500" />
                                          </div>

                                          {/* Unsigned Number (strictly numeric, no + or - sign) below top bracket */}
                                          <div className="relative z-10 flex-1 flex items-center justify-center">
                                            <span className="text-[11px] font-black text-rose-700 font-mono tracking-tight px-1.5 py-0.2 bg-white/95 rounded border border-rose-200 shadow-2xs truncate max-w-full">
                                              {cleanDiffNum || "5,000"}
                                            </span>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  );
                                })()
                              ) : (
                                /* WHEN MORE: Solid green protruding extra difference section */
                                <div
                                  style={{ width: `${bar.diffLength}%` }}
                                  className="h-full rounded-lg ml-1 px-2 flex items-center justify-center text-xs font-black text-white shadow-xs border border-emerald-400 border-dashed bg-emerald-500 transition-all duration-150 truncate shrink-0"
                                  title="Extra difference amount protruding beyond the base"
                                >
                                  {bar.diffValue || "+ More"}
                                </div>
                              )
                            )}
                          </div>

                          {/* Collapse/Expand Arrow Tag right at the end of the bar */}
                          <button
                            type="button"
                            onClick={() => handleToggleCollapseBar(bar.id)}
                            className={`h-9 px-2 rounded-lg flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                              bar.isCollapsed
                                ? 'bg-white hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 border border-slate-200 hover:border-indigo-200'
                                : 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-xs'
                            }`}
                            title={bar.isCollapsed ? "Edit bar parameters" : "Collapse into bar height"}
                          >
                            {bar.isCollapsed ? (
                              <ChevronDown className="w-4 h-4 text-slate-500" />
                            ) : (
                              <ChevronUp className="w-4 h-4 text-indigo-600" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* ══ Collapsible Parameters Panel (Only visible when NOT collapsed) ══ */}
                    {!bar.isCollapsed && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="ml-24 sm:ml-28 mt-2 p-4 bg-white border-2 border-indigo-100 rounded-2xl shadow-sm space-y-3"
                      >
                        {/* Section Header */}
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                          <span className="text-xs font-black text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
                            <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">
                              {idx + 1}
                            </span>
                            Editing {bar.name || `Bar ${idx + 1}`} Parameters
                          </span>
                          <span className="text-[11px] text-slate-400 font-semibold">
                            Adjust length, labels & difference
                          </span>
                        </div>

                        {/* Primary Inputs Row: Base Bar Parameters */}
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                          {/* Name input */}
                          <div className="sm:col-span-5 space-y-1">
                            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500">
                              Bar Label / Name
                            </label>
                            <input
                              type="text"
                              value={bar.name}
                              onChange={(e) => handleUpdateBar(bar.id, 'name', e.target.value)}
                              placeholder="e.g. Arjun"
                              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-500"
                            />
                            {/* Quick Suggestion Chips from Problem Entities */}
                            {entities.length > 0 && (
                              <div className="flex flex-wrap gap-1 pt-0.5">
                                {entities.map(ent => (
                                  <button
                                    key={ent.name}
                                    type="button"
                                    onClick={() => handleUpdateBar(bar.id, 'name', ent.name)}
                                    className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-200/70 hover:bg-indigo-100 hover:text-indigo-700 text-slate-700 transition-all cursor-pointer"
                                  >
                                    +{ent.name}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Value label */}
                          <div className="sm:col-span-3 space-y-1">
                            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500">
                              Value Label
                            </label>
                            <input
                              type="text"
                              value={bar.value}
                              onChange={(e) => handleUpdateBar(bar.id, 'value', e.target.value)}
                              placeholder="e.g. 13,400"
                              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-500"
                            />
                          </div>

                          {/* Bar Length Slider */}
                          <div className="sm:col-span-4 space-y-1">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-wider text-slate-500">
                              <span>Bar Length</span>
                              <span className="font-mono text-indigo-600">{bar.length}%</span>
                            </div>
                            <input
                              type="range"
                              min="20"
                              max="80"
                              value={bar.length}
                              onChange={(e) => handleUpdateBar(bar.id, 'length', Number(e.target.value))}
                              className="w-full accent-indigo-600 cursor-pointer"
                            />
                          </div>
                        </div>

                        {/* Line 2: Difference Segment Parameters (1 line below base bar parameter) */}
                        <div className="pt-2 border-t border-slate-100">
                          <div className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-200 flex flex-wrap items-center gap-2.5 sm:gap-3">
                            {/* Has Diff Button */}
                            <button
                              type="button"
                              onClick={() => handleToggleDifference(bar.id)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-black tracking-wide border transition-all cursor-pointer shrink-0 ${
                                bar.hasDifference
                                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                  : 'bg-white border-slate-300 text-slate-600 hover:border-indigo-400 hover:text-indigo-600'
                              }`}
                            >
                              {bar.hasDifference ? "✓ Has Diff" : "+ Diff"}
                            </button>

                            {/* Aligned rest of difference segment parameters next to Has Diff button */}
                            {bar.hasDifference ? (
                              <>
                                {/* Type (+ More / - Fewer) */}
                                <div className="flex items-center gap-1 bg-white p-0.5 rounded-xl border border-slate-200 shrink-0 shadow-2xs">
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateBar(bar.id, 'diffType', 'MORE')}
                                    className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition-all cursor-pointer ${
                                      bar.diffType === 'MORE'
                                        ? 'bg-emerald-600 text-white shadow-xs'
                                        : 'text-slate-600 hover:bg-slate-100'
                                    }`}
                                  >
                                    + More
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateBar(bar.id, 'diffType', 'FEWER')}
                                    className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition-all cursor-pointer ${
                                      bar.diffType === 'FEWER'
                                        ? 'bg-rose-600 text-white shadow-xs'
                                        : 'text-slate-600 hover:bg-slate-100'
                                    }`}
                                  >
                                    - Fewer
                                  </button>
                                </div>

                                {/* Diff Value */}
                                <div className="w-28 sm:w-32 shrink-0">
                                  <input
                                    type="text"
                                    value={bar.diffValue}
                                    onChange={(e) => handleUpdateBar(bar.id, 'diffValue', e.target.value)}
                                    placeholder={bar.diffType === 'FEWER' ? "Diff (e.g. 5,000)" : "Diff (e.g. 5,000)"}
                                    className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1 text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-500 shadow-2xs"
                                  />
                                </div>

                                {/* Bracket Position Toggle (for negative difference / FEWER) */}
                                {bar.diffType === 'FEWER' && (
                                  <div className="flex items-center gap-1 bg-white p-0.5 rounded-xl border border-slate-200 shrink-0 shadow-2xs">
                                    <span className="text-[10px] font-black uppercase text-slate-400 pl-1.5 shrink-0">
                                      Bracket:
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => handleUpdateBar(bar.id, 'bracketPosition', 'bottom')}
                                      className={`px-2 py-1 rounded-lg text-[11px] font-black flex items-center gap-1 transition-all cursor-pointer ${
                                        (bar.bracketPosition || (idx > 0 ? 'bottom' : 'top')) === 'bottom'
                                          ? 'bg-indigo-600 text-white shadow-xs'
                                          : 'text-slate-600 hover:bg-slate-100'
                                      }`}
                                      title="Render bottom bracket (comparing to top bar)"
                                    >
                                      <span>⎵</span>
                                      <span>Bottom</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleUpdateBar(bar.id, 'bracketPosition', 'top')}
                                      className={`px-2 py-1 rounded-lg text-[11px] font-black flex items-center gap-1 transition-all cursor-pointer ${
                                        (bar.bracketPosition || (idx > 0 ? 'bottom' : 'top')) === 'top'
                                          ? 'bg-indigo-600 text-white shadow-xs'
                                          : 'text-slate-600 hover:bg-slate-100'
                                      }`}
                                      title="Render top bracket (comparing to bottom bar)"
                                    >
                                      <span>⎴</span>
                                      <span>Top</span>
                                    </button>
                                  </div>
                                )}

                                {/* Diff Width Slider */}
                                <div className="flex items-center gap-2 min-w-[130px] max-w-[190px] flex-1 shrink-0">
                                  <span className="text-[10px] font-black uppercase text-slate-500 shrink-0">
                                    Width: <span className="font-mono text-indigo-600">{bar.diffLength}%</span>
                                  </span>
                                  <input
                                    type="range"
                                    min="10"
                                    max="40"
                                    value={bar.diffLength}
                                    onChange={(e) => handleUpdateBar(bar.id, 'diffLength', Number(e.target.value))}
                                    className="w-full accent-indigo-600 cursor-pointer"
                                  />
                                </div>
                              </>
                            ) : (
                              <span className="text-xs text-slate-400 font-medium">
                                No difference attached to this bar. Click "+ Diff" to add.
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Bottom Actions Row: Delete Button + Done / Collapse Button */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => handleDeleteBar(bar.id)}
                            className="text-xs font-bold text-rose-500 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200 flex items-center gap-1.5 transition-all cursor-pointer"
                            title="Delete this bar"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete Bar
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleCollapseBar(bar.id)}
                            className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3.5 py-1.5 rounded-xl flex items-center gap-1 transition-all cursor-pointer"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                            Done / Collapse
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Total Bracket if Finding Total */}
            {target.type === 'TOTAL' && userBars.length > 0 && (
              <div className="pt-4 border-t-2 border-dashed border-slate-200 flex items-center justify-between bg-amber-50/70 p-4 rounded-2xl border border-amber-200">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                  <span className="text-xs font-black text-amber-950 uppercase tracking-wider">
                    Grand Total Across All Entities
                  </span>
                </div>
                <div className="px-3.5 py-1.5 bg-amber-400 text-slate-900 font-black rounded-xl text-xs shadow-xs animate-pulse">
                  ? {config.itemName || "Total"}
                </div>
              </div>
            )}

            {/* Bottom Confirmation Bar */}
            <div className="pt-2">
              {userBars.length === 0 ? (
                <button
                  type="button"
                  disabled
                  className="w-full py-3.5 px-6 rounded-2xl font-black text-xs uppercase tracking-wider bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Build at least one bar to check
                </button>
              ) : stage2Status === 'correct' ? (
                <motion.button
                  type="button"
                  initial={{ scale: 0.99 }}
                  animate={{ scale: 1 }}
                  onClick={handleProceedToStage3}
                  className="w-full py-3.5 px-6 rounded-2xl font-black text-xs uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer transition-all active:scale-[0.99] shadow-md ring-4 ring-emerald-100 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Bar Model Verified — Solve Equations
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              ) : stage2Status === 'incorrect' ? (
                <motion.button
                  type="button"
                  initial={{ x: -4 }}
                  animate={{ x: [-4, 4, -4, 4, 0] }}
                  transition={{ duration: 0.3 }}
                  onClick={handleVerifyStage2}
                  className="w-full py-3.5 px-6 rounded-2xl font-black text-xs uppercase tracking-wider bg-rose-500 hover:bg-rose-600 text-white cursor-pointer transition-all active:scale-[0.99] shadow-sm flex items-center justify-center gap-2"
                >
                  <AlertCircle className="w-4 h-4" />
                  {stage2ErrorMsg || "Incomplete Model — Build all entity bars and labels"}
                </motion.button>
              ) : (
                <button
                  type="button"
                  disabled={disabled}
                  onClick={handleVerifyStage2}
                  className="w-full py-3.5 px-6 rounded-2xl font-black text-xs uppercase tracking-wider bg-slate-900 hover:bg-slate-800 text-white cursor-pointer transition-all active:scale-[0.99] shadow-sm flex items-center justify-center gap-2"
                >
                  Check & Verify Bar Model
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
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
