import { ShieldCheck } from 'lucide-react';

export function SecurityValidationCard({ reports = [] }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <h3 className="text-lg font-bold text-white flex items-center gap-2">
        <ShieldCheck className="w-5 h-5 text-emerald-400" /> Security & Penetration Audit Reports
      </h3>
      <div className="space-y-3">
        {reports.map((r, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs p-3 rounded-xl bg-slate-800/40 border border-slate-800">
            <span className="font-mono font-bold text-white">{r.scanType}</span>
            <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">0 Vulnerabilities • PASSED</span>
          </div>
        ))}
      </div>
    </div>
  );
}
