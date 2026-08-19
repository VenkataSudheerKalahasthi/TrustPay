import { Database } from 'lucide-react';

export function SlowQueryTable({ queries = [] }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Database className="w-5 h-5 text-sky-400 dark:text-primary-400" /> Database Query Profiler
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-800/60 text-slate-400 font-semibold uppercase">
            <tr>
              <th className="py-3 px-4">Query Signature</th>
              <th className="py-3 px-4">Latency</th>
              <th className="py-3 px-4">Recommended Index</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {queries.map((q, idx) => (
              <tr key={idx} className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-mono text-slate-200">{q.querySignature}</td>
                <td className="py-3 px-4 font-bold text-amber-400">{q.executionMs} ms</td>
                <td className="py-3 px-4 font-mono text-sky-400 dark:text-primary-400">{q.indexRecommended || 'N/A'}</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Optimized</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
