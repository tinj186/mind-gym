'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function GenerateModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [syllabus, setSyllabus] = useState('P5_P6');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const totalToGenerate = quantity;
    setIsGenerating(true);
    setError('');
    setIsOpen(false); // Close modal immediately so user can see the table counts increment

    for (let i = 0; i < totalToGenerate; i++) {
      try {
        const response = await fetch('/api/admin/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            quantity: 1, 
            syllabus,
            metadata: {
              level: 'Primary 1',
              topic: 'Whole Numbers - Numbers up to 100', // Default for bulk gen until UI expanded
              subtopic: '',
              type: 'MCQ',
              difficulty: 'Foundation',
            }
          }),
        });

        if (!response.ok) {
          console.error("❌ Generation failed for question", i);
        }
      } catch (err) {
        console.error("❌ Generation Error:", err);
        break;
      }
    }
    
    // Refresh the page data ONCE after all questions are done generating
    router.refresh();
    setIsGenerating(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg"
      >
        Generate Questions
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md space-y-6">
            <h3 className="text-2xl font-bold text-slate-800">Generate New Questions</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  disabled={isGenerating}
                />
              </div>
              <div>
                <label htmlFor="syllabus" className="block text-sm font-medium text-slate-700 mb-1">Syllabus Group</label>
                <select
                  id="syllabus"
                  value={syllabus}
                  onChange={(e) => setSyllabus(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  disabled={isGenerating}
                >
                  <option value="P1_P2">P1-P2</option>
                  <option value="P3_P4">P3-P4</option>
                  <option value="P5_P6">P5-P6</option>
                </select>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex justify-end space-x-3">
                <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors" disabled={isGenerating}>Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300" disabled={isGenerating}>
                  {isGenerating ? 'Generating...' : 'Generate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}