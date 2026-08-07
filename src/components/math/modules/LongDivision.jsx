import React from 'react';

export default function LongDivision({ data }) {
  if (!data || !data.dividend || !data.divisor) return null;
  const { dividend, divisor, quotient } = data;
  
  const divStr = String(dividend).split("");
  
  // Create padded quotient array to match dividend length for alignment
  let qPadded = [];
  if (quotient !== undefined && quotient !== "?") {
     qPadded = String(quotient).padStart(divStr.length, ' ').split("");
  } else {
     qPadded = Array(divStr.length - 1).fill(' ').concat(["?"]);
  }

  return (
    <div className="flex justify-center items-center py-6 w-full font-mono text-5xl sm:text-6xl text-slate-800">
      <table className="text-center border-spacing-0 border-collapse mx-auto">
        <tbody>
          {/* Quotient Row */}
          <tr>
            <td className="pr-4"></td>
            {divStr.map((_, i) => (
               <td key={i} className={`pb-2 ${i === 0 ? 'pl-4' : ''} ${i === divStr.length - 1 ? 'pr-4' : ''}`}>
                 {qPadded[i] || ' '}
               </td>
            ))}
          </tr>
          {/* Bracket and Dividend Row */}
          <tr>
            <td className="pr-4 pt-2 border-r-4 border-slate-800 text-right align-middle font-bold rounded-br-sm">
              {divisor}
            </td>
            {divStr.map((d, i) => (
               <td key={i} className={`pt-2 border-t-4 border-slate-800 font-bold ${i === 0 ? 'pl-4 rounded-tl-sm' : ''} ${i === divStr.length - 1 ? 'pr-4' : ''}`}>
                 {d}
               </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
