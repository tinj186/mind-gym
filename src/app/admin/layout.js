import Link from 'next/link';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from 'next/navigation';
import AdminSidebar from './AdminSidebar';

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || session.user.role !== 'ADMIN') {
    redirect('/hub');
  }

  return (
    <div className="flex min-h-screen bg-slate-800 text-slate-100">
      {/* Sidebar Navigation */}
      <AdminSidebar />

      {/* Main Stage */}
      <main className="flex-1 p-12 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}