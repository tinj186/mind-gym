'use client';

export default function MathInput({ name, value, onChange }) {
  return (
    <div className="w-full max-w-sm mx-auto">
      <input 
        type="text" 
        name={name}
        value={value}
        onChange={onChange}
        placeholder="Type your answer..."
        className="w-full p-6 text-2xl font-bold text-center rounded-3xl bg-slate-50 border-2 border-slate-200 focus:border-blue-600 focus:bg-white outline-none transition-all shadow-inner"
      />
    </div>
  );
}