'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export default function QuestionFilter({ levels, topics, subtopics, types, difficulties, currentFilters }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedLevel, setSelectedLevel] = useState(currentFilters.level || '');
  const [selectedTopic, setSelectedTopic] = useState(currentFilters.topic || '');
  const [selectedSubtopic, setSelectedSubtopic] = useState(currentFilters.subtopic || '');
  const [selectedType, setSelectedType] = useState(currentFilters.type || '');
  const [selectedDifficulty, setSelectedDifficulty] = useState(currentFilters.difficulty || '');

  // Sync internal state with URL search params when they change
  useEffect(() => {
    setSelectedLevel(currentFilters.level || '');
    setSelectedTopic(currentFilters.topic || '');
    setSelectedSubtopic(currentFilters.subtopic || '');
    setSelectedType(currentFilters.type || '');
    setSelectedDifficulty(currentFilters.difficulty || '');
  }, [currentFilters]);

  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (selectedLevel) params.set('level', selectedLevel);
    if (selectedTopic) params.set('topic', selectedTopic);
    if (selectedSubtopic) params.set('subtopic', selectedSubtopic);
    if (selectedType) params.set('type', selectedType);
    if (selectedDifficulty) params.set('difficulty', selectedDifficulty);

    router.push(`/admin/questions?${params.toString()}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
      <div>
        <label htmlFor="level" className="block text-sm font-medium text-slate-700 mb-1">Level</label>
        <select id="level" value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)} className="w-full p-3 border border-slate-300 rounded-lg">
          <option value="">All Levels</option>
          {levels.map(level => <option key={level} value={level}>{level}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="topic" className="block text-sm font-medium text-slate-700 mb-1">Topic</label>
        <select id="topic" value={selectedTopic} onChange={(e) => setSelectedTopic(e.target.value)} className="w-full p-3 border border-slate-300 rounded-lg">
          <option value="">All Topics</option>
          {topics.map(topic => <option key={topic} value={topic}>{topic}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="subtopic" className="block text-sm font-medium text-slate-700 mb-1">Sub-topic</label>
        <select id="subtopic" value={selectedSubtopic} onChange={(e) => setSelectedSubtopic(e.target.value)} className="w-full p-3 border border-slate-300 rounded-lg">
          <option value="">All Sub-topics</option>
          {subtopics.map(st => <option key={st} value={st}>{st}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-slate-700 mb-1">Type</label>
        <select id="type" value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="w-full p-3 border border-slate-300 rounded-lg">
          <option value="">All Types</option>
          {types.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="difficulty" className="block text-sm font-medium text-slate-700 mb-1">Difficulty</label>
        <select id="difficulty" value={selectedDifficulty} onChange={(e) => setSelectedDifficulty(e.target.value)} className="w-full p-3 border border-slate-300 rounded-lg">
          <option value="">All Difficulties</option>
          {difficulties.map(difficulty => <option key={difficulty} value={difficulty}>{difficulty}</option>)}
        </select>
      </div>
      <div className="md:col-span-3 lg:col-span-5 flex justify-end">
        <button onClick={applyFilters} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg">
          Apply Filters
        </button>
      </div>
    </div>
  );
}