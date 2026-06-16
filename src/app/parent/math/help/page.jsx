import Link from 'next/link';

export default function AnalyticsHelpPage() {
  return (
    <div className="min-h-screen bg-indigo-50/50">
      <header className="px-6 py-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-12">
          <div>
            <span className="text-[10px] font-black text-violet-700 uppercase tracking-widest px-3 py-1 rounded-full border bg-violet-50 border-violet-200 mb-4 inline-block">Knowledge Base</span>
            <div className="flex items-center gap-6">
              <h1 className="text-4xl font-black text-indigo-950 tracking-tight uppercase">Analytics Guide</h1>
              <Link 
                href="/parent/math" 
                className="px-6 py-2 bg-indigo-100 text-indigo-900 font-bold rounded-xl hover:bg-indigo-200 transition-colors text-sm"
              >
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pb-16 space-y-16">
        
        {/* Intro */}
        <section className="bg-white p-8 md:p-12 border border-indigo-100 rounded-[2.5rem] shadow-sm">
          <h2 className="text-2xl font-black uppercase tracking-tight text-indigo-950 mb-4">Demystifying the Dashboard</h2>
          <p className="text-indigo-900/70 leading-relaxed font-medium max-w-4xl">
            The Neuro-Trainer Analytics Engine does not measure raw "scores" like a traditional grading system. Instead, it measures <strong>cognitive retention</strong>—how deeply a student understands a concept, how quickly they can execute it, and how resilient that knowledge is under pressure. This guide breaks down the core metrics used to evaluate your child's performance.
          </p>
        </section>

        {/* Confidence Metrics */}
        <section className="space-y-6">
          <h2 className="text-2xl font-black tracking-tight text-indigo-950 uppercase flex items-center gap-4 pl-4">
            <span className="w-10 h-10 bg-indigo-100 text-indigo-600 flex items-center justify-center rounded-xl text-lg font-black">A</span>
            Confidence Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-8 border border-indigo-100 rounded-[2.5rem] shadow-sm flex flex-col gap-4 hover:-translate-y-1 transition-transform cursor-default">
              <span className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 font-black text-2xl">✓</span>
              <h3 className="font-black text-xl uppercase text-indigo-950 tracking-tight">Correctness</h3>
              <p className="text-sm font-medium text-indigo-900/60 leading-relaxed">
                The baseline ability to arrive at the correct final answer. While important, correctness alone does not guarantee long-term retention if it took a long time or multiple hints to achieve.
              </p>
            </div>
            <div className="bg-white p-8 border border-indigo-100 rounded-[2.5rem] shadow-sm flex flex-col gap-4 hover:-translate-y-1 transition-transform cursor-default">
              <span className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 font-black text-2xl">⚡</span>
              <h3 className="font-black text-xl uppercase text-indigo-950 tracking-tight">Efficiency</h3>
              <p className="text-sm font-medium text-indigo-900/60 leading-relaxed">
                The speed and cognitive fluidity of solving a problem. High efficiency indicates the student has internalized the concept and no longer relies on slow, manual counting strategies.
              </p>
            </div>
            <div className="bg-white p-8 border border-indigo-100 rounded-[2.5rem] shadow-sm flex flex-col gap-4 hover:-translate-y-1 transition-transform cursor-default">
              <span className="w-12 h-12 rounded-full bg-violet-50 flex items-center justify-center text-violet-600 font-black text-2xl">🔄</span>
              <h3 className="font-black text-xl uppercase text-indigo-950 tracking-tight">Consistency</h3>
              <p className="text-sm font-medium text-indigo-900/60 leading-relaxed">
                The ability to solve the same type of problem correctly across multiple attempts and varying formats. High consistency proves the knowledge is resilient against trick questions.
              </p>
            </div>
          </div>
        </section>

        {/* Proficiency Heatmap */}
        <section className="space-y-6">
          <h2 className="text-2xl font-black tracking-tight text-indigo-950 uppercase flex items-center gap-4 pl-4">
            <span className="w-10 h-10 bg-indigo-900 text-white flex items-center justify-center rounded-xl text-lg font-black">01</span>
            Proficiency Heatmap
          </h2>
          <div className="bg-white p-8 md:p-12 border border-indigo-100 rounded-[2.5rem] shadow-sm space-y-8">
            <p className="text-indigo-900/70 font-medium">
              The heatmap tracks <strong>Synapse Strength</strong>—an aggregate score combining Correctness, Efficiency, and Consistency into a single 0-100% metric per topic.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4 p-6 border border-slate-100 rounded-2xl bg-slate-50">
                <div className="w-12 h-12 bg-slate-400 rounded-xl flex-shrink-0"></div>
                <div>
                  <h4 className="font-black text-indigo-950 uppercase tracking-tight">Calibrating (Gray)</h4>
                  <p className="text-xs font-medium text-indigo-900/60 mt-1">Under 5 practice attempts. The engine is still gathering data on this topic.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-6 border border-emerald-100 rounded-2xl bg-emerald-50/50">
                <div className="w-12 h-12 bg-emerald-500 rounded-xl flex-shrink-0 shadow-sm shadow-emerald-200"></div>
                <div>
                  <h4 className="font-black text-indigo-950 uppercase tracking-tight">Proficient (Green)</h4>
                  <p className="text-xs font-medium text-indigo-900/60 mt-1">&ge; 80% strength. The student has mastered this concept and is ready for the next level.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-6 border border-amber-100 rounded-2xl bg-amber-50/50">
                <div className="w-12 h-12 bg-amber-500 rounded-xl flex-shrink-0 shadow-sm shadow-amber-200"></div>
                <div>
                  <h4 className="font-black text-indigo-950 uppercase tracking-tight">Practicing (Yellow)</h4>
                  <p className="text-xs font-medium text-indigo-900/60 mt-1">50 - 79% strength. Developing well, but needs a bit more repetition to build speed.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-6 border border-rose-100 rounded-2xl bg-rose-50/50">
                <div className="w-12 h-12 bg-rose-500 rounded-xl flex-shrink-0 shadow-sm shadow-rose-200"></div>
                <div>
                  <h4 className="font-black text-indigo-950 uppercase tracking-tight">Needs Focus (Red)</h4>
                  <p className="text-xs font-medium text-indigo-900/60 mt-1">&lt; 50% strength. Indicates a fundamental misunderstanding requiring intervention.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Diagnostic Deep-Dive */}
        <section className="space-y-6">
          <h2 className="text-2xl font-black tracking-tight text-indigo-950 uppercase flex items-center gap-4 pl-4">
            <span className="w-10 h-10 bg-indigo-900 text-white flex items-center justify-center rounded-xl text-lg font-black">02</span>
            Variant Bottlenecks
          </h2>
          <div className="bg-white p-8 md:p-12 border border-indigo-100 rounded-[2.5rem] shadow-sm space-y-4">
            <h3 className="font-black text-xl uppercase text-indigo-950 tracking-tight">What is a "Logic Variant"?</h3>
            <p className="text-indigo-900/70 font-medium">
              Topics like "Addition" are too broad to diagnose accurately. Therefore, the engine breaks every topic down into microscopic building blocks called <strong>Logic Variants</strong> (e.g., "Number Bonds Missing Part", "Visual Cross-Out Subtraction"). 
            </p>
            <p className="text-indigo-900/70 font-medium">
              If a student is struggling, the Diagnostic Deep-Dive will isolate the <em>exact</em> variant causing the bottleneck, allowing you to focus practice precisely where it is needed instead of assigning generic worksheets.
            </p>
          </div>
        </section>

        {/* Assessment Audit Board */}
        <section className="space-y-6">
          <h2 className="text-2xl font-black tracking-tight text-indigo-950 uppercase flex items-center gap-4 pl-4">
            <span className="w-10 h-10 bg-indigo-900 text-white flex items-center justify-center rounded-xl text-lg font-black">03</span>
            Assessment Audit Board
          </h2>
          <div className="bg-white p-8 md:p-12 border border-indigo-100 rounded-[2.5rem] shadow-sm space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="font-black text-lg uppercase text-indigo-950 tracking-tight mb-3">Conceptual Mastery</h3>
                <p className="text-sm font-medium text-indigo-900/70 leading-relaxed">
                  How well the student understands the topic during untimed, low-pressure, day-to-day practice in the Neuro-Trainer. High mastery means they truly know the math.
                </p>
              </div>
              <div>
                <h3 className="font-black text-lg uppercase text-indigo-950 tracking-tight mb-3">Exam Performance</h3>
                <p className="text-sm font-medium text-indigo-900/70 leading-relaxed">
                  How well the student actually scores when given a strict time limit and mixed formats during a Mock Exam. This measures execution under pressure.
                </p>
              </div>
            </div>

            <div className="p-8 bg-rose-50/80 border border-rose-200 rounded-[2rem] space-y-4 relative overflow-hidden mt-8">
              <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/5 rounded-bl-full"></div>
              <span className="inline-flex items-center gap-2 bg-white text-rose-600 font-black text-xs uppercase tracking-widest px-4 py-2 border border-rose-200 rounded-full mb-2 shadow-sm">
                ⚠️ Execution Risk
              </span>
              <p className="text-sm font-bold text-indigo-950 leading-relaxed z-10 relative max-w-3xl">
                This warning is triggered when a student has a high Conceptual Mastery (they understand the math) but a low Exam Performance (they fail the test). 
                <br/><br/>
                This indicates the student does <strong>not</strong> need to re-learn the math. Instead, they are losing marks due to <span className="text-rose-600">Careless Calculation Errors, Time-Pressure Anxiety, or Misreading Questions</span>.
              </p>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
