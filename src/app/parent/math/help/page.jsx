import Link from 'next/link';

export default function AnalyticsHelpPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="p-8 border-b-[8px] border-slate-900 bg-white flex justify-between items-end sticky top-0 z-50">
        <div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">Knowledge Base</span>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none">Analytics Guide</h1>
        </div>
        <div className="flex gap-4">
          <Link 
            href="/parent/math" 
            className="px-6 py-3 bg-white border-4 border-slate-900 text-slate-900 font-black uppercase tracking-widest text-xs hover:bg-slate-100 hover:-translate-y-1 transition-transform shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-8 py-16 space-y-16">
        
        {/* Intro */}
        <section className="bg-white p-8 border-4 border-slate-900 rounded-[2rem] shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
          <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-900 mb-4">Demystifying the Dashboard</h2>
          <p className="text-slate-600 leading-relaxed font-medium">
            The Neuro-Trainer Analytics Engine does not measure raw "scores" like a traditional grading system. Instead, it measures <strong>cognitive retention</strong>—how deeply a student understands a concept, how quickly they can execute it, and how resilient that knowledge is under pressure. This guide breaks down the core metrics used to evaluate your child's performance.
          </p>
        </section>

        {/* Confidence Metrics */}
        <section className="space-y-6">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 uppercase flex items-center gap-4">
            <span className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-xl text-lg">A</span>
            Confidence Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 border-4 border-slate-900 rounded-2xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex flex-col gap-3 hover:-translate-y-1 transition-transform">
              <span className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-black text-xl">✓</span>
              <h3 className="font-black text-lg uppercase text-slate-900 tracking-tight">Correctness</h3>
              <p className="text-sm font-medium text-slate-600 leading-relaxed">
                The baseline ability to arrive at the correct final answer. While important, correctness alone does not guarantee long-term retention if it took a long time or multiple hints to achieve.
              </p>
            </div>
            <div className="bg-white p-6 border-4 border-slate-900 rounded-2xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex flex-col gap-3 hover:-translate-y-1 transition-transform">
              <span className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-black text-xl">⚡</span>
              <h3 className="font-black text-lg uppercase text-slate-900 tracking-tight">Efficiency</h3>
              <p className="text-sm font-medium text-slate-600 leading-relaxed">
                The speed and cognitive fluidity of solving a problem. High efficiency indicates the student has internalized the concept and no longer relies on slow, manual counting strategies.
              </p>
            </div>
            <div className="bg-white p-6 border-4 border-slate-900 rounded-2xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex flex-col gap-3 hover:-translate-y-1 transition-transform">
              <span className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-black text-xl">🔄</span>
              <h3 className="font-black text-lg uppercase text-slate-900 tracking-tight">Consistency</h3>
              <p className="text-sm font-medium text-slate-600 leading-relaxed">
                The ability to solve the same type of problem correctly across multiple attempts and varying formats. High consistency proves the knowledge is resilient against trick questions.
              </p>
            </div>
          </div>
        </section>

        {/* Proficiency Heatmap */}
        <section className="space-y-6">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 uppercase flex items-center gap-4">
            <span className="w-10 h-10 bg-slate-900 text-white flex items-center justify-center rounded-xl text-lg">01</span>
            Proficiency Heatmap
          </h2>
          <div className="bg-white p-8 border-4 border-slate-900 rounded-[2rem] shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] space-y-6">
            <p className="text-slate-600 font-medium">
              The heatmap tracks <strong>Synapse Strength</strong>—an aggregate score combining Correctness, Efficiency, and Consistency into a single 0-100% metric per topic.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-4 p-4 border-2 border-slate-200 rounded-xl bg-slate-50">
                <div className="w-12 h-12 bg-slate-400 rounded-lg flex-shrink-0"></div>
                <div>
                  <h4 className="font-black text-slate-900 uppercase tracking-tight">Calibrating (Gray)</h4>
                  <p className="text-xs font-medium text-slate-500">Under 5 practice attempts. The engine is still gathering data on this topic.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 border-2 border-slate-200 rounded-xl bg-green-50">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex-shrink-0"></div>
                <div>
                  <h4 className="font-black text-slate-900 uppercase tracking-tight">Proficient (Green)</h4>
                  <p className="text-xs font-medium text-slate-500">&ge; 80% strength. The student has mastered this concept and is ready for the next level.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 border-2 border-slate-200 rounded-xl bg-yellow-50">
                <div className="w-12 h-12 bg-yellow-500 rounded-lg flex-shrink-0"></div>
                <div>
                  <h4 className="font-black text-slate-900 uppercase tracking-tight">Practicing (Yellow)</h4>
                  <p className="text-xs font-medium text-slate-500">50 - 79% strength. Developing well, but needs a bit more repetition to build speed.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 border-2 border-slate-200 rounded-xl bg-rose-50">
                <div className="w-12 h-12 bg-rose-500 rounded-lg flex-shrink-0"></div>
                <div>
                  <h4 className="font-black text-slate-900 uppercase tracking-tight">Needs Focus (Red)</h4>
                  <p className="text-xs font-medium text-slate-500">&lt; 50% strength. Indicates a fundamental misunderstanding requiring intervention.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Diagnostic Deep-Dive */}
        <section className="space-y-6">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 uppercase flex items-center gap-4">
            <span className="w-10 h-10 bg-slate-900 text-white flex items-center justify-center rounded-xl text-lg">02</span>
            Diagnostic Deep-Dive
          </h2>
          <div className="bg-white p-8 border-4 border-slate-900 rounded-[2rem] shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] space-y-4">
            <h3 className="font-black text-xl uppercase text-slate-900 tracking-tight">What is a "Logic Variant"?</h3>
            <p className="text-slate-600 font-medium">
              Topics like "Addition" are too broad to diagnose accurately. Therefore, the engine breaks every topic down into microscopic building blocks called <strong>Logic Variants</strong> (e.g., "Number Bonds Missing Part", "Visual Cross-Out Subtraction"). 
            </p>
            <p className="text-slate-600 font-medium">
              If a student is struggling, the Diagnostic Deep-Dive will isolate the <em>exact</em> variant causing the bottleneck, allowing you to focus practice precisely where it is needed instead of assigning generic worksheets.
            </p>
          </div>
        </section>

        {/* Assessment Audit Board */}
        <section className="space-y-6">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 uppercase flex items-center gap-4">
            <span className="w-10 h-10 bg-slate-900 text-white flex items-center justify-center rounded-xl text-lg">03</span>
            Assessment Audit Board
          </h2>
          <div className="bg-white p-8 border-4 border-slate-900 rounded-[2rem] shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-black text-lg uppercase text-slate-900 tracking-tight mb-2">Conceptual Mastery</h3>
                <p className="text-sm font-medium text-slate-600 leading-relaxed">
                  How well the student understands the topic during untimed, low-pressure, day-to-day practice in the Neuro-Trainer.
                </p>
              </div>
              <div>
                <h3 className="font-black text-lg uppercase text-slate-900 tracking-tight mb-2">Exam Performance</h3>
                <p className="text-sm font-medium text-slate-600 leading-relaxed">
                  How well the student actually scores when given a strict time limit and mixed formats during a Mock Exam.
                </p>
              </div>
            </div>

            <div className="p-6 bg-rose-50 border-2 border-rose-200 rounded-xl space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-bl-full"></div>
              <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-700 font-black text-xs uppercase tracking-widest px-3 py-1 border-2 border-rose-500 rounded-full mb-2">
                ⚠️ Execution Risk
              </span>
              <p className="text-sm font-bold text-slate-700 leading-relaxed z-10 relative">
                This warning is triggered when a student has a high Conceptual Mastery (they understand the math) but a low Exam Performance (they fail the test). 
                <br/><br/>
                This indicates the student does <strong>not</strong> need to re-learn the math. Instead, they are losing marks due to <strong>Careless Calculation Errors, Time-Pressure Anxiety, or Misreading Questions</strong>.
              </p>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
