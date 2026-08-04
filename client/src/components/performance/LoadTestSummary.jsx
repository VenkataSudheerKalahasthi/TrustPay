import { Cpu } from 'lucide-react';

export function LoadTestSummary({ results = [] }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-rose-400" /> Stress Test Concurrency Results
        </h3>
      </div>
      <div className="space-y-3">
        {results.map((l, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs p-4 rounded-xl bg-slate-800/40 border border-slate-800">
            <div>
              <h4 className="font-bold text-white text-sm">{l.scenarioName}</h4>
              <span className="text-slate-400">{l.concurrentUsers} Concurrent Users • {l.durationSec}s Duration</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-extrabold text-emerald-400 block">{l.throughputRps} req/sec</span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">{l.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
