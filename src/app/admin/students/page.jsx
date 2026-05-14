"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createStudentAction, getStudentListAction } from '@/lib/admin/studentActions';

export default function StudentManagementPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formName, setFormName] = useState('');
  const [formExternalId, setFormExternalId] = useState('');
  const [formLevel, setFormLevel] = useState('Primary 1');
  const [formMessage, setFormMessage] = useState('');

  const fetchStudents = async () => {
    setLoading(true);
    const result = await getStudentListAction();
    if (result.success) {
      setStudents(result.students);
    } else {
      setFormMessage(result.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormMessage('');
    const formData = new FormData(e.target);
    const result = await createStudentAction(formData);
    if (result.success) {
      setFormMessage(`Student "${result.student.name}" created successfully!`);
      setFormName('');
      setFormExternalId('');
      setFormLevel('Primary 1'); // Reset to default
      fetchStudents(); // Refresh the list
    } else {
      setFormMessage(result.message);
    }
  };

  return (
    <div className="p-12 space-y-12 bg-white min-h-screen text-slate-900">
      <header className="border-b-8 border-slate-900 pb-8">
        <div>
          <h1 className="text-6xl font-black italic tracking-tighter uppercase">Student_Roster</h1>
          <p className="font-mono text-slate-500 uppercase tracking-widest text-xs mt-2">Manage Student Profiles // Neural Access</p>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-12">
        {/* Left Column: Quick-Create Form */}
        <section className="col-span-4 space-y-8">
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-3 text-slate-900">
            <span className="w-8 h-8 bg-slate-900 text-white flex items-center justify-center rounded-lg text-sm">01</span>
            QUICK-CREATE STUDENT
          </h2>
          <form onSubmit={handleSubmit} className="p-8 border-4 border-slate-900 rounded-[2rem] shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] space-y-6">
            <div>
              <label htmlFor="name" className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Student Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full p-3 border-2 border-slate-300 rounded-lg font-bold text-lg focus:border-blue-500 focus:ring-blue-500 focus:ring-1"
                required
              />
            </div>
            <div>
              <label htmlFor="externalId" className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">External ID (Unique)</label>
              <input
                type="text"
                id="externalId"
                name="externalId"
                value={formExternalId}
                onChange={(e) => setFormExternalId(e.target.value)}
                className="w-full p-3 border-2 border-slate-300 rounded-lg font-bold text-lg focus:border-blue-500 focus:ring-blue-500 focus:ring-1"
                required
              />
            </div>
            <div>
              <label htmlFor="gradeLevel" className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Grade Level</label>
              <select
                id="gradeLevel"
                name="gradeLevel"
                value={formLevel}
                onChange={(e) => setFormLevel(e.target.value)}
                className="w-full p-3 border-2 border-slate-300 rounded-lg font-bold text-lg focus:border-blue-500 focus:ring-blue-500 focus:ring-1 bg-white"
              >
                <option value="Primary 1">Primary 1</option>
                <option value="Primary 2">Primary 2</option>
                <option value="Primary 3">Primary 3</option>
                <option value="Primary 4">Primary 4</option>
                <option value="Primary 5 (Foundation)">Primary 5 (Foundation)</option>
                <option value="Primary 5 (Standard)">Primary 5 (Standard)</option>
                <option value="Primary 6 (Foundation)">Primary 6 (Foundation)</option>
                <option value="Primary 6 (Standard)">Primary 6 (Standard)</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full py-4 bg-indigo-600 text-white rounded-xl font-black text-lg hover:bg-indigo-700 active:scale-95 shadow-lg transition-all"
            >
              CREATE STUDENT
            </button>
            {formMessage && (
              <p className={`text-center text-sm font-bold mt-4 ${formMessage.includes('successfully') ? 'text-green-600' : 'text-rose-600'}`}>
                {formMessage}
              </p>
            )}
          </form>
        </section>

        {/* Right Column: Active Roster */}
        <section className="col-span-8 space-y-8">
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-3 text-slate-900">
            <span className="w-8 h-8 bg-slate-900 text-white flex items-center justify-center rounded-lg text-sm">02</span>
            ACTIVE ROSTER
          </h2>
          {loading ? (
            <div className="p-12 border-4 border-dashed border-slate-300 rounded-[2rem] text-center text-slate-400 font-bold uppercase tracking-widest">
              LOADING STUDENTS...
            </div>
          ) : students.length === 0 ? (
            <div className="p-12 border-4 border-dashed border-slate-300 rounded-[2rem] text-center text-slate-400 font-bold uppercase tracking-widest">
              NO STUDENTS FOUND. CREATE ONE!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {students.map((student) => (
                <div key={student.id} className="p-6 border-4 border-slate-900 rounded-[2rem] shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] flex flex-col justify-between hover:translate-x-1 transition-transform">
                  <div className="space-y-1 mb-4">
                    <h3 className="font-black text-xl uppercase leading-none">{student.name}</h3>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">ID: {student.externalId}</p>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Level: {student.primaryLevel}</p>
                  </div>
                  <Link 
                    href={`/admin/students/${student.id}`} 
                    className="self-end px-6 py-3 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 active:scale-95 transition-all"
                  >
                    View Neural Map →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}