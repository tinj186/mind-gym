"use client";
import Link from 'next/link';

export default function ZoneCard({ title, description, href, icon, variant, onClick, isActive }) {
  const variants = {
    blue: "bg-blue-50 border-blue-100 text-blue-900 hover:border-blue-500 shadow-blue-900/5",
    amber: "bg-amber-50 border-amber-100 text-amber-900 hover:border-amber-500 shadow-amber-900/5",
    slate: "bg-slate-50 border-slate-100 text-slate-900 hover:border-slate-500 shadow-slate-900/5"
  };

  const content = (
    <div className={`
      group relative p-10 rounded-[3.5rem] border-4 transition-all duration-300 active:scale-[0.98] h-full flex flex-col gap-6 cursor-pointer shadow-xl
      ${variants[variant] || variants.blue}
      ${isActive ? 'ring-4 ring-blue-500 ring-offset-4 border-blue-500 bg-white' : ''}
    `}>
      <div className="w-20 h-20 bg-white rounded-3xl shadow-inner flex items-center justify-center text-4xl border-2 border-slate-50">
        {icon}
      </div>
      
      <div className="space-y-2">
        <h3 className="text-3xl font-black tracking-tighter uppercase leading-none">{title}</h3>
        <p className="text-sm font-bold opacity-60 leading-relaxed max-w-[240px]">{description}</p>
      </div>

      <div className="mt-auto pt-4 flex items-center gap-3">
        <div className="h-px w-8 bg-current opacity-20" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Initialize</span>
        <span className="group-hover:translate-x-1 transition-transform">→</span>
      </div>
      
      {/* Ambient decorative element */}
      <div className="absolute top-8 right-8 text-6xl opacity-[0.03] font-black italic select-none">ZONE</div>
    </div>
  );

  if (href) {
    return <Link href={href} className="block h-full">{content}</Link>;
  }

  return <div onClick={onClick} className="h-full">{content}</div>;
}