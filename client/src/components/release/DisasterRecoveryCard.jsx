import { Database } from 'lucide-react';

export function DisasterRecoveryCard({ tests = [] }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Database className="w-5 h-5 text-sky-400" /> Disaster Recovery & Failover Verification
        </h3>
      </div>
      <div className="space-y-3">
        {tests.map((t, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs p-3.5 rounded-xl bg-slate-800/40 border border-slate-800">
            <div>
              <h4 className="font-bold text-white text-sm">{t.testScenario}</h4>
              <span className="text-slate-400">RTO: {t.rtoMinutes} min • RPO: {t.rpoMinutes} min</span>
            </div>
            <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">PASSED</span>
          </div>
        ))}
      </div>
    </div>
  );
}
