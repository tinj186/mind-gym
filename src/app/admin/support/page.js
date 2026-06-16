import { prisma } from '@/lib/db';
import Link from 'next/link';
import TicketClientActions from '@/components/admin/TicketClientActions';

export const dynamic = 'force-dynamic';

export default async function SupportInboxPage({ searchParams }) {
  // Await searchParams in case this is running on Next.js 15+
  const params = await searchParams;
  const tab = params?.tab || 'general';
  
  const typeFilter = tab === 'general' ? 'GENERAL' : 'SUBSCRIBER';

  const tickets = await prisma.supportTicket.findMany({
    where: { 
      type: typeFilter,
      status: 'OPEN'
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-4xl font-black text-white tracking-tight uppercase">Support Inbox</h2>
        <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mt-2">Manage Customer Enquiries</p>
      </header>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-600 pb-px">
        <Link 
          href="/admin/support?tab=general" 
          className={`px-6 py-3 font-bold text-sm uppercase tracking-widest border-b-2 transition-colors ${tab === 'general' ? 'border-white text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
        >
          General Enquiries
        </Link>
        <Link 
          href="/admin/support?tab=subscriber" 
          className={`px-6 py-3 font-bold text-sm uppercase tracking-widest border-b-2 transition-colors ${tab === 'subscriber' ? 'border-white text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
        >
          Subscriber Support
        </Link>
      </div>

      {/* Ticket List */}
      <div className="space-y-4">
        {tickets.length === 0 ? (
          <div className="bg-slate-700 p-12 rounded-3xl border border-slate-600 text-center shadow-sm">
            <span className="text-4xl block mb-4">🎉</span>
            <h3 className="text-xl font-black text-white mb-2">Inbox Zero</h3>
            <p className="text-slate-400 font-medium">There are no open {tab} tickets at the moment.</p>
          </div>
        ) : (
          tickets.map(ticket => (
            <div key={ticket.id} className="bg-slate-700 p-6 rounded-3xl border border-slate-600 shadow-sm flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-black text-lg text-white">{ticket.name}</h3>
                  <a href={`mailto:${ticket.email}`} className="text-sm font-bold text-blue-400 hover:underline">
                    {ticket.email}
                  </a>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {new Date(ticket.createdAt).toLocaleString()}
                  </span>
                  <TicketClientActions ticketId={ticket.id} />
                </div>
              </div>
              
              <div className="p-4 bg-slate-800 rounded-xl border border-slate-600/50">
                <p className="text-slate-200 whitespace-pre-wrap text-sm font-medium leading-relaxed">
                  {ticket.message}
                </p>
              </div>

              {tab === 'subscriber' && ticket.userId && (
                <div className="text-xs font-bold text-slate-500">
                  User ID: <span className="font-mono text-slate-400">{ticket.userId}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
