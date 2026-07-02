import SupportForm from '@/components/parent/SupportForm';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const metadata = {
  title: 'Technical Support | The Learn Reps'
};

export default async function ParentSupportPage() {
  const session = await getServerSession(authOptions);
  
  return (
    <div className="min-h-screen bg-indigo-50/50">
      <header className="px-6 py-12 max-w-4xl mx-auto">
        <div className="mb-12">
          <span className="text-[10px] font-black text-violet-700 uppercase tracking-widest px-3 py-1 rounded-full border bg-violet-50 border-violet-200 mb-4 inline-block">Support Center</span>
          <h1 className="text-4xl font-black text-indigo-950 tracking-tight uppercase">Technical Support</h1>
          <p className="text-indigo-900/60 font-medium mt-4 text-lg">
            Having an issue with the system or your billing? Submit a ticket below and our technical team will get back to you shortly.
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 pb-16">
        <SupportForm 
          defaultName={session?.user?.name || ''} 
          defaultEmail={session?.user?.email || ''} 
        />
      </main>
    </div>
  );
}
