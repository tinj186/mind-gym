"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, ArrowRight, Layers, Scale, RefreshCw, HelpCircle, Sparkles } from 'lucide-react';
import MathInput from '@/components/math/MathInput';

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
  const [stage1Feedback, setStage1Feedback] = useState(isAdminReview ? {
    type: 'success',
    message: "Admin Mode: Comparison Model selected by default."
  } : null);
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
    setSelectedModel(modelId);
    if (modelId === correctModelType) {
      setStage1Feedback({
        type: 'success',
        message: "Spot on! We are comparing distinct quantities across multiple individuals, so a Comparison Model is the right blueprint."
      });
    } else {
      setStage1Feedback({
        type: 'error',
        message: modelId === 'PART_WHOLE'
          ? "Not quite. A Part-Whole model is used when a single total is split into parts. Here we have multiple distinct entities with comparison relationships!"
          : "Not quite. A Before & After model tracks changes over time or internal transfers. Here we are comparing fixed quantities between entities!"
      });
    }
  };

  const handleProceedToStage2 = () => {
    if (selectedModel === correctModelType) {
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

  // Base scaling for visual bar representations
  const maxBarValue = Math.max(
    ...entities.map(e => (e.value || 0) + (e.diffValue || 0)), 
    100
  );

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* 🧭 Stage Progress Header */}
      <div className="flex items-center justify-between p-4 bg-slate-900 text-white rounded-3xl shadow-lg border-2 border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center font-black text-lg">
            {currentStage}
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Guided Problem Solver</div>
            <div className="text-base font-black">
              {currentStage === 1 && "Stage 1: Choose the Model Archetype"}
              {currentStage === 2 && "Stage 2: Inspect & Verify the Bar Blueprint"}
              {currentStage === 3 && "Stage 3: Calculate & Solve Equations"}
            </div>
          </div>
        </div>

        {/* Stage Pills */}
        <div className="flex items-center gap-2">
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
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/70 hover:bg-emerald-900 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              {stageNum === 1 ? "1. Archetype" : stageNum === 2 ? "2. Blueprint" : "3. Equations"}
            </button>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          STAGE 1: MODEL TYPE SELECTION
         ══════════════════════════════════════════════════════════════════════ */}
      {currentStage === 1 && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="space-y-6"
        >
          <div className="bg-indigo-50 border-2 border-indigo-200 p-6 rounded-3xl text-indigo-950 space-y-2">
            <h4 className="text-lg font-black flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-indigo-600" />
              Which Bar Model archetype fits this problem best?
            </h4>
            <p className="text-sm font-semibold text-indigo-800">
              Select the model structure that accurately represents the relationship between the entities in the question.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {modelOptions.map((opt) => {
              const isSelected = selectedModel === opt.id;
              const isCorrectChoice = opt.id === correctModelType;
              return (
                <button
                  key={opt.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleSelectModel(opt.id)}
                  className={`p-6 rounded-3xl border-4 text-left flex flex-col justify-between transition-all duration-200 active:scale-95 ${
                    isSelected
                      ? isCorrectChoice
                        ? 'border-emerald-500 bg-emerald-50/70 shadow-lg ring-4 ring-emerald-200 scale-[1.02]'
                        : 'border-rose-400 bg-rose-50/70 shadow-md ring-4 ring-rose-100'
                      : 'border-slate-200 bg-white hover:border-slate-400 hover:bg-slate-50'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                      {opt.id === 'COMPARISON' && <Scale className="w-6 h-6 text-indigo-600" />}
                      {opt.id === 'PART_WHOLE' && <Layers className="w-6 h-6 text-blue-600" />}
                      {opt.id === 'BEFORE_AFTER' && <RefreshCw className="w-6 h-6 text-amber-600" />}
                    </div>
                    <div>
                      <h5 className="text-lg font-black text-slate-900">{opt.label}</h5>
                      <p className="text-xs font-semibold text-slate-500 mt-1 leading-relaxed">
                        {opt.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                      {isSelected ? (isCorrectChoice ? "Correct" : "Try Again") : "Select"}
                    </span>
                    {isSelected && (
                      isCorrectChoice ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-rose-500" />
                      )
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Feedback & Proceed Button */}
          {stage1Feedback && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`p-6 rounded-3xl border-2 flex flex-col sm:flex-row items-center justify-between gap-4 ${
                stage1Feedback.type === 'success'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-rose-50 border-rose-300 text-rose-950'
              }`}
            >
              <div className="flex items-start gap-3">
                {stage1Feedback.type === 'success' ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
                )}
                <p className="text-sm font-bold leading-relaxed">{stage1Feedback.message}</p>
              </div>

              {stage1Feedback.type === 'success' && (
                <button
                  type="button"
                  onClick={handleProceedToStage2}
                  className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md shrink-0"
                >
                  Inspect Blueprint
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </motion.div>
          )}
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
