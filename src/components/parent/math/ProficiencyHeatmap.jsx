"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';

export default function ProficiencyHeatmap({ data = [] }) {
  // Format data for Recharts
  const chartData = data.map(m => {
    let status = 'Needs Focus';
    let color = '#f43f5e'; // rose-500
    let isCalibrating = false;

    // Check Calibration Threshold
    if ((m.totalReps || 0) < 5) {
      status = 'Calibrating...';
      color = '#94a3b8'; // slate-400 (neutral gray)
      isCalibrating = true;
    } else {
      if (m.synapseStrength >= 80) {
        status = 'Proficient';
        color = '#22c55e'; // green-500
      } else if (m.synapseStrength >= 50) {
        status = 'Practicing';
        color = '#eab308'; // yellow-500
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

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-4 rounded-xl border-4 border-slate-700 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-xs">
          <p className="font-black text-lg uppercase mb-3">{label}</p>
          
          <div className="space-y-1 font-mono text-sm tracking-widest text-slate-300 mb-4">
            <p>
              CONFIDENCE: <span className={data.isCalibrating ? 'text-slate-400' : 'text-white'}>
                {data.isCalibrating ? 'CALIBRATING' : `${data.strength}%`}
              </span>
            </p>
            {data.metrics && (
              <div className="pl-4 border-l-2 border-slate-700 my-2 text-xs">
                <p>CORRECTNESS: {data.metrics.correctness}%</p>
                <p>EFFICIENCY: {data.metrics.efficiency}%</p>
                <p>CONSISTENCY: {data.metrics.consistency}%</p>
              </div>
            )}
            <p>REPETITIONS: {data.reps}</p>
            <p>LAST PRACTICED: {data.lastPracticed}</p>
          </div>
          
          <div className="space-y-2 text-xs font-bold bg-slate-800 p-3 rounded-lg">
            <p className="uppercase text-slate-300 border-b border-slate-700 pb-1 mb-2">What does this mean?</p>
            <p className="text-slate-400">&lt; 5 Reps: Calibrating (Gathering data)</p>
            <p className="text-green-400">≥ 80%: Proficient (Mastered concept)</p>
            <p className="text-yellow-400">50-79%: Practicing (Forming pathways)</p>
            <p className="text-rose-400">&lt; 50%: Needs Focus (Actionable bottleneck)</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <section className="space-y-8">
      <h2 className="text-2xl font-black tracking-tight flex items-center gap-3 text-slate-900 uppercase">
        <span className="w-8 h-8 bg-slate-900 text-white flex items-center justify-center rounded-lg text-sm">01</span>
        Proficiency Heatmap
      </h2>
      
      <div className="p-8 border-4 border-slate-900 bg-white rounded-[2rem] shadow-[12px_12px_0px_0px_rgba(15,23,42,1)]">
        {chartData.length > 0 ? (
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                {/* 
                  Instead of visually hiding the bar when calibrating, we use the real strength but color it gray.
                  If you want the bar to show a static size during calibration, you could override the strength.
                */}
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#0f172a', fontWeight: 900, fontSize: 12, textTransform: 'uppercase' }} 
                  width={150} 
                />
                <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                <Bar dataKey="strength" radius={[0, 8, 8, 0]} barSize={32}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="p-12 border-4 border-dashed border-slate-300 rounded-[2rem] text-center text-slate-400 font-bold uppercase tracking-widest">
            No Syllabus Data Recorded
          </div>
        )}
      </div>
    </section>
  );
}
