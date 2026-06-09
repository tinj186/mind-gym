import React, { useState } from 'react';

const TFMatrixTable = ({ statements = [], entities = [] }) => {
  // Local state to manage toggle selections for presentation
  const [selections, setSelections] = useState({});

  const handleToggle = (idx, val) => {
    setSelections(prev => ({ ...prev, [idx]: val }));
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto border-2 border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm my-4">
      
      {/* Entities Display Row (Top) */}
      {entities && entities.length > 0 && (
        <div className="flex flex-col md:flex-row p-6 bg-slate-50 border-b-2 border-slate-200 gap-6 justify-around items-center">
          {entities.map((ent, idx) => (
            <div key={`ent-${idx}`} className="flex flex-col items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100 min-w-[200px]">
              <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">
                {ent.count} {ent.name}
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {Array.from({ length: Number(ent.count) || 0 }).map((_, i) => (
                  <span key={i} className="text-4xl drop-shadow-sm select-none">
                    {ent.icon}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TF Matrix Table */}
      <div className="p-4 md:p-8 w-full overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[400px]">
          <thead>
            <tr>
              <th className="pb-4 pt-2 px-4 border-b-2 border-slate-200 text-slate-500 uppercase tracking-wider text-sm font-bold">
                Statement
              </th>
              <th className="pb-4 pt-2 px-4 border-b-2 border-slate-200 text-slate-500 uppercase tracking-wider text-sm font-bold text-center w-48">
                True / False
              </th>
            </tr>
          </thead>
          <tbody>
            {statements.map((stmt, idx) => {
              // Defensively handle both direct strings or object literals ({text, isTrue})
              const text = typeof stmt === 'object' ? stmt.text : stmt;
              
              return (
                <tr key={`stmt-${idx}`} className="hover:bg-slate-50 transition-colors">
                  <td className="py-5 px-4 border-b border-slate-100 text-slate-700 font-medium text-lg">
                    {text}
                  </td>
                  <td className="py-5 px-4 border-b border-slate-100 text-center">
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => handleToggle(idx, 'T')}
                        className={`px-4 py-2 rounded-lg font-bold transition-all focus:outline-none focus:ring-2 focus:ring-emerald-200 ${
                          selections[idx] === 'T' 
                            ? 'bg-emerald-500 text-white shadow-md' 
                            : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                        }`}
                      >
                        True
                      </button>
                      <button
                        onClick={() => handleToggle(idx, 'F')}
                        className={`px-4 py-2 rounded-lg font-bold transition-all focus:outline-none focus:ring-2 focus:ring-rose-200 ${
                          selections[idx] === 'F' 
                            ? 'bg-rose-500 text-white shadow-md' 
                            : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                        }`}
                      >
                        False
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default TFMatrixTable;
