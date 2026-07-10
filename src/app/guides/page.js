import Link from 'next/link';

export const metadata = {
  title: 'Learn Reps | Parent Guides',
  description: 'Guides and resources to help parents navigate the Singapore MOE Math Syllabus.',
};

export default function GuidesHub() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
            Parent <span className="text-indigo-600">Guides</span>
          </h1>
          <p className="mt-4 text-xl text-slate-600 max-w-2xl mx-auto">
            Resources to help you navigate the Singapore MOE Math Syllabus and support your child at home.
          </p>
        </div>

        <div className="grid gap-8">
          <Link href="/guides/p1-time-syllabus-2026" className="block group">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 hover:shadow-md transition-shadow duration-300 hover:border-indigo-200">
              <div className="flex justify-between items-center mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-50 text-indigo-700">
                  Primary 1 Math
                </span>
                <span className="text-sm text-slate-500">2026 Syllabus</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                Why Your Child Struggles with the New Primary 1 Time Syllabus (And How to Fix It)
              </h2>
              <p className="mt-3 text-slate-600 leading-relaxed">
                The MOE syllabus has shifted Time concepts from Primary 2 down to Primary 1. Here is why telling time to 5 minutes is causing friction, and the 2-step method to fix it.
              </p>
              <div className="mt-6 flex items-center text-indigo-600 font-semibold text-sm uppercase tracking-wider">
                Read Article
                <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
