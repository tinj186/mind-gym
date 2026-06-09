"use client";
import Link from 'next/link';

export default function ZoneCard({ title, description, href, icon, variant, onClick, isActive, isPrimary, themeVariants, resumeProgress, isLocked }) {
  const defaultVariants = {
    blue: "bg-sky-50 border-sky-100 text-sky-900 hover:border-sky-400 hover:bg-sky-100",
    amber: "bg-yellow-50 border-yellow-200 text-yellow-900 hover:border-yellow-400 hover:bg-yellow-100",
    slate: "bg-red-50 border-red-200 text-red-900 hover:border-red-400 hover:bg-red-100"
  };

  const variants = themeVariants || defaultVariants;

  const content = (
    <div className={`
      group relative p-12 rounded-[3rem] border-[6px] transition-all duration-300 active:scale-[0.98] h-full flex flex-col items-center justify-center gap-8 text-center font-sans
      ${isLocked 
        ? 'bg-slate-50 border-slate-200 text-slate-400 grayscale opacity-70 cursor-not-allowed'
        : `cursor-pointer ${isPrimary ? variants[`${variant}Primary`] || 'bg-sky-400 border-sky-500 text-white shadow-[0_20px_50px_-12px_rgba(56,189,248,0.5)] hover:-translate-y-2' : `${variants[variant] || variants.blue} shadow-[0_15px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1`}`
      }
      ${isActive && !isLocked ? variants[`${variant}Active`] || 'ring-[6px] ring-yellow-400 ring-offset-4 border-yellow-400 bg-white !text-slate-900' : ''}
    `}>
      <div className={`w-32 h-32 rounded-[2rem] shadow-sm flex items-center justify-center text-7xl border-4 ${isPrimary ? 'bg-sky-300 border-sky-400 text-white' : 'bg-white border-white/50'}`}>
        {icon}
      </div>
      
      <div className="space-y-4">
        <h3 className="text-4xl font-black tracking-tight uppercase leading-tight">{title}</h3>
        {description && <p className={`text-xl font-bold opacity-80 leading-relaxed max-w-[240px]`}>{description}</p>}
      </div>

      <div className={`mt-4 flex items-center gap-4 px-6 py-3 rounded-full transition-all ${
        isLocked ? 'bg-slate-200 text-slate-500' : 
        resumeProgress ? 'bg-amber-100 text-amber-900 border-2 border-amber-300 ring-2 ring-amber-400 ring-offset-2 animate-pulse shadow-md' : 'bg-black/5'
      }`}>
        <span className="text-sm font-black uppercase tracking-widest">
          {isLocked ? "🔒 Session In Progress" : resumeProgress ? `Resume (${resumeProgress}/10)` : "Let's Go!"}
        </span>
        {!isLocked && <span className="group-hover:translate-x-2 transition-transform text-xl">→</span>}
      </div>
    </div>
  );

  const handleClick = (e) => {
    if (isLocked) {
      e.preventDefault();
      return;
    }
    sessionStorage.setItem('allow_workout', 'true');
    if (onClick) onClick(e);
  };

  if (href && !isLocked) {
    return <Link href={href} onClick={handleClick} className="block h-full">{content}</Link>;
  }

  return <div onClick={handleClick} className="h-full">{content}</div>;
}