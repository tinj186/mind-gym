import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from 'next/link';
import SignOutButton from '@/components/auth/SignOutButton';
import CheckoutButton from '@/components/payments/CheckoutButton';
import { getCurrentStudentId } from '@/lib/auth-utils';
import { prisma } from '@/lib/db';

export default async function GlobalNavbar() {
  const session = await getServerSession(authOptions);
  
  // Fetch the actual student profile associated with this parent if logged in
  let studentName = null;
  let isSubscribed = true;

  if (session) {
    const studentId = await getCurrentStudentId();
    if (studentId) {
      const profile = await prisma.studentProfile.findUnique({ where: { id: studentId } });
      if (profile?.name) studentName = profile.name;
    }

    if (session.user?.email) {
      const user = await prisma.user.findUnique({ where: { email: session.user.email } });
      if (user && user.subscriptionStatus === "INACTIVE") {
        isSubscribed = false;
      }
    }
  }

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50 print:hidden">
      {/* Left: Logo */}
      <Link href="/" className="font-black text-2xl tracking-tighter text-blue-600">
        LEARN<span className="text-slate-800">REPS</span>
      </Link>

      {/* Right: Auth/Action Area */}
      <div className="flex items-center gap-6">
        {session ? (
          <>
            {!isSubscribed && (
              <div className="hidden md:block">
                <CheckoutButton />
              </div>
            )}
            
            <Link href="/hub" className="hidden sm:flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
              <div className="text-right">
                <div className="text-sm font-black text-slate-900 leading-none">{studentName || 'Student'}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Training Ground</div>
              </div>
              <div className="w-10 h-10 bg-gradient-to-tr from-sky-400 to-blue-600 rounded-full flex items-center justify-center text-white font-black text-xl shadow-inner uppercase">
                {(studentName || 'S').charAt(0)}
              </div>
            </Link>

            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

            <div className="flex gap-3 items-center">
              <Link href="/guides" className="hidden lg:block text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors mr-2">Parent Guides</Link>
              <Link href="/parent" className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors shadow-sm">
                <span className="hidden sm:inline">👨‍👩‍👧‍👦</span> Command Center
              </Link>
              <SignOutButton />
            </div>
          </>
        ) : (
          <div className="flex gap-4 items-center">
            <Link href="/guides" className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">Parent Guides</Link>
            <Link href="/login" className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">Sign In</Link>
            <CheckoutButton />
          </div>
        )}
      </div>
    </header>
  );
}
