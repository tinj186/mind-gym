import React from 'react';

export default function VerticalAlgorithm({ data }) {
  if (!data || !data.items || data.items.length === 0) return null;

  const items = data.items;
  
  // Format the rows based on the items array
  // Expected items: ["45", "+", "13"]
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
