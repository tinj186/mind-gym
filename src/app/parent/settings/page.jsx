import ChangePasswordForm from '@/components/parent/ChangePasswordForm';
import UpdateProfileForm from '@/components/parent/UpdateProfileForm';
import Link from 'next/link';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export const metadata = {
  title: 'Settings | The Learn Reps'
};

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-indigo-50/50">
      <header className="px-6 py-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-12">
          <div>
            <span className="text-[10px] font-black text-violet-700 uppercase tracking-widest px-3 py-1 rounded-full border bg-violet-50 border-violet-200 mb-4 inline-block">Account Settings</span>
            <div className="flex items-center gap-6">
              <h1 className="text-4xl font-black text-indigo-950 tracking-tight uppercase">Settings</h1>
              <Link 
                href="/parent" 
                className="px-6 py-2 bg-indigo-100 text-indigo-900 font-bold rounded-xl hover:bg-indigo-200 transition-colors text-sm"
              >
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pb-16 space-y-8">
        <UpdateProfileForm 
          defaultName={session?.user?.name || ''} 
          defaultEmail={session?.user?.email || ''} 
        />
        <ChangePasswordForm />
      </main>
    </div>
  );
}
