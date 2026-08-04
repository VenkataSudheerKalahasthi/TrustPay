import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supportService } from '@services/support.service';
import { TicketTimeline } from '@components/support/TicketTimeline';
import { TicketReplyEditor } from '@components/support/TicketReplyEditor';
import { TicketStatusBadge } from '@components/support/TicketStatusBadge';
import { SLAIndicator } from '@components/support/SLAIndicator';
import { ArrowLeft, User, Calendar, ShieldCheck } from 'lucide-react';

export function TicketDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTicket = useCallback(async () => {
    try {
      setLoading(true);
      const data = await supportService.getTicketById(id);
      setTicket(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTicket();
  }, [fetchTicket]);

  const handleStatusChange = async (status) => {
    try {
      await supportService.updateStatus(id, { status });
      fetchTicket();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  if (!ticket && !loading) {
    return (
      <div className="py-12 text-center text-slate-400">
        <p>Support ticket not found.</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-sky-400 font-semibold">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className={`space-y-6 pb-12 transition-opacity ${loading ? 'opacity-50' : ''}`}>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Support Tickets
      </button>

      {ticket && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono text-slate-400 font-semibold">{ticket.ticketNumber}</span>
                <h1 className="text-2xl font-bold text-white mt-0.5">{ticket.subject}</h1>
              </div>

              <div className="flex items-center gap-3">
                <TicketStatusBadge status={ticket.status} />
                <SLAIndicator status={ticket.slaStatus} dueAt={ticket.resolutionDueAt} />
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs text-slate-400 pt-3 border-t border-slate-800">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-500" />
                Requester: {ticket.requesterUser?.firstName} {ticket.requesterUser?.lastName}
              </span>
              <span className="flex items-center gap-1.5 font-mono">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                Opened: {new Date(ticket.createdAt).toLocaleString()}
              </span>
              {ticket.assigneeUser && (
                <span className="flex items-center gap-1.5 text-sky-400 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Assigned Agent: {ticket.assigneeUser.firstName} {ticket.assigneeUser.lastName}
                </span>
              )}
            </div>
          </div>

          {/* Description & Action Panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-2">Original Ticket Query</h3>
            <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">{ticket.description}</p>

            <div className="flex items-center justify-end gap-3 pt-4 mt-6 border-t border-slate-800">
              {ticket.status !== 'RESOLVED' && (
                <button
                  onClick={() => handleStatusChange('RESOLVED')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                >
                  Mark Resolved
                </button>
              )}
              {ticket.status !== 'CLOSED' && (
                <button
                  onClick={() => handleStatusChange('CLOSED')}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl border border-slate-700 transition-all"
                >
                  Close Ticket
                </button>
              )}
            </div>
          </div>

          {/* Timeline & Reply Editor */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Conversation & Reply Log</h3>
            <TicketTimeline messages={ticket.messages} />
            <TicketReplyEditor ticketId={ticket.id} onReplySuccess={fetchTicket} isAgent={true} />
          </div>
        </div>
      )}
    </div>
  );
}
