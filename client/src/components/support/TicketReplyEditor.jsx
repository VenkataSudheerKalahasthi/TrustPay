import { useState } from 'react';
import { Send, Lock } from 'lucide-react';
import { supportService } from '@services/support.service';

export function TicketReplyEditor({ ticketId, onReplySuccess, isAgent = false }) {
  const [body, setBody] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!body.trim()) return;
    try {
      setLoading(true);
      await supportService.addMessage(ticketId, {
        body,
        isInternal,
      });
      setBody('');
      if (onReplySuccess) onReplySuccess();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-bold text-slate-300">Post Reply</label>
        {isAgent && (
          <label className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold cursor-pointer">
            <input
              type="checkbox"
              checked={isInternal}
              onChange={(e) => setIsInternal(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-amber-500 focus:ring-0"
            />
            <Lock className="w-3.5 h-3.5" /> Internal Agent Note
          </label>
        )}
      </div>

      <textarea
        rows={4}
        required
        placeholder={isInternal ? 'Type private agent note...' : 'Write reply to customer...'}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-sky-500 resize-none mb-3"
      />

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading || !body.trim()}
          className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-sky-600/20 disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          {isInternal ? 'Post Internal Note' : 'Send Reply'}
        </button>
      </div>
    </form>
  );
}
