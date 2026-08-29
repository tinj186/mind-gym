'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="relative flex">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-3 top-6 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white border border-slate-600 transition-colors"
        title={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        )}
      </button>

      {/* Sidebar Content */}
      <aside 
        className={`bg-slate-900 border-r border-slate-700 flex flex-col gap-8 transition-all duration-300 ease-in-out ${
          isOpen ? 'w-48 p-6 opacity-100' : 'w-0 p-0 opacity-0 overflow-hidden'
        }`}
      >
        <Link href="/">
          <h1 className="font-black text-xl tracking-tighter italic cursor-pointer text-white whitespace-nowrap">ADMIN.GYM</h1>
        </Link>
        
        <nav className="flex flex-col gap-4 text-sm font-bold text-slate-400 whitespace-nowrap">
          <Link href="/admin" className="hover:text-slate-100 transition-colors">
            DASHBOARD
          </Link>
          <Link href="/admin/questions" className="hover:text-slate-100 transition-colors">
            QUESTION BANK
          </Link>
          <Link href="/admin/students" className="hover:text-slate-100 transition-colors">
            STUDENT ANALYTICS
          </Link>
          <Link href="/admin/roster" className="hover:text-slate-100 transition-colors">
            USER ROSTER
          </Link>
          <Link href="/admin/settings" className="hover:text-slate-100 transition-colors">
            SYSTEM SETTINGS
          </Link>
          <Link href="/admin/support" className="hover:text-white transition-colors mt-8 pt-8 border-t border-slate-800">
            SUPPORT INBOX
          </Link>
        </nav>
      </aside>
    </div>
  );
}
