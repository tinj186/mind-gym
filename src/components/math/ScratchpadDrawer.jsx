"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PenTool, ChevronRight } from 'lucide-react';
import ScribbleBox from '@/components/math/ScribbleBox';

/**
 * ScratchpadDrawer
 * 
 * An Apple Pencil & touch-ready slide-out scratchpad drawer for workout sessions.
 * 
 * Improvements:
 * 1. Clean dim background without blur (question and options remain fully legible).
 * 2. Canvas state is fully preserved across drawer open/close during the same question;
 *    only resets when moving to a new question (keyed by questionId).
 * 3. The pull tab sits at the exact same vertical location to both open and close the drawer.
 * 4. Single unified title header ("Math Working Space") directly in ScribbleBox.
 */
export default function ScratchpadDrawer({
  questionId,
  autoOpenOnPencil = false,
  className = ""
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const handleStrokeCountChange = React.useCallback((count) => {
    setHasDrawn(count > 1);
  }, []);

  // Auto-detect Apple Pencil proximity or stylus touch
  useEffect(() => {
    const handlePointerDown = (e) => {
      if (autoOpenOnPencil && e.pointerType === 'pen' && !isOpen) {
        setIsOpen(true);
      }
    };
    window.addEventListener('pointerdown', handlePointerDown);
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, [autoOpenOnPencil, isOpen]);

  // Keyboard shortcut: Press 'S' or 'Alt+S' to toggle scratchpad (for laptop/desktop users)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is actively typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (e.key === 's' || e.key === 'S') {
        if (!e.metaKey && !e.ctrlKey) {
          setIsOpen((prev) => !prev);
        }
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <>
      {/* 1. Hardware-Accelerated Dim Backdrop (Zero flash, zero re-render flicker) */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(false);
        }}
        aria-hidden="true"
        className={`fixed inset-0 z-[60] bg-black/40 transition-opacity duration-300 ease-out ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* 2. Slide-Out Drawer Panel (Always mounted so drawings are NEVER wiped on close!) */}
      <motion.aside
        initial={false}
        animate={{ x: isOpen ? '0%' : '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 240 }}
        style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
        className={`fixed inset-y-0 right-0 z-[70] w-full sm:w-[500px] lg:w-[580px] max-w-[92vw] bg-white shadow-[-15px_0_40px_rgba(0,0,0,0.3)] border-l-2 border-slate-300 flex flex-col ${className}`}
      >
        {/* 🎯 THE DUAL-STATE PULL TAB: Sits at the same vertical location to Open & Close */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen((prev) => !prev);
          }}
          title={isOpen ? "Close Scratchpad" : "Open Math Scratchpad (Press 'S')"}
          style={{ pointerEvents: 'auto' }}
          className="absolute -left-11 top-1/2 -translate-y-1/2 z-50 bg-slate-900 hover:bg-indigo-600 text-white py-4 px-2.5 rounded-l-2xl shadow-[-6px_4px_16px_rgba(0,0,0,0.25)] border-l-2 border-t-2 border-b-2 border-slate-700 hover:border-indigo-400 flex flex-col items-center gap-2 group cursor-pointer transition-colors"
        >
          <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
            {isOpen ? (
              <ChevronRight className="w-4 h-4 text-indigo-300 group-hover:text-white transition-transform group-hover:translate-x-0.5" />
            ) : (
              <PenTool className="w-4 h-4 text-indigo-300 group-hover:text-white transition-colors" />
            )}
          </div>
          
          <span className="[writing-mode:vertical-rl] text-[11px] font-black tracking-widest uppercase rotate-180 text-slate-300 group-hover:text-white select-none">
            {isOpen ? "Close" : "Scratchpad"}
          </span>

          {!isOpen && hasDrawn && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-slate-900 animate-pulse mt-1" />
          )}
        </button>

        {/* 🎨 The Single Unified ScribbleBox Header & Canvas */}
        <div className="flex-1 w-full h-full overflow-hidden relative">
          <ScribbleBox
            key={questionId || 'math-scratchpad'}
            title="Math Working Space"
            fullHeight={true}
            allowTouchByDefault={true}
            onStrokeCountChange={handleStrokeCountChange}
            onClose={() => setIsOpen(false)}
          />
        </div>
      </motion.aside>
    </>
  );
}
