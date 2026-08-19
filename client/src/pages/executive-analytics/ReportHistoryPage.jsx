import { useState, useEffect } from 'react';
import { executiveAnalyticsService } from '@services/executiveAnalytics.service';
import { History, CheckCircle2 } from 'lucide-react';

export function ReportHistoryPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    executiveAnalyticsService
      .getExecutionLogs()
      .then((data) => setLogs(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={`space-y-8 pb-12 transition-opacity ${loading ? 'opacity-50' : ''}`}>
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <History className="w-6 h-6 text-sky-400 dark:text-primary-400" />
          Report Execution History & Audit Logs
        </h1>
        <p className="text-slate-400 text-sm">Execution duration, generation status, and audit trail for automated reports</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-800/60 text-slate-400 text-xs font-semibold uppercase">
            <tr>
              <th className="py-3.5 px-4">Report Name</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 font-mono">Duration</th>
              <th className="py-3.5 px-4">Executed At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-xs text-slate-500">
                  No execution logs recorded yet
                </td>
              </tr>
            ) : (
              logs.map((l) => (
                <tr key={l.id} className="hover:bg-slate-800/30">
                  <td className="py-3.5 px-4 font-bold text-white">{l.reportName}</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {l.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs text-slate-400">{l.durationMs} ms</td>
                  <td className="py-3.5 px-4 text-xs text-slate-400">{new Date(l.executedAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
