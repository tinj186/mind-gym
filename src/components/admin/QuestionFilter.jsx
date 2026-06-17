'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function QuestionFilter({ levels, topics, subtopics, types, difficulties, currentFilters }) {
  const router = useRouter();
  const searchParams = useSearchParams();

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

    router.push(`/admin/questions?${params.toString()}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
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
  );
}