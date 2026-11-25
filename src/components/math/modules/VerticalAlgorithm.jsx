import React from 'react';

export default function VerticalAlgorithm({ data }) {
  if (!data) return null;

  // Grid mode: { multiplicand, multiplier, partialProducts, finalProduct, hiddenCells, errorRowIndex, carries, title }
  if (data.multiplicand !== undefined && data.multiplier !== undefined) {
    const multStr = String(data.multiplicand);
    const mprStr = String(data.multiplier);
    const partials = Array.isArray(data.partialProducts) ? data.partialProducts.map(String) : [];
    const finalStr = data.finalProduct !== undefined && data.finalProduct !== null ? String(data.finalProduct) : null;
    const errorRowIdx = typeof data.errorRowIndex === 'number' ? data.errorRowIndex : -1;
    const carries = Array.isArray(data.carries) ? data.carries : [];

    const maxCols = Math.max(
      multStr.length,
      mprStr.length + 1,
      ...partials.map((p) => p.length),
      finalStr ? finalStr.length : 0
    );

    const renderDigitsRow = (str, { operator = '', isError = false, isFinal = false } = {}) => {
      const padded = str.padStart(maxCols, ' ');
      return (
        <div
          className={`flex items-center justify-end gap-1 py-1 px-2 rounded-lg ${
            isError ? 'bg-rose-100 border-2 border-rose-400 text-rose-800' : ''
          }`}
        >
          <span className="w-6 text-center font-bold text-slate-500 select-none">{operator}</span>
          {padded.split('').map((ch, idx) => (
            <span
              key={idx}
              className={`w-7 sm:w-8 h-9 flex items-center justify-center font-mono text-2xl sm:text-3xl font-black rounded ${
                ch === '?'
                  ? 'bg-amber-100 text-amber-800 border-2 border-dashed border-amber-400'
                  : isError
                  ? 'text-rose-800'
                  : isFinal
                  ? 'text-indigo-900'
                  : 'text-slate-900'
              }`}
            >
              {ch === ' ' ? '' : ch}
            </span>
          ))}
        </div>
      );
    };

    return (
      <div className="w-full max-w-md mx-auto my-4 bg-white border-2 border-slate-200 rounded-3xl p-5 shadow-sm select-none">
        {data.title && (
          <div className="text-xs font-black uppercase tracking-wider text-slate-500 mb-3 text-center">
            {data.title}
          </div>
        )}
        <div className="flex justify-center">
          <div className="inline-flex flex-col items-end">
            {carries.length > 0 && (
              <div className="flex items-center justify-end gap-1 px-2 mb-0.5">
                <span className="w-6" />
                {carries.map((c, idx) => (
                  <span
                    key={idx}
                    className="w-7 sm:w-8 h-5 flex items-center justify-center text-xs font-black text-indigo-600 font-mono"
                  >
                    {c ? c : ''}
                  </span>
                ))}
              </div>
            )}

            {renderDigitsRow(multStr)}
            <div className="w-full border-b-4 border-slate-800 pb-1.5 mb-1.5">
              {renderDigitsRow(mprStr, { operator: '×' })}
            </div>

            {partials.map((p, idx) => (
              <div key={idx} className="w-full">
                {renderDigitsRow(p, {
                  operator: idx === partials.length - 1 && partials.length > 1 ? '+' : '',
                  isError: idx === errorRowIdx,
                })}
              </div>
            ))}

            {finalStr !== null && (
              <div className={`w-full ${partials.length > 0 ? 'border-t-4 border-slate-800 pt-1.5 mt-1' : ''}`}>
                {renderDigitsRow(finalStr, { isFinal: true })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Legacy items mode: ["45", "+", "13"]
  if (!data.items || data.items.length === 0) return null;

  const items = data.items;
  let rows = [];
  let currentOperator = '';

  for (let i = 0; i < items.length; i++) {
    const item = String(items[i]).trim();
    if (['+', '-', 'x', '÷', '*'].includes(item)) {
      currentOperator = item;
    } else {
      if (currentOperator) {
        rows.push({ operator: currentOperator, value: item });
        currentOperator = '';
      } else {
        rows.push({ operator: '', value: item });
      }
    }
  }

  return (
    <div className="flex justify-center items-center py-6 w-full font-mono text-4xl sm:text-5xl">
      <div className="flex flex-col items-end px-2">
        {rows.map((row, idx) => {
          const isAnswerPresent = rows.length > 1 && rows[rows.length - 1].operator === '';
          const borderIdx = isAnswerPresent ? rows.length - 2 : rows.length - 1;
          const hasBorder = idx === borderIdx;

          return (
            <div key={idx} className={`flex flex-row justify-between w-full min-w-[3ch] space-x-4 ${hasBorder ? 'border-b-4 border-slate-800 pb-2 mb-2' : ''}`}>
              <div className="text-slate-500 font-bold select-none">{row.operator}</div>
              <div className="text-slate-900 font-bold tracking-[0.25em] text-right">{row.value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
