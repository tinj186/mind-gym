'use client';

import Link from 'next/link';

export default function QuestionTable({ data }) {
  const handleGenerateBatch = async (row) => {
    const confirm = window.confirm(`Generate 5 new ${row.type} questions for ${row.level} ${row.topic}?`);
    if (!confirm) return;

    try {
      const res = await fetch('/api/admin/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          quantity: 5, 
          syllabus: row.level.match(/1|2/) ? 'P1_P2' : row.level.match(/3|4/) ? 'P3_P4' : 'P5_P6',
          metadata: { 
            level: row.level,
            topic: row.topic, 
            subtopic: row.subtopic, 
            type: row.type, 
            difficulty: row.difficulty,
            // Pass the primary heuristic for this topic as defined in the syllabus
            heuristic: row.heuristics?.[0] || row.topic 
          }
        }),
      });
      const result = await res.json();
      alert(result.message || "Generation initiated.");
    } catch (err) {
      alert("Failed to trigger generation.");
    }
  };

  const handleDeleteGenerated = async (row) => {
    const confirm = window.confirm(`Are you sure you want to delete ALL ${row.pending} pending questions in this category?`);
    if (!confirm) return;
    // Implementation would call a DELETE endpoint with the specific filters
    alert("Delete functionality requires a DELETE API implementation.");
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Level</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Topic</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Sub-topic</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Difficulty</th>
            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">To Review</th>
            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Approved</th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {data.map((row, idx) => (
            <tr key={idx} className={`hover:bg-slate-50 transition-colors ${row.needsGeneration ? 'bg-orange-50/50' : ''}`}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">{row.level}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{row.topic}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{row.subtopic || '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{row.type}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{row.difficulty}</td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <span className={`px-2 py-1 text-xs font-black rounded-full ${row.pending > 0 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-400'}`}>
                  {row.pending}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <span className={`px-2 py-1 text-xs font-black rounded-full ${row.approved > 0 ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400'}`}>
                  {row.approved}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-[10px] font-black space-x-1">
                <button 
                  onClick={() => handleGenerateBatch(row)}
                  className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 uppercase"
                  title="Generate 5 Questions"
                >
                  +5
                </button>
                
                <Link 
                  href={`/admin/questions/review?level=${row.level}&topic=${row.topic}&subtopic=${row.subtopic || ''}&type=${row.type}&difficulty=${row.difficulty}&approved=false`}
                  className="bg-amber-500 text-white px-2 py-1 rounded hover:bg-amber-600 uppercase inline-block"
                >
                  Review
                </Link>

                <Link 
                  href={`/admin/questions/review?level=${row.level}&topic=${row.topic}&subtopic=${row.subtopic || ''}&type=${row.type}&difficulty=${row.difficulty}&approved=true`}
                  className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 uppercase inline-block"
                >
                  View
                </Link>

                <button 
                  onClick={() => handleDeleteGenerated(row)}
                  className="bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200 uppercase"
                >
                  Del
                </button>
              </td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr><td colSpan="8" className="px-6 py-4 text-center text-slate-500">No data matching these filters.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}