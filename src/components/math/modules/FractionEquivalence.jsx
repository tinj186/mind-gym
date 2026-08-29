import React from 'react';

export default function FractionEquivalence({ data }) {
  if (!data) return null;
  const { before, after, operator = '÷', factor, final, operator2 = '÷', factor2 } = data;

  const renderArrow = (op, fac, isTop) => (
    <div className={`w-28 border-l-2 border-r-2 border-slate-300 relative ${isTop ? 'border-t-2 rounded-t-xl mb-1 mt-1 h-4' : 'border-b-2 rounded-b-xl mt-1 mb-1 h-4'}`}>
      <div 
        className={`absolute w-2.5 h-2.5 border-slate-300 transform rotate-45 ${isTop ? 'border-b-2 border-r-2' : 'border-t-2 border-l-2'}`}
        style={isTop ? { right: '-4px', bottom: '-1px' } : { right: '-4px', top: '-1px' }}
      ></div>
    </div>
  );

  const renderOperatorBox = (op, fac, isTop) => (
    <div className={`flex items-center justify-center bg-white border-2 border-slate-200 text-slate-600 font-bold px-4 py-1 rounded-full shadow-sm text-sm z-10 ${isTop ? 'mb-2' : 'mt-2'}`}>
      {op} {fac}
    </div>
  );

  const getBgClass = (colorClass) => {
    if (colorClass.includes('slate')) return 'bg-slate-800';
    if (colorClass.includes('emerald')) return 'bg-emerald-600';
    if (colorClass.includes('violet')) return 'bg-violet-600';
    return 'bg-current';
  };

  const renderFraction = (frac, colorClass) => (
    <div className={`flex flex-col items-center justify-center text-3xl font-black ${colorClass}`}>
      <div className="mb-2">{frac?.num}</div>
      <div className={`w-8 h-1 rounded-full flex-shrink-0 ${getBgClass(colorClass)}`}></div>
      <div className="mt-2">{frac?.denom}</div>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-[2rem] border-2 border-slate-100 max-w-2xl mx-auto w-full font-sans overflow-x-auto">
      
      <div className="flex items-center justify-center min-w-max">
        {/* First block */}
        <div className="flex flex-col items-center relative">
          {renderOperatorBox(operator, factor, true)}
          {renderArrow(operator, factor, true)}
          
          <div className="flex items-center justify-center gap-4 px-2 py-2">
            <div className="w-12 flex justify-center">
              {renderFraction(before, 'text-slate-800')}
            </div>
            <div className="text-3xl font-black text-slate-400 w-8 text-center">=</div>
            <div className="w-12 flex justify-center">
              {renderFraction(after, 'text-emerald-600')}
            </div>
          </div>
          
          {renderArrow(operator, factor, false)}
          {renderOperatorBox(operator, factor, false)}
        </div>

        {/* Optional Second Block */}
        {final && (
          <>
            <div className="flex flex-col items-center ml-2 relative">
              {renderOperatorBox(operator2, factor2, true)}
              {renderArrow(operator2, factor2, true)}
              
              <div className="flex items-center justify-center gap-4 px-2 py-2">
                <div className="text-3xl font-black text-slate-400 w-8 text-center">=</div>
                <div className="w-12 flex justify-center">
                  {renderFraction(final, 'text-violet-600')}
                </div>
              </div>
              
              {renderArrow(operator2, factor2, false)}
              {renderOperatorBox(operator2, factor2, false)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
