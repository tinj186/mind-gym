"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function SynapseMap({ syllabus, masteryData }) {
  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-32">
      <div className="flex items-center gap-6">
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">The Synapse Map</h2>
        <div className="h-1 flex-1 bg-slate-50 rounded-full" />
      </div>

      <div className="grid grid-cols-1 gap-16">
        {syllabus.map((strandData, sIdx) => (
          <div key={sIdx} className="space-y-8">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-1">{strandData.strand}</span>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">{strandData.topic}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {strandData.subtopics.map((subtopic, stIdx) => {
                // ID Alignment: Using topicId and subTopicId for robust indexing
                const mastery = masteryData.find(m => 
                  m.topicId === strandData.topicId && 
                  m.subTopicId === subtopic.id
                );
                const strength = mastery?.synapseStrength || 0;
                const defectLog = mastery?.defectLog || {};

                // Defect Alerts: Display Coach's Note for any defect code appearing >= 3 times
                const significantDefects = Object.entries(defectLog)
                  .filter(([code, count]) => count >= 3 && code !== 'UNKNOWN');
                const coachMessage = significantDefects.length > 0 
                  ? `Coach: Watch your ${significantDefects[0][0].replace('_', ' ').toLowerCase()}!` 
                  : null;

                return (
                  <div key={stIdx} className="group relative bg-white border-2 border-slate-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all flex flex-col gap-6">
                    {/* Coach's Note: Integrated Defect Alerts */}
                    {coachMessage && (
                      <div className="absolute -top-3 -right-2 bg-rose-500 text-white text-[9px] font-black px-3 py-1.5 rounded-full shadow-lg border-2 border-white animate-bounce z-10 flex items-center gap-1.5">
                        <span>⚠️</span>
                        <span className="uppercase tracking-tighter">{coachMessage}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-start">
                      <h4 className="text-lg font-black text-slate-900 leading-tight pr-4">{subtopic.name}</h4>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">Strength</span>
                        <span className="text-xl font-black text-blue-600">{strength}%</span>
                      </div>
                    </div>

                    {/* Mastery Meter */}
                    <div className="w-full h-3 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(59,130,246,0.3)]" 
                        style={{ width: `${strength}%` }}
                      />
                    </div>

                    {/* Gamified Lock System */}
                    <div className="grid grid-cols-3 gap-3">
                      <DifficultyButton label="Found." active={true} strength={strength} />
                      <DifficultyButton label="Std." active={strength >= 70} strength={strength} />
                      <DifficultyButton label="Adv." active={strength >= 85} strength={strength} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DifficultyButton({ label, active }) {
  // Rank Up Animation: Implement a trigger when synapseStrength crosses locking thresholds
  return (
    <motion.div 
      initial={false}
      animate={active ? { scale: [1, 1.1, 1], backgroundColor: "#ffffff" } : {}}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`
      relative flex flex-col items-center justify-center py-3 rounded-2xl border-2 transition-all group/btn
      ${active 
        ? 'border-slate-200 bg-white cursor-pointer hover:border-slate-900 hover:bg-slate-900 hover:text-white' 
        : 'border-slate-50 bg-slate-50 text-slate-300 grayscale cursor-not-allowed opacity-50'}
    `}>
      <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
      {!active ? (
        <motion.span 
          layoutId={`lock-${label}`}
          className="text-[10px] mt-1"
        >
          🔒
        </motion.span>
      ) : (
        <motion.div 
          layoutId={`lock-${label}`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="h-1 w-4 bg-blue-500 rounded-full mt-2 group-hover/btn:bg-white transition-colors" 
        />
      )}
    </motion.div>
  );
}