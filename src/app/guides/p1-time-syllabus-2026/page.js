import Link from 'next/link';

export const metadata = {
  title: 'How to teach P1 time and duration Singapore | Learn Reps',
  description: 'Struggling with the new 2026 MOE Primary 1 Time syllabus? Learn why telling time to 5 minutes is hard and how to fix it with this 2-step method.',
  keywords: 'Primary 1 math time worksheets, How to teach P1 time and duration Singapore, P1 math place value practice online',
};

export default function ArticlePage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/guides" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 mb-8 transition-colors">
          <svg className="mr-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Guides
        </Link>
        
        <article className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-12">
          <header className="mb-10 text-center">
            <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
              2026 Syllabus Update
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Why Your Child Struggles with the New Primary 1 Time Syllabus (And How to Fix It)
            </h1>
          </header>

          <div className="prose prose-lg prose-indigo mx-auto text-slate-600">
            <p className="lead text-xl text-slate-800 font-medium mb-8">
              Under the newly updated MOE 2026 syllabus, Primary 1 students are now expected to tell time to 5 minutes and understand 'am' and 'pm'—concepts that used to be taught later in Primary 2. If you are feeling frustrated trying to teach your child this, you are not alone.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4 border-b pb-2">The Core Problem: It's Not About the Clock</h2>
            <p className="mb-6">
              When a child struggles to read the minute hand, parents often try to fix it by repeatedly showing them the clock face. They say, <em>"Look, the long hand is on the 4, so it's 20 minutes!"</em> But simply staring at a clock face doesn't work.
            </p>
            <p className="mb-8">
              The issue is rarely an inability to understand the concept of time. The issue is usually a lack of <strong>foundational skip-counting skills</strong>. If a child cannot fluidly count by 5s without thinking, translating the numbers on a clock face into minutes becomes an overwhelming cognitive overload.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4 border-b pb-2">The Solution: The 2-Step Home Method</h2>
            <p className="mb-4">
              To solve this, we need to separate the math from the clock before putting them back together.
            </p>
            
            <div className="bg-slate-50 rounded-xl p-6 mb-6 border border-slate-100">
              <h3 className="text-lg font-bold text-indigo-900 mb-2">Step 1: Master Skip-Counting by 5s Away from the Clock</h3>
              <p className="text-slate-700">
                Before looking at a clock again, practice counting by 5s up to 60. Do this during car rides, walks, or while playing. The goal is for the child to count "5, 10, 15, 20..." automatically. Once this is effortless, the heavy lifting is done.
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-6 mb-8 border border-slate-100">
              <h3 className="text-lg font-bold text-indigo-900 mb-2">Step 2: Map the Pattern to the Clock</h3>
              <p className="text-slate-700">
                Draw a large circle and place the numbers 1 through 12. Ask your child to point to the numbers and recite their 5s skip-counting pattern. "Point to the 1, say 5. Point to the 2, say 10." This explicitly bridges their new skip-counting skill directly to the clock's visual layout.
              </p>
            </div>

            <hr className="my-10 border-slate-200" />

            <div className="bg-indigo-900 text-white rounded-2xl p-8 text-center shadow-lg transform hover:-translate-y-1 transition-transform duration-300">
              <h2 className="text-2xl font-bold mb-4">Mastering the New Syllabus Requires Repetition</h2>
              <p className="text-indigo-100 mb-8 max-w-lg mx-auto">
                Mastering time requires consistent, targeted repetition. Instead of buying another static assessment book that gets quickly outdated, I built <strong>The Learn Reps</strong> to generate unlimited, auto-marked practice questions specifically aligned with the new P1 MOE syllabus.
              </p>
              <Link href="/signup" className="inline-block bg-white text-indigo-900 font-bold py-4 px-8 rounded-full shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 uppercase tracking-wider text-sm">
                Try Our Free Worksheet Generator
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
