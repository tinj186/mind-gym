import Link from 'next/link';

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-white p-8 flex flex-col gap-8">
        <Link href="/">
          <h1 className="font-black text-xl tracking-tighter italic cursor-pointer">ADMIN.GYM</h1>
        </Link>
        
        <nav className="flex flex-col gap-4 text-sm font-bold text-slate-400">
          <Link href="/admin" className="hover:text-blue-400 transition-colors">
            DASHBOARD
          </Link>
          <Link href="/admin/questions" className="hover:text-blue-400 transition-colors">
            QUESTION BANK
          </Link>
          <Link href="/admin/students" className="hover:text-blue-400 transition-colors">
            STUDENT ANALYTICS
          </Link>
          <Link href="/admin/roster" className="hover:text-blue-400 transition-colors">
            USER ROSTER
          </Link>
          <Link href="/admin/settings" className="hover:text-blue-400 transition-colors">
            SYSTEM SETTINGS
          </Link>
        </nav>
      </aside>

      {/* Main Stage */}
      <main className="flex-1 p-12 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}