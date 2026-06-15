"use client";

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';

export default function ProficiencyHeatmap({ data = [] }) {
  const [selectedData, setSelectedData] = useState(null);

  // Format data for Recharts
  const chartData = data.map(m => {
    let status = 'Needs Focus';
    let color = '#f43f5e'; // rose-500
    let isCalibrating = false;

    // Check Calibration Threshold
    if ((m.totalReps || 0) < 5) {
      status = 'Calibrating...';
      color = '#c7d2fe'; // indigo-200 (neutral/calibrating)
      isCalibrating = true;
    } else {
      if (m.synapseStrength >= 80) {
        status = 'Proficient';
        color = '#8b5cf6'; // violet-500
      } else if (m.synapseStrength >= 50) {
        status = 'Practicing';
        color = '#6366f1'; // indigo-500
      }
    }

    return {
      name: m.subtopic || m.topic,
      strength: m.synapseStrength || 0,
      reps: m.totalReps || 0,
      lastPracticed: m.updatedAt ? new Date(m.updatedAt).toLocaleDateString() : 'N/A',
      status,
      color,
      isCalibrating,
      metrics: m.fluencyMetrics
    };
  });

  return (
    <section className="space-y-8">
      <h2 className="text-2xl font-black tracking-tight flex items-center gap-3 text-indigo-950 uppercase">
        <span className="w-8 h-8 bg-indigo-100 text-indigo-900 flex items-center justify-center rounded-lg text-sm">01</span>
        Proficiency Heatmap
      </h2>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Chart Area */}
        <div className="flex-grow p-8 bg-white border border-indigo-100 rounded-[2.5rem] shadow-sm">
          {chartData.length > 0 ? (
            <div className="h-96 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                  <XAxis type="number" domain={[0, 100]} hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#312e81', fontWeight: 700, fontSize: 12, textTransform: 'uppercase' }} 
                    width={150} 
                  />
                  <Bar 
                    dataKey="strength" 
                    radius={[0, 8, 8, 0]} 
                    barSize={32}
                    onClick={(data) => setSelectedData(data.payload || data)}
                    cursor="pointer"
                  >
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color} 
                        className="transition-all hover:opacity-80"
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-96 flex items-center justify-center border-4 border-dashed border-indigo-50 rounded-[2rem] text-center text-indigo-900/40 font-bold uppercase tracking-widest">
              No Syllabus Data Recorded
            </div>
          )}
        </div>

        {/* Static Details Panel */}
        <div className="w-full lg:w-96 flex-shrink-0">
          {selectedData ? (
            <div className="p-8 bg-indigo-950 text-white rounded-[2.5rem] shadow-lg h-full flex flex-col">
              <p className="font-black text-xl uppercase tracking-tight mb-6">{selectedData.name}</p>
              
              <div className="space-y-4 font-mono text-sm tracking-widest text-indigo-200 mb-8 flex-grow">
                <div>
                  <p className="text-[10px] text-indigo-400 mb-1">CONFIDENCE</p>
                  <p className={`text-2xl ${selectedData.isCalibrating ? 'text-indigo-400' : 'text-white'}`}>
                    {selectedData.isCalibrating ? 'CALIBRATING' : `${selectedData.strength}%`}
                  </p>
                </div>
                
                {selectedData.metrics && (
                  <div className="pl-4 border-l-2 border-indigo-800 my-4 py-2 space-y-2">
                    <p>CORRECTNESS: <span className="text-white">{selectedData.metrics.correctness}%</span></p>
                    <p>EFFICIENCY: <span className="text-white">{selectedData.metrics.efficiency}%</span></p>
                    <p>CONSISTENCY: <span className="text-white">{selectedData.metrics.consistency}%</span></p>
                  </div>
                )}
                
                <div>
                  <p className="text-[10px] text-indigo-400 mb-1">REPETITIONS</p>
                  <p className="text-white">{selectedData.reps}</p>
                </div>
                
                <div>
                  <p className="text-[10px] text-indigo-400 mb-1">LAST PRACTICED</p>
                  <p className="text-white">{selectedData.lastPracticed}</p>
                </div>
              </div>
              
              <div className="mt-auto space-y-3 text-xs font-bold bg-indigo-900/50 p-6 rounded-[1.5rem]">
                <p className="uppercase text-indigo-300 border-b border-indigo-800 pb-2 mb-3 tracking-widest text-[10px]">What does this mean?</p>
                <p className="text-indigo-400">&lt; 5 Reps: Calibrating</p>
                <p className="text-violet-400">≥ 80%: Proficient</p>
                <p className="text-indigo-300">50-79%: Practicing</p>
                <p className="text-rose-400">&lt; 50%: Needs Focus</p>
              </div>
            </div>
          ) : (
            <div className="p-8 bg-indigo-50/50 border border-indigo-100 rounded-[2.5rem] h-full flex flex-col items-center justify-center text-center text-indigo-900/40">
              <div className="text-4xl mb-4">👆</div>
              <p className="font-bold uppercase tracking-widest text-sm">Click any bar</p>
              <p className="text-xs font-medium mt-2">to view detailed analytics</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
