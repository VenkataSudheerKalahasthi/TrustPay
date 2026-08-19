import { Clock } from 'lucide-react';

export function EnterpriseTimeline({ events = [] }) {
  return (
    <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
      {events.map((ev, idx) => (
        <div key={idx} className="flex items-start gap-4 relative pl-8">
          <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-sky-500/20 border border-sky-500 flex items-center justify-center">
            <Clock className="w-2.5 h-2.5 text-sky-400 dark:text-primary-400" />
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex-1 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <h4 className="font-bold text-white">{ev.title}</h4>
              <span className="text-slate-500 font-mono">{ev.timestamp}</span>
            </div>
            {ev.description && <p className="text-xs text-slate-400">{ev.description}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
