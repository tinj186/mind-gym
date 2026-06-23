import React, { useState, useEffect } from 'react';
import MathInput from '@/components/math/MathInput';

export default function MultiStepInput({ steps, onSubmit, disabled, level }) {
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    setAnswers({});
  }, [steps]);

  const handleChange = (index, value) => {
    setAnswers(prev => ({ ...prev, [index]: value }));
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter') {
      // If last step, submit
      if (index === steps.length - 1) {
        handleSubmit();
      } else {
        // focus next
        const nextInput = document.getElementById(`multi-step-${index + 1}`);
        if (nextInput) {
          nextInput.focus();
        }
      }
    }
  };

  const handleSubmit = () => {
    onSubmit(answers);
  };

  if (!steps || steps.length === 0) return null;

  return (
    <div className="space-y-4 w-full">
      {steps.map((step, index) => (
        <div key={index} className="flex flex-col bg-slate-50 p-6 rounded-3xl border-2 border-slate-100">
          <label className="text-sm font-black text-slate-500 uppercase tracking-widest mb-4">
            {step.stepLabel || step.label}
          </label>
          <MathInput
            id={`multi-step-${index}`}
            value={answers[index] || ''}
            onChange={(val) => handleChange(index, val)}
            onEnter={() => handleKeyDown({ key: 'Enter' }, index)}
            disabled={disabled}
            autoFocus={index === 0}
            level={level}
          />
        </div>
      ))}
      <button 
        onClick={handleSubmit}
        disabled={disabled}
        className="w-full py-6 mt-4 bg-blue-600 text-white rounded-3xl font-black text-xl hover:bg-blue-700 transition-colors active:scale-95 disabled:opacity-50"
      >
        SUBMIT ALL STEPS
      </button>
    </div>
  );
}
