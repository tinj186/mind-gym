'use client';

import { useState } from 'react'; // Corrected from useState

export default function QuestionRow({ question }) {
  const [approved, setApproved] = useState(question.isApproved);

  const toggleStatus = async () => {
    const newStatus = !approved;
    setApproved(newStatus); // Optimistic UI update

    try {
      // API Call to update the "QC" status in PostgreSQL
      await fetch(`/api/admin/questions/${question.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isApproved: newStatus }),
      });
    } catch (error) {
      console.error("Failed to update status:", error);
      setApproved(!newStatus); // Revert UI on failure
    }
  };

  return (
    <tr className="hover:bg-slate-50/50 transition-colors group">
      <td className="px-8 py-5">
        <button 
          onClick={toggleStatus}
          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter transition-all cursor-pointer ${
            approved 
              ? 'bg-green-100 text-green-700 border border-green-200' 
              : 'bg-amber-100 text-amber-700 border border-amber-200'
          }`}
        >
          {approved ? 'APPROVED' : 'PENDING'}
        </button>
      </td>
      <td className="px-8 py-5">
        <div className="font-bold text-slate-900 text-sm">{question.topic}</div>
        <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{question.level}</div>
      </td>
      <td className="px-8 py-5 text-sm text-slate-600 leading-relaxed font-medium">
        {question.question}
      </td>
      <td className="px-8 py-5 font-mono text-sm text-blue-600 font-bold">
        {question.finalAnswer}
      </td>
      <td className="px-8 py-5 text-right">
        <button className="text-slate-300 hover:text-slate-900 transition-colors p-2 font-bold text-xs">
          EDIT
        </button>
      </td>
    </tr>
  );
}