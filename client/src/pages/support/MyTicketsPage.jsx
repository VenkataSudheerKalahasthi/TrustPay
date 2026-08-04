import { useState, useEffect } from 'react';
import { supportService } from '@services/support.service';
import { TicketCard } from '@components/support/TicketCard';
import { CreateTicketModal } from '@components/support/CreateTicketModal';
import { Headset, Plus } from 'lucide-react';

export function MyTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = await supportService.getTickets();
      setTickets(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div className={`space-y-8 pb-12 transition-opacity ${loading ? 'opacity-50' : ''}`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Headset className="w-6 h-6 text-sky-400" />
            Support Ticket Management
          </h1>
          <p className="text-slate-400 text-sm">Submit support requests, monitor ticket progress, and resolve issues</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-sky-600/20"
        >
          <Plus className="w-4 h-4" />
          Open New Ticket
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tickets.length === 0 ? (
          <div className="col-span-full py-16 text-center border border-dashed border-slate-800 rounded-xl bg-slate-900/50">
            <Headset className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-slate-400 font-medium">No active support tickets found</p>
          </div>
        ) : (
          tickets.map((ticket) => <TicketCard key={ticket.id} ticket={ticket} />)
        )}
      </div>

      <CreateTicketModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchTickets}
      />
    </div>
  );
}
