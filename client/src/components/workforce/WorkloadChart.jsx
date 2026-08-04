import { BarChart3 } from 'lucide-react';

export function WorkloadChart() {
  const defaultBars = [
    { day: 'Mon', billable: 7.5, idle: 0.5 },
    { day: 'Tue', billable: 8.0, idle: 0.2 },
    { day: 'Wed', billable: 7.8, idle: 0.4 },
    { day: 'Thu', billable: 8.2, idle: 0.1 },
    { day: 'Fri', billable: 7.0, idle: 0.8 },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-sky-400" />
            Workload & Hours Distribution
          </h3>
          <p className="text-xs text-slate-400">Billable hours vs idle time tracking</p>
        </div>
      </div>

      <div className="space-y-4">
        {defaultBars.map((bar) => {
          const total = bar.billable + bar.idle;
          const billablePct = (bar.billable / total) * 100;
          return (
            <div key={bar.day} className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">{bar.day}</span>
                <span className="text-slate-400">
                  <span className="text-emerald-400">{bar.billable}h billable</span> / {bar.idle}h idle
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden flex">
                <div className="bg-emerald-400 h-full" style={{ width: `${billablePct}%` }} />
                <div className="bg-amber-400/60 h-full" style={{ width: `${100 - billablePct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
