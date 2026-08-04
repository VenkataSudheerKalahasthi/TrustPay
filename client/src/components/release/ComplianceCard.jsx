import { FileCheck } from 'lucide-react';

export function ComplianceCard({ compliance = [] }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <h3 className="text-lg font-bold text-white flex items-center gap-2">
        <FileCheck className="w-5 h-5 text-purple-400" /> Regulatory & Compliance Certification
      </h3>
      <div className="space-y-3">
        {compliance.map((c, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs p-3 rounded-xl bg-slate-800/40 border border-slate-800">
            <span className="font-bold text-white">{c.standard}</span>
            <span className="font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">{c.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
