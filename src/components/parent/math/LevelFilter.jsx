"use client";
import { useRouter, useSearchParams } from 'next/navigation';

export default function LevelFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentLevel = searchParams.get('level') || 'Overall';

  const handleLevelChange = (e) => {
    const newLevel = e.target.value;
    if (newLevel === 'Overall') {
      router.push('/parent/math');
    } else {
      router.push(`/parent/math?level=${encodeURIComponent(newLevel)}`);
    }
  };

  const levels = ['Overall', 'Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6'];

  return (
    <select 
      value={currentLevel}
      onChange={handleLevelChange}
      className="px-4 py-2 border-2 border-indigo-100 rounded-xl bg-white text-indigo-900 font-bold focus:outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50 transition-all text-sm tracking-widest cursor-pointer"
    >
      {levels.map(level => (
        <option key={level} value={level}>{level}</option>
      ))}
    </select>
  );
}
