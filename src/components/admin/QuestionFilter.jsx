'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export default function QuestionFilter({ levels, topics, subtopics, types, difficulties, currentFilters }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleFilterChange = (name, value) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }

    // Reset child filters when a parent filter changes to maintain hierarchy
    if (name === 'level') {
      params.delete('topic');
      params.delete('subtopic');
    } else if (name === 'topic') {
      params.delete('subtopic');
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-6">
        <div>
          <label htmlFor="level" className="block text-sm font-medium text-slate-300 mb-1">Level</label>
          <select 
            id="level" 
            value={currentFilters.level || ''} 
            onChange={(e) => handleFilterChange('level', e.target.value)} 
            className="w-full p-3 border border-slate-300 rounded-lg bg-white text-slate-900"
          >
            <option value="">All Levels</option>
            {levels.map(level => <option key={level} value={level}>{level}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-slate-300 mb-1">Topic</label>
          <select 
            id="topic" 
            value={currentFilters.topic || ''} 
            onChange={(e) => handleFilterChange('topic', e.target.value)} 
            className="w-full p-3 border border-slate-300 rounded-lg bg-white text-slate-900 disabled:bg-slate-200 disabled:text-slate-400"
            disabled={!currentFilters.level}
          >
            <option value="">All Topics</option>
            {topics.map(topic => <option key={topic} value={topic}>{topic}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="subtopic" className="block text-sm font-medium text-slate-300 mb-1">Sub-topic</label>
          <select 
            id="subtopic" 
            value={currentFilters.subtopic || ''} 
            onChange={(e) => handleFilterChange('subtopic', e.target.value)} 
            className="w-full p-3 border border-slate-300 rounded-lg bg-white text-slate-900 disabled:bg-slate-200 disabled:text-slate-400"
            disabled={!currentFilters.topic}
          >
            <option value="">All Sub-topics</option>
            {subtopics.map(st => <option key={st} value={st}>{st}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-slate-300 mb-1">Type</label>
          <select id="type" value={currentFilters.type || ''} onChange={(e) => handleFilterChange('type', e.target.value)} className="w-full p-3 border border-slate-300 rounded-lg bg-white text-slate-900">
            <option value="">All Types</option>
            {types.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="difficulty" className="block text-sm font-medium text-slate-300 mb-1">Difficulty</label>
          <select id="difficulty" value={currentFilters.difficulty || ''} onChange={(e) => handleFilterChange('difficulty', e.target.value)} className="w-full p-3 border border-slate-300 rounded-lg bg-white text-slate-900">
            <option value="">All Difficulties</option>
            {difficulties.map(difficulty => <option key={difficulty} value={difficulty}>{difficulty}</option>)}
          </select>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-600">
        <label htmlFor="questionId" className="block text-sm font-bold text-slate-300 mb-2">Quick Lookup (ID or Variant)</label>
        <div className="flex gap-4">
          <input 
            type="text" 
            id="questionId" 
            placeholder="Paste ID or Logic Variant..." 
            className="flex-1 p-3 border border-slate-300 rounded-lg bg-white text-slate-900 font-mono text-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.target.value.trim()) {
                let val = e.target.value.trim().replace(/:$/, '');
                const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);
                if (isUuid) {
                  router.push(`/admin/questions/review?id=${val}`);
                } else {
                  const params = new URLSearchParams(searchParams.toString());
                  params.set('heuristic', val);
                  router.push(`/admin/questions/review?${params.toString()}`);
                }
              }
            }}
          />
          <button 
            onClick={() => {
              const inputVal = document.getElementById('questionId').value;
              if (inputVal && inputVal.trim()) {
                let val = inputVal.trim().replace(/:$/, '');
                const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);
                if (isUuid) {
                  router.push(`/admin/questions/review?id=${val}`);
                } else {
                  const params = new URLSearchParams(searchParams.toString());
                  params.set('heuristic', val);
                  router.push(`/admin/questions/review?${params.toString()}`);
                }
              }
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            Find Question
          </button>
        </div>
      </div>
    </div>
  );
}