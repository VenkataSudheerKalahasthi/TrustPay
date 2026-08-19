import { MessageSquare, Lock } from 'lucide-react';

export function TicketTimeline({ messages = [] }) {
  return (
    <div className="space-y-4">
      {messages.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-slate-800 rounded-xl">
          <MessageSquare className="w-8 h-8 text-surface-600 mx-auto mb-2" />
          <p className="text-slate-400 text-sm font-medium">No messages posted yet</p>
        </div>
      ) : (
        messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-4 rounded-xl border transition-all ${
              msg.isInternal
                ? 'bg-amber-500/5 border-amber-500/20'
                : 'bg-slate-900 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-sky-500/20 text-sky-400 dark:text-primary-400 flex items-center justify-center font-bold text-xs">
                  {msg.sender?.firstName?.[0] || 'U'}
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                    {msg.sender?.firstName} {msg.sender?.lastName}
                    {msg.isInternal && (
                      <span className="flex items-center gap-0.5 text-[10px] bg-amber-400/10 text-amber-400 px-1.5 py-0.5 rounded font-semibold">
                        <Lock className="w-3 h-3" /> Internal Note
                      </span>
                    )}
                  </h5>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(msg.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap pl-9">{msg.body}</p>
          </div>
        ))
      )}
    </div>
  );
}
