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
  const isDesktop = typeof window !== 'undefined' ? (!window.matchMedia("(pointer: coarse)").matches && !('ontouchstart' in window)) : true;
  
  // Keep references to props so the initialization effect doesn't re-run
  // when the student types or the parent state updates.
  const onChangeRef = useRef(onChange);
  const onEnterRef = useRef(onEnter);

  useEffect(() => {
    onChangeRef.current = onChange;
    onEnterRef.current = onEnter;
  }, [onChange, onEnter]);

  // DIAGNOSTIC INJECTION FOR SAFARI BUG
  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
       if (event.message.includes("this.mathfield.options")) {
          console.error("🚨 SAFARI CRASH INTERCEPTED 🚨");
          console.error("Message:", event.message);
          console.error("Stack Trace:", event.error?.stack || "No stack trace available");
          console.error("Active Element:", document.activeElement);
          if ((window as any).mathVirtualKeyboard) {
             console.error("MVK State:", {
               activeMathfield: (window as any).mathVirtualKeyboard.activeMathfield,
               visible: (window as any).mathVirtualKeyboard.visible
             });
          }
       }
    };
    
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
       if (event.reason && event.reason.message && event.reason.message.includes("this.mathfield.options")) {
          console.error("🚨 SAFARI ASYNC CRASH INTERCEPTED 🚨", event.reason.stack);
       }
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    return () => {
       window.removeEventListener('error', handleGlobalError);
       window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

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
    
    let isActive = true;
    let cleanupEvents: (() => void) | null = null;

    customElements.whenDefined('math-field').then(() => {
      if (!isActive || !mfRef.current) return;

      const currentMf = mfRef.current;
      console.log('🔍 [MathInput] Initializing custom element properties...');

    // Determine student grade level to customize keyboard
    const gradeLevel = parseInt((level || "Primary 1").replace(/\D/g, '')) || 1;

    const buildDesktopToolRows = () => {
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
        toolKeys.push({ label: ")" }); // key not strictly needed if label matches
      }
      if (gradeLevel >= 5) {
        toolKeys.push({ command: ["insert", "#?^{2}", { mode: "math" }], label: "x²" });
        toolKeys.push({ command: ["insert", "#?^{3}", { mode: "math" }], label: "x³" });
        toolKeys.push({ label: "%", key: "%" });
      }

      // Add common operators and currency at the end
      toolKeys.push(
        { label: "+", key: "+", class: "action font-black" },
        { label: "−", key: "-", class: "action font-black" },
        { command: ["insert", "\\times", { mode: "math" }], label: "×", class: "action font-black" },
        { command: ["insert", "\\div", { mode: "math" }], label: "÷", class: "action font-black" },
        { label: "$", key: "$", class: "action font-black text-emerald-600" },
        { label: "¢", key: "¢", class: "action font-black text-emerald-600" }
      );

      const rows = [toolKeys];
      return rows;
    };

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
    if (mvk && !(mvk as any).__layoutsConfigured) {
      (mvk as any).__layoutsConfigured = true;
      mvk.keypressSound = null; // Disable the missing click sounds that cause 404s
      
      if (isDesktop) {
        mvk.layouts = [
          {
            name: "desktop-math-tools",
            label: "Tools",
            tooltip: "Math Tools",
            rows: buildDesktopToolRows()
          }
        ];
      } else {
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
    }

    // MathLive's connectedCallback might be pending in the microtask queue.
    // We must wait for the next frame to safely apply configurations.
    requestAnimationFrame(() => {
      if (!isActive || !mfRef.current) return;
      
      const mfe = mfRef.current;
      
      try {
          mfe.menuToggleVisibility = "hidden";
          mfe.virtualKeyboardToggleVisibility = "hidden";
          mfe.mathVirtualKeyboardPolicy = isDesktop ? "manual" : "auto";
          mfe.readOnly = disabled;
          mfe.letterShapeStyle = "upright";
          mfe.smartMode = false;
          mfe.defaultMode = "math";
          mfe.smartFence = false;
          mfe.mathModeSpace = "\\ ";
          mfe.popoverPolicy = "none";
        
        mfe.macros = {
          ...mfe.macros,
          cm2: '{cm}^2',
          m2: '{m}^2',
          kg: '\\text{kg}',
          ml: '\\text{ml}',
          "m/s": '\\text{m/s}',
        };
        mfe.inlineShortcuts = {
          '*': '\\times',
          '/': '\\div',
          "'": "’"
        };
        
        if (mfe.keybindings) {
          mfe.keybindings = mfe.keybindings.filter((kb: any) => kb.key !== 'tab' && kb.key !== 'shift+[Tab]' && kb.key !== '[Tab]');
        }
        
        // MathLive < 0.94 compat
        if (mfe.mathModeInlineShortcuts !== undefined) {
           mfe.mathModeInlineShortcuts = { '*': '\\times', '/': '\\div', "'": "’" };
        }
      } catch (e) {
        console.warn("Could not apply configurations early, retrying safely", e);
      }

      if ((window as any).mathVirtualKeyboard) {
        (window as any).mathVirtualKeyboard.plonkSound = null;
        (window as any).mathVirtualKeyboard.keypressSound = null;
      }

      try {
        if (mfe.value !== value) {
          mfe.value = value || "";
        }
      } catch (e) {}
    });

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
      const isFocused = 
        document.activeElement === currentMf || 
        currentMf.contains(document.activeElement) ||
        (currentMf.shadowRoot && currentMf.shadowRoot.activeElement !== null);

      if (!isFocused) {
        console.log(`👻 [MathInput] Ignoring ghost commit on blur.`);
        return;
      }

      if (onEnterRef.current) {
        e.preventDefault();
        e.stopPropagation();
        onEnterRef.current();
      }
    };

    const onFocusIn = () => {
      if (!currentMf) return;
      
      const mvk = (window as any).mathVirtualKeyboard;
      // In manual policy mode, MathLive requires the activeMathfield to be set.
      // If it's missing on focus, internal MathLive handlers may crash in Safari.
      if (mvk && mvk.activeMathfield !== currentMf) {
        try {
          mvk.activeMathfield = currentMf;
        } catch(e) {}
      }
    };

    const onClick = () => {
      // Only pop up the virtual keyboard on Desktop if they explicitly click/tap the field.
      // Tabbing into it via keyboard should not obstruct the screen.
      if (isDesktop && currentMf && currentMf.executeCommand) {
        try {
          currentMf.executeCommand("showVirtualKeyboard");
        } catch(e) {}
      }
    };

    const onFocusOut = () => {
      if (isDesktop) {
        setTimeout(() => {
          if (!document.activeElement || document.activeElement.tagName.toLowerCase() !== 'math-field') {
            try {
              if (currentMf && currentMf.executeCommand) {
                 currentMf.executeCommand("hideVirtualKeyboard");
              }
            } catch(e) {}
          }
        }, 100);
      }
    };

    currentMf.addEventListener('input', onInputEvent);
    currentMf.addEventListener('keydown', onKeyDownEvent, { capture: true });
    currentMf.addEventListener('commit', onCommitEvent);
    currentMf.addEventListener('focusin', onFocusIn);
    currentMf.addEventListener('focusout', onFocusOut);
    currentMf.addEventListener('click', onClick);
    
    console.log('✅ [MathInput] Event listeners attached successfully.');

    cleanupEvents = () => {
      currentMf.removeEventListener('input', onInputEvent);
      currentMf.removeEventListener('keydown', onKeyDownEvent, { capture: true } as any);
      currentMf.removeEventListener('commit', onCommitEvent);
      currentMf.removeEventListener('focusin', onFocusIn);
      currentMf.removeEventListener('focusout', onFocusOut);
      currentMf.removeEventListener('click', onClick);
    };
    });

    return () => {
      isActive = false;
      if (cleanupEvents) cleanupEvents();
      
      try {
        if (mfRef.current) {
           const mvk = (window as any).mathVirtualKeyboard;
           if (mvk && mvk.activeMathfield === mfRef.current) mvk.activeMathfield = null;

           // THE FINAL SAFARI ZOMBIE KILLER:
           // In MathLive, `disconnectedCallback` automatically calls `dispose()`, 
           // which deletes `this.mathfield`. However, Safari's event loop delays focus events,
           // causing `onBlur` to fire AFTER the element is disconnected!
           // If `onBlur` fires after `dispose()`, it crashes looking for `this.mathfield.options`.
           // By shadowing `dispose()` with an empty function right before unmount, 
           // we intentionally leak the mathfield in memory so that the delayed `onBlur` 
           // has the context it needs to succeed without crashing!
           (mfRef.current as any).dispose = () => {}; 
           
           if (mfRef.current.executeCommand) mfRef.current.executeCommand("hideVirtualKeyboard");
        }
      } catch (e) {}
    };
  }, [isLoaded, level]);

  // 5. External Value Sync
  useEffect(() => {
    let isActive = true;

    // SYNCHRONOUS PREMATURE FOCUS SHIELD:
    // Safari fires native focus events the exact millisecond the element enters the DOM.
    // If MathLive hasn't finished hydrating, `this.mathfield` returns undefined and `onFocus` crashes.
    // Because `mathfield` is a read-only getter on the MathFieldElement prototype, standard assignment fails.
    // We forcefully shadow the getter on the instance to return a dummy object if the real one isn't ready!
    if (mfRef.current) {
      try {
        Object.defineProperty(mfRef.current, 'mathfield', {
          get: function() {
            // Return the real internal state if MathLive is ready, otherwise our crash-preventing dummy!
            return this._mathfield || { options: {} };
          },
          configurable: true
        });
      } catch(e) {}
    }

    // THE ULTIMATE SAFARI RACE CONDITION FIX (ZOMBIE IMMORTALITY):
    // Because `math-virtual-keyboard-policy="manual"`, MathLive intentionally caches the 
    // active mathfield globally. When React unmounts the element, Safari drops the blur event,
    // leaving MathLive's global cache pointing to a detached DOM node.
    // When the NEXT mathfield mounts and auto-focuses, MathLive triggers the native `blur` 
    // on the old, detached element. However, the element's `disconnectedCallback` already 
    // fired and deleted `this.mathfield`, causing `atomToString` to crash!
    // By shadowing `disconnectedCallback` on the instance, we forbid MathLive from deleting 
    // the internal memory state when React removes it. The mathfield becomes an immortal zombie,
    // allowing the delayed `blur` event to successfully serialize the data without crashing!
    if (mfRef.current) {
      (mfRef.current as any).disconnectedCallback = () => {};
    }

    customElements.whenDefined('math-field').then(() => {
      // SAFARI DOUBLE-BLUR FIX:
      // Safari interleaves `focusin` and `focusout` differently than Chrome when moving focus
      // directly between two mathfields (e.g. pressing Tab or Enter). This causes MathLive's
      // internal `onFocus` to manually trigger `onBlur` on the old field, followed instantly
      // by Safari's native `focusout` triggering `onBlur` again. The second `onBlur` call crashes
      // because the internal context (`this.mathfield`) was already torn down by the first call!
      // We monkey-patch the prototype to intercept and suppress this specific redundant crash.
      const MathFieldElement = customElements.get('math-field');
      if (MathFieldElement && !(MathFieldElement as any).__safariPatched) {
        (MathFieldElement as any).__safariPatched = true;
        
        const originalAddEventListener = MathFieldElement.prototype.addEventListener;
        MathFieldElement.prototype.addEventListener = function(type: string, listener: any, options: any) {
          if (typeof listener === 'function') {
            const wrappedListener = function(this: any, ...args: any[]) {
              try {
                return listener.apply(this, args);
              } catch (e: any) {
                if (e instanceof TypeError && e.message.includes('this.mathfield.options')) {
                  console.warn("🛡️ [MathInput] Suppressed redundant MathLive onBlur crash caused by Safari event interleaving.");
                  return; // Silently swallow the redundant crash
                }
                throw e; // Rethrow actual errors
              }
            };
            return originalAddEventListener.call(this, type, wrappedListener, options);
          }
          return originalAddEventListener.call(this, type, listener, options);
        };
      }
      setIsLoaded(true);
      if (!isActive) return;
      const mfe = mfRef.current;
      if (!mfe) return;

      // Check if the math-field or any of its internal parts have focus
      // Resilient check for Shadow DOM focus
      const isFocused = 
        document.activeElement === mfe || 
        mfe.contains(document.activeElement) ||
        (mfe.shadowRoot && mfe.shadowRoot.activeElement !== null);

      // Only update DOM if the value changed externally AND the user isn't typing.
      // Also check if mfe.value is strictly different to avoid cursor jumps
      if (!isFocused && value !== undefined) {
        try {
          if ((mfe.value + "") !== (value + "")) {
            console.log('🔄 [MathInput] Syncing external value:', value);
            mfe.value = value || "";
          }
        } catch (e) {
          console.warn('⚠️ [MathInput] Mathfield not fully initialized for value sync, retrying...', e);
          setTimeout(() => {
            if (isActive && mfRef.current) {
               try { mfRef.current.value = value || ""; } catch(err) {}
            }
          }, 100);
        }
      }
    });

    return () => {
      isActive = false;
    };
  }, [value, isLoaded]);

  useEffect(() => {
    if (isLoaded && autoFocus && mfRef.current) {
      const attemptFocus = () => {
        try {
          if (!mfRef.current) return; // Component unmounted while waiting

          // Check if an older mathfield from a previous question is STILL in the document
          // and holding focus. React 18 concurrent rendering can cause them to overlap!
          if (document.activeElement && 
              document.activeElement.tagName.toLowerCase() === 'math-field' && 
              document.activeElement !== mfRef.current) {
             
             // If it is still in the DOM, MathLive WILL crash if we call .focus() now.
             // We must wait for React to fully unmount the old one.
             console.warn("⚠️ [MathInput] Safari crash prevention: Waiting for old mathfield to unmount...");
             setTimeout(attemptFocus, 50); // Poll again in 50ms
             return;
          }

          // Guard against calling focus before MathLive internal setup
          if ((mfRef.current as any).mathVirtualKeyboard || (mfRef.current as any).executeCommand) {
            mfRef.current.focus();
          }
        } catch (e: any) {
          // Silently ignore: Auto-focus skipped safely.
        }
      };

      setTimeout(attemptFocus, 350); // Initial delay to wait for DOM hydration fully
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
            virtual-keyboard-toggle-visibility="hidden"
            math-virtual-keyboard-policy={isDesktop ? "manual" : "auto"}
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