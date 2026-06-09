// Dictionary lookup engine for horizontal measurement styling mappings
export const HORIZONTAL_THEME_REGISTRY = {
  pencil: { styles: "bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 border-4 border-slate-900 rounded-l-xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]" },
  pen: { styles: "bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 border-4 border-slate-900 rounded-l-xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]" },
  paintbrush: { styles: "bg-gradient-to-r from-amber-800 via-amber-700 to-amber-900 relative border-4 border-slate-900 overflow-hidden shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]" },
  brush: { styles: "bg-gradient-to-r from-amber-800 via-amber-700 to-amber-900 relative border-4 border-slate-900 overflow-hidden shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]" },
  crayon: { styles: "bg-rose-500 border-y-4 border-rose-600 rounded-l-md relative border-4 border-slate-900 overflow-hidden shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]" },
  fork: { styles: "bg-gradient-to-r from-slate-200 to-slate-400 rounded-l-full border-4 border-slate-900 overflow-hidden shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]" },
  ribbon: { styles: "bg-gradient-to-b from-pink-400 to-pink-500 border-y-4 border-pink-600 border-x-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]" },
  straw: { styles: "rounded-md border-4 border-slate-900 overflow-hidden shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]" },
  chopstick: { styles: "bg-transparent flex flex-col justify-between py-1 gap-1.5" },
  
  // Custom styled comb theme parameters
  comb: { 
    styles: "bg-teal-500 rounded-r-md border-t-[12px] border-teal-600 relative border-4 border-slate-900 overflow-hidden shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]",
    teethStyle: {
      backgroundImage: 'linear-gradient(90deg, #0f172a 3px, transparent 3px)',
      backgroundSize: '12px 100%',
      width: '100%',
      height: '100%',
      position: 'absolute',
      top: '0', left: '0', opacity: '0.85'
    }
  }
};

// Auto-match lookup selector helper
export function lookupHorizontalTheme(label) {
  const norm = (label || '').toLowerCase();
  const matchedKey = Object.keys(HORIZONTAL_THEME_REGISTRY).find(key => norm.includes(key));
  return HORIZONTAL_THEME_REGISTRY[matchedKey] || null;
}