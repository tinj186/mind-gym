"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TicketClientActions({ ticketId }) {
  const [isResolving, setIsResolving] = useState(false);
  const router = useRouter();

  const handleResolve = async () => {
    if (!confirm("Mark this ticket as resolved? It will be removed from the open queue.")) return;
    
    setIsResolving(true);
    try {
      const res = await fetch(`/api/support/${ticketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'RESOLVED' })
      });

      if (!res.ok) throw new Error('Failed to update ticket');
      
      // Refresh the page data to remove the resolved ticket
      router.refresh();
    } catch (error) {
      console.error(error);
      alert('Error updating ticket.');
      setIsResolving(false);
    }
  };

  return (
    <button 
      onClick={handleResolve}
      disabled={isResolving}
      className="text-xs font-bold px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors disabled:opacity-50"
    >
      {isResolving ? 'Resolving...' : 'Mark Resolved'}
    </button>
  );
}
