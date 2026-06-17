'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function QuestionTable({ data }) {
  const router = useRouter();

  const handleGenerateBatch = async (row) => {
    const confirm = window.confirm(`Generate 5 new ${row.type} questions for ${row.level} ${row.topic}?`);
    if (!confirm) return;

    // Generate questions one-by-one to show progress in the UI counts
    for (let i = 0; i < 5; i++) {
      try {
        const res = await fetch('/api/admin/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            quantity: 1, 
            syllabus: row.level.match(/1|2/) ? 'P1_P2' : row.level.match(/3|4/) ? 'P3_P4' : 'P5_P6',
            metadata: { 
              level: row.level,
              topic: row.topic, 
              subtopic: row.subtopic, 
              type: row.type, 
              difficulty: row.difficulty,
              heuristic: row.heuristics?.[0] || row.topic 
            }
          }),
        });
        
        if (res.ok) {
          router.refresh(); // Update the counts in the table immediately
        }
      } catch (err) {
        console.error("Generation step failed:", err);
        break; // Stop loop on network error
      }
    }
  };

  const handleDeleteGenerated = async (row) => {
    const confirm = window.confirm(`Are you sure you want to delete ALL ${row.pending} pending questions in this category?`);
    if (!confirm) return;

    try {
      const params = new URLSearchParams({
        level: row.level,
        topic: row.topic,
        subtopic: row.subtopic || "",
        type: row.type,
        difficulty: row.difficulty,
        approved: "false"
      });

      const res = await fetch(`/api/admin/questions?${params.toString()}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert("Pending questions deleted.");
        router.refresh();
      }
    } catch (err) {
      alert("Failed to delete questions.");
    }
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200">
      <table className="w-full table-fixed divide-y divide-slate-200 text-left">
        <thead className="bg-slate-50">
          <tr>
            <th scope="col" className="w-[100px] whitespace-nowrap px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Level</th>
            <th scope="col" className="w-[200px] whitespace-nowrap px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Topic</th>
            <th scope="col" className="w-[200px] whitespace-nowrap px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Sub-topic</th>
            <th scope="col" className="w-[160px] whitespace-nowrap px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
            <th scope="col" className="w-[120px] whitespace-nowrap px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Difficulty</th>
            <th scope="col" className="w-[100px] whitespace-nowrap px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">To Review</th>
            <th scope="col" className="w-[100px] whitespace-nowrap px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Approved</th>
            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {data.map((row, idx) => (
            <tr key={idx} className={`hover:bg-slate-50 transition-colors ${row.needsGeneration ? 'bg-orange-50/50' : ''}`}>
              <td className="w-[100px] px-4 py-4 whitespace-nowrap text-sm font-bold text-slate-900 truncate">{row.level}</td>
              <td className="w-[200px] px-4 py-4 whitespace-nowrap text-sm text-slate-700 truncate">{row.topic}</td>
              <td className="w-[200px] px-4 py-4 whitespace-nowrap text-sm text-slate-500 truncate">{row.subtopic || '-'}</td>
              <td className="w-[160px] px-4 py-4 whitespace-nowrap text-sm text-slate-700 truncate">{row.type}</td>
              <td className="w-[120px] px-4 py-4 whitespace-nowrap text-sm text-slate-700 truncate">{row.difficulty}</td>
              <td className="w-[100px] px-4 py-4 whitespace-nowrap text-center">
                <span className={`px-2 py-1 text-xs font-black rounded-full ${row.pending > 0 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-400'}`}>
                  {row.pending}
                </span>
              </td>
              <td className="w-[100px] px-4 py-4 whitespace-nowrap text-center">
                <span className={`px-2 py-1 text-xs font-black rounded-full ${row.approved > 0 ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400'}`}>
                  {row.approved}
                </span>
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-right text-[12px] space-x-2">
                <button 
                  onClick={() => handleGenerateBatch(row)}
                  className="bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                  title="Generate 5 Questions"
                >
                  +5
                </button>
                
                <Link 
                  href={`/admin/questions/review?level=${row.level}&topic=${row.topic}&subtopic=${row.subtopic || ''}&type=${row.type}&difficulty=${row.difficulty}&approved=false`}
                  className="bg-amber-100 text-amber-600 px-2 py-1 rounded hover:bg-amber-200 transition-colors inline-block"
                  title="Review Pending Questions"
                >
                  ✎
                </Link>

                <Link 
                  href={`/admin/questions/review?level=${row.level}&topic=${row.topic}&subtopic=${row.subtopic || ''}&type=${row.type}&difficulty=${row.difficulty}&approved=true`}
                  className="bg-green-100 text-green-600 px-2 py-1 rounded hover:bg-green-200 transition-colors inline-block"
                  title="View Approved Questions"
                >
                  👁
                </Link>

                <button 
                  onClick={() => handleDeleteGenerated(row)}
                  className="bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200 transition-colors"
                  title="Delete Pending Questions"
                >
                  🗑
                </button>
              </td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr><td colSpan="8" className="px-3 py-4 text-center text-slate-500">No data matching these filters.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}