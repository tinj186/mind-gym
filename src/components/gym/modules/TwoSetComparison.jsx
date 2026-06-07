import React from 'react';

const TwoSetComparison = ({ setA, setB }) => {
  // Defensive fallbacks to prevent rendering crashes
  const countA = Number(setA?.count) || 0;
  const iconA = setA?.icon || '🍎';
  
  const countB = Number(setB?.count) || 0;
  const iconB = setB?.icon || '🍎';

  const itemsA = Array.from({ length: countA });
  const itemsB = Array.from({ length: countB });

  return (
    <div className="flex flex-col md:flex-row w-full max-w-4xl mx-auto border-2 border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm my-4">
      
      {/* Set A Container */}
      <div className="flex-1 flex flex-col p-6 border-b-2 md:border-b-0 md:border-r-2 border-slate-200 bg-slate-50">
        <h3 className="text-center font-bold text-slate-500 uppercase tracking-widest text-sm mb-6 bg-white py-2 rounded-lg shadow-sm border border-slate-100">
          Set A
        </h3>
        <div className="flex flex-wrap gap-4 justify-center items-center flex-grow min-h-[150px]">
          {itemsA.map((_, idx) => (
            <span 
              key={`a-${idx}`} 
              className="text-5xl sm:text-6xl drop-shadow-sm select-none transition-transform hover:scale-110"
            >
              {iconA}
            </span>
          ))}
        </div>
      </div>

      {/* Set B Container */}
      <div className="flex-1 flex flex-col p-6 bg-slate-50">
        <h3 className="text-center font-bold text-slate-500 uppercase tracking-widest text-sm mb-6 bg-white py-2 rounded-lg shadow-sm border border-slate-100">
          Set B
        </h3>
        <div className="flex flex-wrap gap-4 justify-center items-center flex-grow min-h-[150px]">
          {itemsB.map((_, idx) => (
            <span 
              key={`b-${idx}`} 
              className="text-5xl sm:text-6xl drop-shadow-sm select-none transition-transform hover:scale-110"
            >
              {iconB}
            </span>
          ))}
        </div>
      </div>
      
    </div>
  );
};

export default TwoSetComparison;
