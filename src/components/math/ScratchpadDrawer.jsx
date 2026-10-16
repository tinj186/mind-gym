"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PenTool, ChevronRight, Sparkles } from 'lucide-react';
import ScribbleBox from '@/components/math/ScribbleBox';

/**
 * ScratchpadDrawer
 * 
 * An Apple Pencil & touch-ready slide-out scratchpad drawer for workout sessions.
 * 
 * Behavior:
 * - On iPad / Tablets: Students can slide it out from the right edge with a stylus tap,
 *   do their working alongside the question, and slide it back in anytime.
 * - On Laptops / Desktops: Stays neatly tucked as a minimal floating tab on the right edge,
 *   available whenever rough calculations are needed.
 * - State Preservation: Scribbles remain intact when sliding in and out.
 */
export default function ScratchpadDrawer({
  questionId,
  autoOpenOnPencil = false,
  className = ""
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  // Optional: Auto-detect Apple Pencil proximity or stylus hover
  useEffect(() => {
    const handlePointerDown = (e) => {
      // If stylus is used and autoOpenOnPencil is enabled, open drawer
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
      {/* 1. Floating Slide-Out Trigger Tab (Fixed on Right Edge) */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="scratchpad-tab"
            type="button"
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 60, opacity: 0 }}
            whileHover={{ x: -6 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            title="Open Math Scratchpad (Press 'S')"
            className={`fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-slate-900 hover:bg-indigo-600 text-white py-4 px-2.5 rounded-l-2xl shadow-[0_10px_30px_rgba(0,0,0,0.25)] border-l-2 border-t-2 border-b-2 border-slate-700 hover:border-indigo-400 flex flex-col items-center gap-2 group cursor-pointer transition-colors ${className}`}
          >
            <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <PenTool className="w-4 h-4 text-indigo-300 group-hover:text-white transition-colors" />
            </div>
            
            <span className="[writing-mode:vertical-rl] text-[11px] font-black tracking-widest uppercase rotate-180 text-slate-300 group-hover:text-white select-none">
              Scratchpad
            </span>

            {hasDrawn && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-slate-900 animate-pulse mt-1" />
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* 2. Slide-Over Backdrop (Light, Click to close) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="scratchpad-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[60] bg-slate-900/20 backdrop-blur-[2px] transition-opacity"
          />
        )}
      </AnimatePresence>

      {/* 3. Slide-Out Drawer Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            key="scratchpad-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 240 }}
            className="fixed inset-y-0 right-0 z-[70] w-full sm:w-[480px] lg:w-[560px] max-w-[92vw] bg-white shadow-[-15px_0_50px_rgba(0,0,0,0.25)] border-l-4 border-slate-900 flex flex-col overflow-hidden"
          >
            {/* Drawer Header Status Bar */}
            <div className="flex items-center justify-between px-5 py-3 bg-slate-900 text-white select-none">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-xs font-black tracking-wider uppercase text-slate-100 flex items-center gap-1.5">
                    Math Working Space
                    <span className="text-[10px] bg-indigo-500 text-white px-1.5 py-0.5 rounded font-bold">
                      iPad Ready
                    </span>
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono">
                    Rest palm freely with Apple Pencil
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all border border-slate-700"
              >
                <span>Hide</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Embedded High-Performance Scribble Canvas */}
            <div className="flex-1 w-full overflow-hidden relative">
              <ScribbleBox
                key={questionId || 'global-scratchpad'}
                title="Working Paper"
                fullHeight={true}
                allowTouchByDefault={true}
                onStrokeCountChange={(count) => setHasDrawn(count > 1)}
                onClose={() => setIsOpen(false)}
              />
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
