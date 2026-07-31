'use client';

import React, { useEffect, useRef, useState } from 'react';

// Registering the custom element for TypeScript validation
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'math-field': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        ref?: React.RefObject<any>;
        'menu-toggle-visibility'?: string;
        'virtual-keyboard-toggle-visibility'?: string;
        'math-virtual-keyboard-policy'?: string;
      };
    }
  }
}

interface MathInputProps {
  id?: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  onEnter?: () => void;
  disabled?: boolean;
  autoFocus?: boolean;
  level?: string;
}

export default function MathInput({ id, name, value, onChange, onEnter, disabled = false, autoFocus = false, level = "Primary 1" }: MathInputProps) {
  const mfRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Keep references to props so the initialization effect doesn't re-run
  // when the student types or the parent state updates.
  const onChangeRef = useRef(onChange);
  const onEnterRef = useRef(onEnter);

  useEffect(() => {
    onChangeRef.current = onChange;
    onEnterRef.current = onEnter;
  }, [onChange, onEnter]);

  useEffect(() => {
    let isMounted = true;
    if (typeof window !== 'undefined') {
      const configureMathLive = (mfClass: any) => {
        if (typeof mfClass === 'function') {
          // Point to local assets in /public/mathlive/
          mfClass.fontsDirectory = "/mathlive/fonts/";
          mfClass.soundsDirectory = "/mathlive/sounds/";
        }
      };

      // Check if MathLive is already loaded (e.g., from another component)
      const existingClass = (window as any).MathfieldElement;
      if (typeof existingClass === 'function') {
        configureMathLive(existingClass);
        setIsLoaded(true);
      } else {
        console.log('📦 [MathInput] Starting dynamic import of MathLive...');
        // @ts-ignore
        import('mathlive')
          .then((m) => {
            if (!isMounted) return;
            const mfClass = m.MathfieldElement || (window as any).MathfieldElement;
            configureMathLive(mfClass);
            setIsLoaded(true);
          })
          .catch((err) => {
            console.warn('⚠️ [MathInput] Local ChunkLoadError, attempting CDN fallback...', err);
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/mathlive/dist/mathlive.min.js';
            script.onload = () => {
              if (!isMounted) return; // This fallback is no longer needed if fonts are local
              const mfClass = (window as any).MathfieldElement;
              configureMathLive(mfClass);
              setIsLoaded(true);
            };
            document.head.appendChild(script);
          });
      }
    }
    return () => {
      isMounted = false;
    };
  }, []);

  // Initialization effect for properties and event listeners
  useEffect(() => {
    if (!isLoaded || !mfRef.current) return;

    const currentMf = mfRef.current;
    console.log('🔍 [MathInput] Initializing custom element properties...');

    // Determine student grade level to customize keyboard
    const gradeLevel = parseInt((level || "Primary 1").replace(/\D/g, '')) || 1;

    const buildLayoutRows = () => {
      let toolKeys = [];
      
      if (gradeLevel >= 2) {
        toolKeys.push({ command: ["insert", "\\frac{#?}{#?}", { mode: "math" }], label: "a/b" });
        toolKeys.push({ command: ["insert", "#?\\frac{#?}{#?}", { mode: "math" }], label: "c a/b" });
      }
      if (gradeLevel >= 3) {
        toolKeys.push({ command: ["insert", "^{\\circ}", { mode: "math" }], label: "deg" });
      }
      if (gradeLevel >= 4) {
        toolKeys.push({ command: ["insert", "\\angle", { mode: "math" }], label: "angle" });
        toolKeys.push({ label: "<", key: "<" });
        toolKeys.push({ label: ">", key: ">" });
        toolKeys.push({ label: "(", key: "(" });
        toolKeys.push({ label: ")", key: ")" });
      }
      if (gradeLevel >= 5) {
        toolKeys.push({ command: ["insert", "#?^{2}", { mode: "math" }], label: "x²" });
        toolKeys.push({ command: ["insert", "#?^{3}", { mode: "math" }], label: "x³" });
        toolKeys.push({ label: "%", key: "%" });
      }

      const rows = [];
      
      // Chunk toolKeys into rows of 5
      for (let i = 0; i < toolKeys.length; i += 5) {
        rows.push(toolKeys.slice(i, i + 5));
      }

      // Compact 5x4 Numpad Grid
      rows.push([
        { label: "7", key: "7" }, 
        { label: "8", key: "8" }, 
        { label: "9", key: "9" },
        { command: ["insert", "\\div", { mode: "math" }], label: "÷", class: "action font-black" },
        { label: "⌫", command: ["deleteBackward"], class: "action font-black text-rose-500 bg-rose-50" }
      ]);

      rows.push([
        { label: "4", key: "4" }, 
        { label: "5", key: "5" }, 
        { label: "6", key: "6" },
        { command: ["insert", "\\times", { mode: "math" }], label: "×", class: "action font-black" },
        { label: "$", key: "$", class: "action font-black text-emerald-600" }
      ]);

      rows.push([
        { label: "1", key: "1" }, 
        { label: "2", key: "2" }, 
        { label: "3", key: "3" },
        { label: "−", key: "-", class: "action font-black" },
        { label: "¢", key: "¢", class: "action font-black text-emerald-600" }
      ]);

      rows.push([
        { label: "0", key: "0" }, 
        { label: ".", key: "." },
        { label: "'", key: "'" },
        { label: "=", key: "=", class: "action font-black text-blue-600" },
        { label: "+", key: "+", class: "action font-black" },
        { label: "⏎", command: "commit", class: "action font-black text-white bg-blue-600" }
      ]);

      return rows;
    };

    const buildWordsLayoutRows = () => {
      return [
        [
          { label: "1", key: "1" }, { label: "2", key: "2" }, { label: "3", key: "3" },
          { label: "4", key: "4" }, { label: "5", key: "5" }, { label: "6", key: "6" },
          { label: "7", key: "7" }, { label: "8", key: "8" }, { label: "9", key: "9" },
          { label: "0", key: "0" }
        ],
        [
          { label: "q", key: "q" }, { label: "w", key: "w" }, { label: "e", key: "e" },
          { label: "r", key: "r" }, { label: "t", key: "t" }, { label: "y", key: "y" },
          { label: "u", key: "u" }, { label: "i", key: "i" }, { label: "o", key: "o" },
          { label: "p", key: "p" }
        ],
        [
          { label: "a", key: "a" }, { label: "s", key: "s" }, { label: "d", key: "d" },
          { label: "f", key: "f" }, { label: "g", key: "g" }, { label: "h", key: "h" },
          { label: "j", key: "j" }, { label: "k", key: "k" }, { label: "l", key: "l" },
          { label: "'", key: "'", class: "font-black text-emerald-600" } 
        ],
        [
          { label: "z", key: "z" }, { label: "x", key: "x" }, { label: "c", key: "c" },
          { label: "v", key: "v" }, { label: "b", key: "b" }, { label: "n", key: "n" },
          { label: "m", key: "m" }, { label: ",", key: "," }, { label: "?", key: "?" },
          { label: "⌫", command: ["deleteBackward"], class: "action font-black text-rose-500 bg-rose-50" }
        ],
        [
          { label: "space", key: " ", width: 7 },
          { label: "⏎", command: "commit", class: "action font-black text-white bg-blue-600", width: 3 }
        ]
      ];
    };

    const mvk = (window as any).mathVirtualKeyboard;
    if (mvk) {
      mvk.keypressSound = null; // Disable the missing click sounds that cause 404s
      mvk.layouts = [
        {
          name: "moe-math",
          label: "123",
          tooltip: "MOE Primary Math Layout",
          rows: buildLayoutRows()
        },
        {
          name: "moe-words",
          label: "abc",
          tooltip: "MOE Primary Words Layout",
          rows: buildWordsLayoutRows()
        }
      ];
    }

    // Force hide UI buttons that clutter the primary interface
    currentMf.menuToggleVisibility = "hidden";
    currentMf.virtualKeyboardToggleVisibility = "hidden"; // Hide toggle to prevent focus loop glitch on mobile
    currentMf.mathVirtualKeyboardPolicy = "auto"; // Revert back to auto so the virtual keyboard takes over natively

    currentMf.readOnly = disabled;
    currentMf.letterShapeStyle = "upright"; // Disguise math variables as normal text
    currentMf.smartMode = false; // Disable unpredictable auto-guessing
    currentMf.defaultMode = "math"; // Stay in native math mode to prevent text-block placeholder bugs
    currentMf.smartFence = false;
    currentMf.mathModeSpace = "\\ ";
    currentMf.popoverPolicy = "none"; // Disable error toasts
    currentMf.plonkSound = null; // Disable error sounds
    
    currentMf.macros = {
      ...currentMf.macros,
      cm2: '{cm}^2',
      m2: '{m}^2',
      kg: '\\text{kg}',
      ml: '\\text{ml}',
      "m/s": '\\text{m/s}',
    };

    // Replace all default inline shortcuts to prevent words like "or" and "and" 
    // from automatically turning into \lor and \land math symbols.
    // We only define the specific physical keyboard shortcuts we want to allow.
    currentMf.mathModeInlineShortcuts = { 
      '*': '\\times',
      '/': '\\div',
      "'": "’" // Prevent apostrophe from turning into a math prime
    };
    currentMf.inlineShortcuts = { 
      '*': '\\times',
      '/': '\\div',
      "'": "’"
    };

    if (currentMf.value !== value) {
      currentMf.value = value || "";
    }

    const onInputEvent = (e: Event) => {
      const target = e.target as any;
      const newValue = target?.value || target?.getValue?.() || "";
      
      // Use the ref to check against the latest value to avoid stale closure issues
      if (newValue === mfRef.current?.value && newValue === value) return;

      console.log('🎹 [MathInput] Event detected. New value:', newValue);
      onChangeRef.current(newValue);
    };

    const onKeyDownEvent = (e: any) => {
      // Submit on Enter
      if (e.key === 'Enter' && onEnterRef.current) {
        e.preventDefault();
        e.stopPropagation();
        onEnterRef.current();
        return;
      }
    };

    const onCommitEvent = (e: Event) => {
      // MathLive fires 'change' on both Enter press AND blur.
      // We only want to submit if the user explicitly pressed Enter (the field is still focused).
      const isFocused = 
        document.activeElement === currentMf || 
        currentMf.contains(document.activeElement) ||
        (currentMf.shadowRoot && currentMf.shadowRoot.activeElement !== null);

      if (!isFocused && e.type === 'change') {
        console.log('👻 [MathInput] Ignoring ghost submit on blur.');
        return;
      }

      if (onEnterRef.current) {
        e.preventDefault();
        e.stopPropagation();
        onEnterRef.current();
      }
    };

    currentMf.addEventListener('input', onInputEvent);
    currentMf.addEventListener('keydown', onKeyDownEvent);
    currentMf.addEventListener('commit', onCommitEvent);
    currentMf.addEventListener('change', onCommitEvent);
    
    console.log('✅ [MathInput] Event listeners attached successfully.');

    return () => {
      currentMf.removeEventListener('input', onInputEvent);
      currentMf.removeEventListener('keydown', onKeyDownEvent);
      currentMf.removeEventListener('commit', onCommitEvent);
      currentMf.removeEventListener('change', onCommitEvent);
    };
  }, [isLoaded, level]);

  // 5. External Value Sync
  useEffect(() => {
    const mfe = mfRef.current;
    if (!mfe || !isLoaded) return;

    // Check if the math-field or any of its internal parts have focus
    // Resilient check for Shadow DOM focus
    const isFocused = 
      document.activeElement === mfe || 
      mfe.contains(document.activeElement) ||
      (mfe.shadowRoot && mfe.shadowRoot.activeElement !== null);

    // Only update DOM if the value changed externally AND the user isn't typing.
    // Also check if mfe.value is strictly different to avoid cursor jumps
    if (!isFocused && value !== undefined && (mfe.value + "") !== (value + "")) {
      console.log('🔄 [MathInput] Syncing external value:', value);
      mfe.value = value || "";
    }
  }, [value, isLoaded]);

  useEffect(() => {
    if (isLoaded && autoFocus && mfRef.current) {
      setTimeout(() => {
        try {
          if (mfRef.current) {
            mfRef.current.focus();
          }
        } catch (e) {
          console.warn('⚠️ [MathInput] Auto-focus skipped (likely blocked by mobile Safari security policy):', e);
        }
      }, 100);
    }
  }, [isLoaded, autoFocus]);

  return (
    <div className="w-full max-w-md mx-auto p-2">
      {/* Global override to ensure the UI buttons are hidden via CSS Parts */}
      <style>{`
        math-field::part(menu-toggle) { display: none !important; }
        /* Also hide the toggle if it appears in the shadow root container */
        math-field::part(container) > .menu-toggle { display: none !important; }
      `}</style>
      <div className="relative group bg-white rounded-2xl border-2 border-slate-100 p-6 shadow-sm focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-50 transition-all">
        {/* The Math-Field Custom Element */}
        {isLoaded ? (
          // @ts-ignore - Custom element loaded dynamically via MathLive
          <math-field
            id={id}
            ref={mfRef}
            tabIndex={0}
            menu-toggle-visibility="hidden"
            virtual-keyboard-toggle-visibility="visible"
            math-virtual-keyboard-policy="auto"
            style={{
              display: 'block',
              minHeight: '2.5rem',
              width: '100%',
              outline: 'none',
              fontSize: '1.5rem',
              background: 'transparent',
              color: '#0f172a', // slate-900
              pointerEvents: 'auto',
              cursor: 'text',
            }}
          />
        ) : (
          <div className="min-h-[2.5rem] w-full flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        {/* Small UI hint for the student */}
        <div className="absolute right-4 bottom-2 opacity-0 group-focus-within:opacity-100 transition-opacity">
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
            Enter to Submit
          </span>
        </div>
      </div>
    </div>
  );
}