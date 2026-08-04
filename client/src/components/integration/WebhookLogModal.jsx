import { X, Send, CheckCircle2, AlertTriangle } from 'lucide-react';

export function WebhookLogModal({ isOpen, onClose, webhook, onTest }) {
  if (!isOpen || !webhook) return null;

  return (
    <div className="fixed inset-0 z-50 bg-surface-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-xl rounded-2xl bg-surface-900 border border-surface-800 shadow-2xl overflow-hidden flex flex-col max-h-[32rem]">
        <div className="p-4 border-b border-surface-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-surface-100">{webhook.name} Webhook Logs</h3>
            <span className="text-3xs font-mono text-surface-400">{webhook.url}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onTest(webhook.id)}
              className="px-3 py-1 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-3xs font-bold flex items-center gap-1 shadow-glow"
            >
              <Send size={12} />
              <span>Send Test Event</span>
            </button>
            <button onClick={onClose} className="text-surface-400 hover:text-surface-100">
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="p-4 flex-1 overflow-y-auto space-y-2">
          {(!webhook.deliveries || webhook.deliveries.length === 0) ? (
            <p className="text-xs text-surface-400 text-center py-6">No delivery logs recorded yet.</p>
          ) : (
            webhook.deliveries.map((del) => (
              <div key={del.id} className="p-3 rounded-xl bg-surface-800/60 border border-surface-700/60 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-3xs font-mono">
                  <span className="font-bold text-surface-200">{del.event}</span>
                  <span className="flex items-center gap-1">
                    {del.status === 'SENT' ? (
                      <CheckCircle2 size={12} className="text-emerald-400" />
                    ) : (
                      <AlertTriangle size={12} className="text-red-400" />
                    )}
                    <span>HTTP {del.responseCode || 'ERR'}</span>
                  </span>
                </div>
                <pre className="text-3xs font-mono bg-surface-950 p-2 rounded text-surface-300 overflow-x-auto">
                  {del.payloadJson}
                </pre>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
