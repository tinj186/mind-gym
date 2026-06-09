export const LEVEL_THEMES = {
  // Junior: Bright, vibrant, playful
  junior: {
    headerTitle: 'Math Gym - Junior',
    primaryColor: 'text-sky-500',
    primaryBg: 'bg-sky-500',
    pageBg: 'bg-gradient-to-br from-sky-50 via-white to-emerald-50',
    statusBarTheme: 'bg-gradient-to-r from-sky-400 to-blue-500 text-white border-blue-700',
    zoneVariants: {
      blue: "bg-sky-50 border-sky-100 text-sky-900 hover:border-sky-400 hover:bg-sky-100",
      bluePrimary: "bg-sky-400 border-sky-500 text-white shadow-[0_20px_50px_-12px_rgba(56,189,248,0.5)] hover:-translate-y-2",
      amber: "bg-yellow-50 border-yellow-200 text-yellow-900 hover:border-yellow-400 hover:bg-yellow-100",
      amberPrimary: "bg-amber-400 border-amber-500 text-white shadow-[0_20px_50px_-12px_rgba(251,191,36,0.5)] hover:-translate-y-2",
      amberActive: "ring-[6px] ring-yellow-400 ring-offset-4 border-yellow-400 bg-white !text-slate-900",
      slate: "bg-red-50 border-red-200 text-red-900 hover:border-red-400 hover:bg-red-100",
      slatePrimary: "bg-rose-400 border-rose-500 text-white shadow-[0_20px_50px_-12px_rgba(251,113,133,0.5)] hover:-translate-y-2"
    }
  },
  // Intermediate: Structured, indigo/purple, clear
  intermediate: {
    headerTitle: 'Math Gym - Intermediate',
    primaryColor: 'text-indigo-500',
    primaryBg: 'bg-indigo-500',
    pageBg: 'bg-gradient-to-br from-indigo-50 via-white to-purple-50',
    statusBarTheme: 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-indigo-900',
    zoneVariants: {
      blue: "bg-indigo-50 border-indigo-200 text-indigo-900 hover:border-indigo-400 hover:bg-indigo-100",
      bluePrimary: "bg-indigo-500 border-indigo-600 text-white shadow-[0_20px_50px_-12px_rgba(99,102,241,0.5)] hover:-translate-y-2",
      amber: "bg-amber-50 border-amber-200 text-amber-900 hover:border-amber-400 hover:bg-amber-100",
      amberPrimary: "bg-purple-500 border-purple-600 text-white shadow-[0_20px_50px_-12px_rgba(168,85,247,0.5)] hover:-translate-y-2",
      amberActive: "ring-[6px] ring-amber-500 ring-offset-4 border-amber-500 bg-white !text-slate-900",
      slate: "bg-rose-50 border-rose-200 text-rose-900 hover:border-rose-400 hover:bg-rose-100",
      slatePrimary: "bg-fuchsia-500 border-fuchsia-600 text-white shadow-[0_20px_50px_-12px_rgba(217,70,239,0.5)] hover:-translate-y-2"
    }
  },
  // Senior: Sharp, sophisticated, charcoal/gold
  senior: {
    headerTitle: 'Math Gym - Senior / Advanced',
    primaryColor: 'text-amber-500', // Gold accent
    primaryBg: 'bg-amber-500',
    pageBg: 'bg-gradient-to-br from-slate-50 via-white to-amber-50',
    statusBarTheme: 'bg-gradient-to-r from-slate-800 to-slate-900 text-amber-400 border-amber-500',
    zoneVariants: {
      blue: "bg-slate-800 border-slate-700 text-slate-100 hover:border-slate-500 hover:bg-slate-700",
      bluePrimary: "bg-slate-900 border-amber-500 text-amber-400 shadow-[0_20px_50px_-12px_rgba(245,158,11,0.3)] hover:-translate-y-2",
      amber: "bg-slate-800 border-slate-700 text-slate-100 hover:border-amber-500 hover:bg-slate-700",
      amberPrimary: "bg-slate-800 border-slate-600 text-amber-500 shadow-[0_20px_50px_-12px_rgba(245,158,11,0.3)] hover:-translate-y-2",
      amberActive: "ring-[6px] ring-amber-500 ring-offset-4 border-amber-500 bg-slate-900 !text-amber-400",
      slate: "bg-slate-800 border-slate-700 text-slate-100 hover:border-rose-500 hover:bg-slate-700",
      slatePrimary: "bg-stone-900 border-stone-700 text-amber-600 shadow-[0_20px_50px_-12px_rgba(245,158,11,0.3)] hover:-translate-y-2"
    }
  }
};

export function getThemeForLevel(level = '') {
  const normalizedLevel = level.toLowerCase();
  
  if (normalizedLevel.includes('primary 1') || normalizedLevel.includes('primary 2') || normalizedLevel.includes('primary 3')) {
    return LEVEL_THEMES.junior;
  }
  
  if (normalizedLevel.includes('primary 4') || normalizedLevel.includes('primary 5')) {
    return LEVEL_THEMES.intermediate;
  }
  
  if (normalizedLevel.includes('primary 6')) {
    return LEVEL_THEMES.senior;
  }
  
  // Default fallback
  return LEVEL_THEMES.junior;
}

export function getDailyTargetReps(level = '') {
  const theme = getThemeForLevel(level);
  if (theme === LEVEL_THEMES.junior) return 10;
  if (theme === LEVEL_THEMES.intermediate) return 15;
  if (theme === LEVEL_THEMES.senior) return 20;
  return 10;
}
