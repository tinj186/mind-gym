export default function SystemSettings() {
  const settingsCategories = [
    {
      title: "Pedagogy Controls",
      description: "Adjust the 'Gym' logic and adaptive algorithms.",
      options: [
        { name: "Mastery Threshold", value: "85%", type: "range" },
        { name: "Spaced Repetition (Decay)", value: "Enabled", type: "toggle" },
      ]
    },
    {
      title: "AI & Grading",
      description: "Configure Gemini Tier 2 and Tier 3 behavior.",
      options: [
        { name: "Auto-Diagnosis (Tier 2)", value: "Active", type: "status" },
        { name: "Detailed Feedback (Tier 3)", value: "Manual Approval", type: "status" },
      ]
    },
    {
      title: "Platform Infrastructure",
      description: "System health and database status.",
      options: [
        { name: "Database Connection", value: "Healthy", type: "health" },
        { name: "Syllabus Sync (MOE 2026)", value: "Up to Date", type: "health" },
      ]
    }
  ];

  return (
    <div className="space-y-12">
      <header>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight text-left">SYSTEM SETTINGS</h2>
        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1 text-left">
          Platform Configuration & Calibration
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8">
        {settingsCategories.map((category, idx) => (
          <section key={idx} className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8">
            <div className="mb-6">
              <h3 className="font-black text-slate-900 uppercase tracking-tighter text-lg">{category.title}</h3>
              <p className="text-slate-400 text-xs font-bold">{category.description}</p>
            </div>
            
            <div className="divide-y divide-slate-100 border-t border-slate-100">
              {category.options.map((option, i) => (
                <div key={i} className="py-5 flex justify-between items-center">
                  <span className="text-sm font-black text-slate-700 uppercase tracking-tight">{option.name}</span>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      option.value === 'Healthy' || option.value === 'Active' || option.value === 'Enabled'
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-slate-100 text-slate-600'
                    }`}>
                      {option.value}
                    </span>
                    <button className="text-slate-300 hover:text-blue-600 font-black text-[10px] uppercase">Edit</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="flex justify-start gap-4">
        <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-blue-600 transition-all">
          SAVE ALL CHANGES
        </button>
        <button className="bg-white text-red-600 border border-red-100 px-8 py-4 rounded-2xl font-black text-sm hover:bg-red-50 transition-all">
          FACTORY RESET DB
        </button>
      </div>
    </div>
  );
}