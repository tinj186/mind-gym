import Link from 'next/link';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || session.user.role !== 'ADMIN') {
    redirect('/hub');
  }

  return (
    <div className="flex min-h-screen bg-slate-800 text-slate-100">
      {/* Sidebar Navigation */}
      <aside className="w-48 bg-slate-900 border-r border-slate-700 p-6 flex flex-col gap-8">
        <Link href="/">
          <h1 className="font-black text-xl tracking-tighter italic cursor-pointer text-white">ADMIN.GYM</h1>
        </Link>
        
        <nav className="flex flex-col gap-4 text-sm font-bold text-slate-400">
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

      {/* Main Stage */}
      <main className="flex-1 p-12 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}