'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import BarModel from '@/components/gym/BarModel/BarModel';
import MathInput from '@/components/gym/MathInput';
import Link from 'next/link';
import { serializeModel, generateId } from '@/types/gym';

export default function TrainingPage() {
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [error, setError] = useState(null);
  
  const [activeEdit, setActiveEdit] = useState(null); // { rowId, segId, value }
  const [isAddingRow, setIsAddingRow] = useState(false);
  const [newRowTitle, setNewRowTitle] = useState('');
  const [isComparing, setIsComparing] = useState(false);
  const [compareSelection, setCompareSelection] = useState([]);
  // Phase 2.1: Interactive Bar State
  const [rows, setRows] = useState([
    { 
      id: "ali", 
      title: "ALI", 
      segments: [{ id: "s1", value: 1, label: "", isUnknown: false, color: "bg-blue-500" }] 
    }
  ]);
  const [brackets, setBrackets] = useState([]);

  const router = useRouter();

  useEffect(() => {
    console.log('🔄 [TrainingPage] Current Answer State:', answer);
  }, [answer]);

  useEffect(() => {
    console.log('🚀 Training Client Hydrated');
    setIsMounted(true);
  }, []);

  // Mock data for current validation - this will be replaced by dynamic data later
  const currentQuestionId = "seed-q1"; 
  const questionText = "Express 13/4 as a mixed number in its simplest form.";
  
  const handleSubmit = useCallback(async (e) => {
    // 1. Prevent browser default behavior
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    
    // 2. Prevent double-submission
    if (isSubmitting) return;

    // 3. Validate input
    if (!answer || answer.trim() === '') {
      console.log('⚠️ [TrainingPage] Submit blocked: Answer state is currently:', JSON.stringify(answer));
      alert(`Please enter an answer before submitting! (Current state: "${answer}")`);
      return;
    }
    
    console.log('🚀 [TrainingPage] Starting Submission:', { id: currentQuestionId, answer });
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          questionId: currentQuestionId, 
          studentAnswer: answer,
          modelDescription: serializeModel(rows, brackets, questionText)
        }),
      });

      if (!response.ok) throw new Error(`Server returned ${response.status}`);

      const result = await response.json();
      console.log('📊 [TrainingPage] Grading Result:', result);

      if (result.isCorrect) {
        console.log('✅ Correct! Navigating to summary...');
        router.push('/train/summary');
      } else {
        console.log('❌ Incorrect answer.');
        alert(result.hint || "Incorrect answer. Check your calculation and try again!");
        setError(result.hint || "Incorrect answer.");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("❌ [TrainingPage] Submission failed:", error);
      alert("Connection error. Please check your network and try again.");
      setIsSubmitting(false);
    }
  }, [answer, currentQuestionId, router, isSubmitting, rows, brackets]);

  // Stable reference for the change handler
  const handleInputChange = useCallback((val) => {
    // Ensure we only update if the value actually changed to prevent cursor jumps
    setAnswer(prev => prev === val ? prev : val);
  }, []);

  // Bar Model Interaction Handlers
  const handleAddRow = () => {
    setIsAddingRow(true);
    setNewRowTitle('');
  };

  const confirmAddRow = () => {
    const title = newRowTitle.trim() || `ENTITY ${String.fromCharCode(65 + (rows.length % 26))}`;
    const units = 1;
    const newRow = {
      id: generateId('row'),
      title: title.toUpperCase(),
      segments: [{ id: generateId('seg'), value: units, label: "", isUnknown: false, color: "bg-blue-500" }]
    };
    setRows([...rows, newRow]);
    setIsAddingRow(false);
    setNewRowTitle('');
  };

  const handleAddUnit = (rowId) => {
    setRows(rows.map(row => {
      if (row.id !== rowId) return row;
      return {
        ...row,
        segments: [...row.segments, { 
          id: generateId('seg'), 
          value: 1, 
          label: "", 
          isUnknown: false, 
          color: row.segments[0]?.color || "bg-blue-500" 
        }]
      };
    }));
  };

  const handleRemoveUnit = (rowId) => {
    setRows(rows.map(row => {
      if (row.id !== rowId) return row;
      // Ensure we always keep at least one segment
      if (row.segments.length <= 1) return row;
      return {
        ...row,
        segments: row.segments.slice(0, -1)
      };
    }));
  };

  const handleSegmentClick = (rowId, segId) => {
    const row = rows.find(r => r.id === rowId);
    const seg = row?.segments.find(s => s.id === segId);
    if (seg) {
      setActiveEdit({ rowId, segId, value: seg.label || '' });
    }
  };

  const handleSaveEdit = () => {
    if (!activeEdit) return;
    
    setRows(rows.map(row => {
      if (row.id !== activeEdit.rowId) return row;
      return {
        ...row,
        segments: row.segments.map(seg => {
          if (seg.id !== activeEdit.segId) return seg;
          const cleanVal = activeEdit.value.trim();
          return { ...seg, isUnknown: cleanVal === '?', label: cleanVal };
        })
      };
    }));
    setActiveEdit(null);
  };

  const handleEditChange = (e) => {
    const val = e.target.value;
    // Security Requirement: Numbers, spaces, or '?' only
    if (/^[0-9? ]*$/.test(val)) {
      setActiveEdit(prev => ({ ...prev, value: val }));
    }
  };

  const handleCompareRows = () => {
    if (rows.length < 2) {
      alert("You need at least two entities to create a comparison!");
      return;
    }
    setIsComparing(true);
    setCompareSelection([]);
  };

  const confirmComparison = () => {
    if (compareSelection.length !== 2) return;
    const [id1, id2] = compareSelection;
    const row1 = rows.find(r => r.id === id1);
    const row2 = rows.find(r => r.id === id2);
    
    if (row1 && row2) {
      setBrackets([...brackets, {
        id: generateId('brkt'),
        fromBarId: row1.id,
        toBarId: row2.id,
        differenceLabel: "0" // Rendered dynamically in BarModel
      }]);
    }
    setIsComparing(false);
    setCompareSelection([]);
  };

  const handleJoin = (rowId) => {
    setRows(rows.map(row => {
      if (row.id !== rowId || row.segments.length <= 1) return row;
      
      const totalValue = row.segments.reduce((acc, s) => acc + s.value, 0);
      return {
        ...row,
        segments: [{
          id: generateId('seg'),
          value: totalValue,
          label: "", 
          isUnknown: row.segments.some(s => s.isUnknown),
          color: row.segments[0]?.color || "bg-blue-500"
        }]
      };
    }));
  };

  const handleDeleteBracket = (bracketId) => {
    setBrackets(brackets.filter(b => b.id !== bracketId));
  };

  const handleSplit = (rowId) => {
    setRows(rows.map(row => {
      if (row.id !== rowId) return row;
      // "Scissors" Tool: Split any segment with value > 1 into individual unit blocks
      const newSegments = row.segments.flatMap(seg => {
        if (seg.value <= 1) return seg;
        return Array.from({ length: Math.floor(seg.value) }, () => ({
          ...seg,
          id: generateId('seg'),
          value: 1,
          label: ""
        }));
      });
      return { ...row, segments: newSegments };
    }));
  };

  const handleEnter = useCallback(() => {
    handleSubmit();
  }, [handleSubmit]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <nav className="px-8 py-6 flex justify-between items-center border-b border-slate-100">
        <Link href="/gym" className="text-slate-400 hover:text-slate-900">✕</Link>
        <div className="flex-1 max-w-md mx-12 h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 w-[10%]" />
        </div>
        <div className="w-10 h-10 bg-slate-100 rounded-full" />
      </nav>

      <main className="flex-1 flex flex-col items-center py-12 px-6">
        <div className="w-full max-w-3xl space-y-12">
          <section className="text-center">
            <h2 className="text-3xl font-bold text-slate-900">
              {questionText}
            </h2>
          </section>

          <section className="bg-slate-50 rounded-[3rem] p-10 border border-slate-100 relative">
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Logic Canvas</h3>
               <div className="flex gap-2">
                 <button onClick={handleCompareRows} className="px-4 py-2 bg-amber-500 text-white text-[10px] font-black uppercase rounded-xl hover:bg-amber-600 transition-colors shadow-lg">
                   Compare Entities
                 </button>
                 <button onClick={handleAddRow} className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase rounded-xl hover:bg-blue-600 transition-colors shadow-lg">
                   + Add Entity
                 </button>
               </div>
             </div>

             {isAddingRow && (
               <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/10 backdrop-blur-[2px] rounded-[3rem]">
                 <div className="bg-white p-6 rounded-2xl shadow-2xl border border-slate-200 flex flex-col gap-4 w-64 animate-in zoom-in-95 duration-200">
                   <label className="text-[10px] font-black text-slate-400 uppercase">Entity Name (e.g. Ali)</label>
                   <input 
                     autoFocus
                     className="text-2xl font-bold text-center border-b-2 border-blue-500 focus:outline-none"
                     value={newRowTitle}
                     onChange={(e) => {
                        // Allow alphanumeric and spaces for names
                        if (/^[a-zA-Z0-9 ]*$/.test(e.target.value)) setNewRowTitle(e.target.value);
                     }}
                     onKeyDown={(e) => e.key === 'Enter' && confirmAddRow()}
                   />
                   <div className="flex gap-2">
                     <button 
                       onClick={() => setIsAddingRow(false)}
                       className="flex-1 py-2 text-[10px] font-black uppercase text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                     >
                       Cancel
                     </button>
                     <button 
                       onClick={confirmAddRow}
                       className="flex-1 py-2 text-[10px] font-black uppercase bg-slate-900 text-white rounded-lg hover:bg-blue-600 transition-colors"
                     >
                       Create
                     </button>
                   </div>
                 </div>
               </div>
             )}

             {isComparing && (
               <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/10 backdrop-blur-[2px] rounded-[3rem]">
                 <div className="bg-white p-6 rounded-2xl shadow-2xl border border-slate-200 flex flex-col gap-4 w-80 animate-in zoom-in-95 duration-200">
                   <div className="space-y-1 text-center">
                     <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Step 1: Select 2 Entities</h4>
                     <p className="text-xs text-slate-500">Pick the bars you want to compare</p>
                   </div>
                   <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                     {rows.map(row => (
                       <button
                         key={row.id}
                         onClick={() => {
                           setCompareSelection(prev => 
                             prev.includes(row.id) 
                               ? prev.filter(id => id !== row.id) 
                               : prev.length < 2 ? [...prev, row.id] : [prev[1], row.id]
                           );
                         }}
                         className={`p-3 rounded-xl border-2 text-left font-black transition-all ${
                           compareSelection.includes(row.id)
                             ? 'border-amber-500 bg-amber-50 text-amber-700'
                             : 'border-slate-100 hover:border-slate-200 text-slate-900'
                         }`}
                       >
                         {row.title}
                       </button>
                     ))}
                   </div>
                   <div className="flex gap-2">
                     <button 
                       onClick={() => setIsComparing(false)}
                       className="flex-1 py-2 text-[10px] font-black uppercase text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                     >
                       Cancel
                     </button>
                     <button 
                       onClick={confirmComparison}
                       disabled={compareSelection.length !== 2}
                       className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-colors ${
                         compareSelection.length === 2 
                           ? 'bg-amber-500 text-white hover:bg-amber-600' 
                           : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                       }`}
                     >
                       Compare
                     </button>
                   </div>
                 </div>
               </div>
             )}

             {activeEdit && (
               <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/10 backdrop-blur-[2px] rounded-[3rem]">
                 <div className="bg-white p-6 rounded-2xl shadow-2xl border border-slate-200 flex flex-col gap-4 w-64 animate-in zoom-in-95 duration-200">
                   <label className="text-[10px] font-black text-slate-400 uppercase">Set Label (?, or number)</label>
                   <input 
                     autoFocus
                     className="text-2xl font-bold text-center border-b-2 border-blue-500 focus:outline-none"
                     value={activeEdit.value}
                     onChange={handleEditChange}
                     onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                   />
                   <div className="flex gap-2">
                     <button 
                       onClick={() => setActiveEdit(null)}
                       className="flex-1 py-2 text-[10px] font-black uppercase text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                     >
                       Cancel
                     </button>
                     <button 
                       onClick={handleSaveEdit}
                       className="flex-1 py-2 text-[10px] font-black uppercase bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                     >
                       Save
                     </button>
                   </div>
                 </div>
               </div>
             )}

             <BarModel 
               rows={rows}
               brackets={brackets}
               onAddUnit={handleAddUnit}
               onRemoveUnit={handleRemoveUnit}
               onSplit={handleSplit}
               onJoin={handleJoin}
               onSegmentClick={handleSegmentClick}
               onDeleteRow={(id) => setRows(rows.filter(r => r.id !== id))}
               onDeleteBracket={handleDeleteBracket}
             />
          </section>

          {/* 
            Removed action={formAction} to prevent conflict between 
            Server Action redirect and client-side router.push
          */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Hidden field to pass the question ID to the Server Action */}
            <input type="hidden" name="questionId" value={currentQuestionId} />
            
            {/* Display Error Message */}
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-center font-bold animate-in fade-in slide-in-from-top-2">
                ⚠️ {error}
              </div>
            )}

            <div className="flex flex-col items-center">
              <MathInput 
                name="answer" 
                value={answer} 
                onChange={handleInputChange} 
                onEnter={handleEnter}
              />
            </div>
            <button 
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-6 rounded-3xl font-black text-xl shadow-2xl transition-all ${
                isSubmitting 
                  ? 'bg-slate-400 cursor-not-allowed' 
                  : 'bg-slate-900 hover:bg-blue-600 text-white active:scale-95'
              }`}
            >
              {isSubmitting ? 'VALIDATING...' : 'SUBMIT REP'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}