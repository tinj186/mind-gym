import React from 'react';

export default function LongDivision({ data }) {
  if (!data || !data.dividend || !data.divisor) return null;
  const { dividend, divisor, quotient, remainder, steps, errorStepIndex, title } = data;

  const divStr = String(dividend).split('');
  let qPadded = [];
  if (quotient !== undefined && quotient !== null && String(quotient) !== '?') {
    qPadded = String(quotient).padStart(divStr.length, ' ').split('');
  } else {
    qPadded = Array(Math.max(0, divStr.length - 1)).fill(' ').concat(['?']);
  }

  const hasSteps = Array.isArray(steps) && steps.length > 0;
  const errIdx = typeof errorStepIndex === 'number' ? errorStepIndex : -1;

  const renderDigit = (ch, key, extraCls = '') => (
    <span
      key={key}
      className={`inline-flex items-center justify-center w-8 sm:w-10 h-10 font-mono text-2xl sm:text-3xl font-black rounded ${
        ch === '?' ? 'bg-amber-100 text-amber-800 border-2 border-dashed border-amber-400' : ''
      } ${extraCls}`}
    >
      {ch === ' ' ? '' : ch}
    </span>
  );

  return (
    <div className="w-full max-w-md mx-auto my-5 bg-white border-2 border-slate-200 rounded-3xl p-5 shadow-sm select-none">
      {title && (
        <div className="text-xs font-black uppercase tracking-wider text-slate-500 mb-3 text-center">
          {title}
        </div>
      )}

      <div className="flex justify-center items-center py-2 w-full font-mono text-slate-800">
        <table className="text-center border-spacing-0 border-collapse mx-auto">
          <tbody>
            {/* Quotient Row */}
            <tr>
              <td className="pr-3"></td>
              {divStr.map((_, i) => (
                <td key={i} className={`pb-1.5 ${i === 0 ? 'pl-3' : ''} ${i === divStr.length - 1 ? 'pr-2' : ''}`}>
                  {renderDigit(qPadded[i] || ' ', i, errIdx === -2 ? 'text-rose-700 bg-rose-100' : 'text-indigo-900')}
                </td>
              ))}
              {remainder !== undefined && remainder !== null && (
                <td className="pl-3 pb-1.5 text-left">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-xl bg-amber-50 border-2 border-amber-300 text-amber-800 text-base sm:text-lg font-black">
                    R {remainder}
                  </span>
                </td>
              )}
            </tr>

            {/* Divisor + Bracket + Dividend Row */}
            <tr>
              <td className="pr-3 pt-1.5 border-r-4 border-slate-800 text-right align-middle font-black text-2xl sm:text-3xl rounded-br-sm">
                {divisor}
              </td>
              {divStr.map((d, i) => (
                <td
                  key={i}
                  className={`pt-1.5 border-t-4 border-slate-800 font-black ${
                    i === 0 ? 'pl-3 rounded-tl-sm' : ''
                  } ${i === divStr.length - 1 ? 'pr-2' : ''}`}
                >
                  {renderDigit(d, i)}
                </td>
              ))}
              {remainder !== undefined && remainder !== null && <td />}
            </tr>

            {/* Optional Step-by-Step Partial Subtraction Rows */}
            {hasSteps &&
              steps.map((step, sIdx) => {
                const isErr = sIdx === errIdx;
                const subStr = String(step.subtract ?? '').padStart(divStr.length, ' ').split('');
                const remStr = String(step.bringDown ?? step.remainder ?? '').padStart(divStr.length, ' ').split('');
                return (
                  <React.Fragment key={sIdx}>
                    <tr className={isErr ? 'bg-rose-100 text-rose-800' : 'text-slate-600'}>
                      <td className="pr-3 text-right font-bold text-lg">−</td>
                      {subStr.map((c, ci) => (
                        <td key={ci} className={`border-b-2 border-slate-300 ${ci === 0 ? 'pl-3' : ''} ${ci === divStr.length - 1 ? 'pr-2' : ''}`}>
                          {renderDigit(c, ci)}
                        </td>
                      ))}
                      {remainder !== undefined && remainder !== null && <td />}
                    </tr>
                    {(step.bringDown !== undefined || step.remainder !== undefined) && (
                      <tr className={isErr ? 'bg-rose-50 text-rose-800' : 'text-slate-800'}>
                        <td />
                        {remStr.map((c, ci) => (
                          <td key={ci} className={`${ci === 0 ? 'pl-3' : ''} ${ci === divStr.length - 1 ? 'pr-2' : ''}`}>
                            {renderDigit(c, ci)}
                          </td>
                        ))}
                        {remainder !== undefined && remainder !== null && <td />}
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
