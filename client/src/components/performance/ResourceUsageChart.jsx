import { Server } from 'lucide-react';

export function ResourceUsageChart({ cpuPct = 12.4, memoryMb = 184 }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Server className="w-5 h-5 text-sky-400 dark:text-primary-400" /> Runtime Host Telemetry
        </h3>
      </div>
      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="p-4 bg-slate-800/40 border border-slate-800 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase">CPU Utilization</span>
          <h4 className="text-2xl font-bold text-sky-400 dark:text-primary-400">{cpuPct}%</h4>
        </div>
        <div className="p-4 bg-slate-800/40 border border-slate-800 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase">Memory Allocation</span>
          <h4 className="text-2xl font-bold text-purple-400">{memoryMb} MB</h4>
        </div>
      </div>
    </div>
  );
}
