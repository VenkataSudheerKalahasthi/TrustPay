import { Link } from 'react-router-dom';
import { TicketStatusBadge } from './TicketStatusBadge';
import { Clock, User } from 'lucide-react';

export function TicketCard({ ticket }) {
  if (!ticket) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all shadow-md">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <span className="text-xs font-mono text-slate-400 font-semibold">{ticket.ticketNumber}</span>
          <h4 className="text-base font-bold text-white mt-0.5 line-clamp-1">
            <Link to={`/dashboard/client/support/tickets/${ticket.id}`} className="hover:text-sky-400 dark:text-primary-400 transition-colors">
              {ticket.subject}
            </Link>
          </h4>
        </div>
        <TicketStatusBadge status={ticket.status} />
      </div>

      <p className="text-xs text-slate-300 line-clamp-2 mb-4 leading-relaxed">{ticket.description}</p>

      <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-slate-500" />
            {ticket.requesterUser?.firstName || 'Requester'}
          </span>
          <span className="flex items-center gap-1 font-mono">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            {new Date(ticket.createdAt).toLocaleDateString()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
              ticket.priority === 'CRITICAL' || ticket.priority === 'URGENT'
                ? 'bg-rose-500/20 text-rose-400'
                : 'bg-slate-800 text-slate-300'
            }`}
          >
            {ticket.priority}
          </span>
        </div>
      </div>
    </div>
  );
}
