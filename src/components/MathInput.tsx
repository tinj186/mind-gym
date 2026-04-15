'use client';

import React, { useEffect, useRef, useState } from 'react';

// Registering the custom element for TypeScript validation
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'math-field': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        ref?: React.RefObject<any>;
        'menu-toggle-visibility'?: string;
        'math-virtual-keyboard-policy'?: string;
      };
    }
  }
}

interface MathInputProps {
  name?: string;
  value: string;
  onChange: (value: string) => void;
  onEnter?: () => void;
}

export default function MathInput({ name, value, onChange, onEnter }: MathInputProps) {
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
          // Using unpkg as the primary stable source
          mfClass.fontsDirectory = "https://unpkg.com/mathlive@0.109.1/dist/fonts/";
          mfClass.soundsDirectory = "https://unpkg.com/mathlive@0.109.1/dist/sounds/";
        }
      };

      // Check if MathLive is already loaded (e.g., from another component)
      const existingClass = (window as any).MathfieldElement;
      if (typeof existingClass === 'function') {
        configureMathLive(existingClass);
        setIsLoaded(true);
      } else {
        console.log('📦 [MathInput] Starting dynamic import of MathLive...');
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

    // Configure the "Lean Math" Keyboard for Primary Students (MathLive 0.109+ API)
    const mvk = (window as any).mathVirtualKeyboard;
    if (mvk) {
      mvk.layouts = [
        {
          name: "moe-math",
          label: "Math",
          tooltip: "MOE Primary Math Layout",
          rows: [
            // Row 1: Fractions & Mixed Numbers (The "Heavy Lifters")
            [
              { latex: "\\frac{#?}{#?}", label: "fraction", class: "keycap" },
              { latex: "#?\\frac{#?}{#?}", label: "mixed", class: "keycap" },
              { latex: "#?^{2}", label: "sq", class: "keycap" }, // For Area units
              { latex: "\\angle", label: "angle" },
              { latex: "^{\\circ}", label: "deg" },
              { label: "⌫", command: ["performWithComponent", "deleteBackward"], class: "keycap" }
            ],
            // Row 2: Numbers & Logic
            [
              { label: "7", key: "7" }, { label: "8", key: "8" }, { label: "9", key: "9" },
              { label: "÷", key: "/" },
              { label: "<", key: "<" },
              { label: ">", key: ">" }
            ],
            // Row 3: Numbers & Operations
            [
              { label: "4", key: "4" }, { label: "5", key: "5" }, { label: "6", key: "6" },
              { label: "×", key: "*" },
              { label: "(", key: "(" },
              { label: ")", key: ")" }
            ],
            // Row 4: Numbers & Finalization
            [
              { label: "1", key: "1" }, { label: "2", key: "2" }, { label: "3", key: "3" },
              { label: "+", key: "+" },
              { label: "−", key: "-" },
              { label: "≠", latex: "\\neq" }
            ],
            // Row 5: Zero & Enter
            [
              { label: "0", key: "0" }, 
              { label: ".", key: "." },
              { label: "$", key: "$" }, // For Money questions
              { label: "%", key: "%" }, // For Percentage (P5/P6)
              { label: "⏎", key: "Enter", class: "action w-20" }
            ]
          ]
        }
      ];
    }

    // Force hide UI buttons that clutter the primary interface
    currentMf.menuToggleVisibility = "hidden";
    currentMf.virtualKeyboardToggleVisibility = "hidden";

    currentMf.readOnly = false;
    currentMf.letterShapeStyle = "iso";
    currentMf.smartFence = true;
    currentMf.macros = {
      ...currentMf.macros,
      cm2: '{cm}^2',
      m2: '{m}^2',
      kg: '\\text{kg}',
      ml: '\\text{ml}',
      "m/s": '\\text{m/s}',
    };

    if (currentMf.value !== value) {
      currentMf.value = value || "";
    }

    const onInputEvent = (e: Event) => {
      const target = e.target as any;
      // Get value in LaTeX format
      const newValue = target?.value || target?.getValue?.() || "";
      
      if (newValue === value) return; // Prevent redundant updates
      console.log('🎹 [MathInput] Event detected. New value:', newValue);
      onChangeRef.current(newValue);
    };

    const onKeyDownEvent = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && onEnterRef.current) {
        onEnterRef.current();
      }
    };

    currentMf.addEventListener('input', onInputEvent);
    currentMf.addEventListener('keydown', onKeyDownEvent);
    
    console.log('✅ [MathInput] Event listeners attached successfully.');

    return () => {
      currentMf.removeEventListener('input', onInputEvent);
      currentMf.removeEventListener('keydown', onKeyDownEvent);
    };
  }, [isLoaded]);

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
    if (!isFocused && value !== undefined && String(mfe.value) !== String(value)) {
      console.log('🔄 [MathInput] Syncing external value:', value);
      mfe.value = value || "";
    }
  }, [value, isLoaded]);

  return (
    <div className="w-full max-w-md mx-auto p-2">
      <div className="relative group bg-white rounded-2xl border-2 border-slate-100 p-6 shadow-sm focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-50 transition-all">
        {/* The Math-Field Custom Element */}
        {isLoaded ? (
          <math-field
            ref={mfRef}
            tabIndex={0}
            menu-toggle-visibility="hidden"
            virtual-keyboard-toggle-visibility="hidden"
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