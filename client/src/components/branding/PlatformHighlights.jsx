import { CheckCircle2 } from 'lucide-react';

export function PlatformHighlights() {
  const highlights = [
    'Automated Milestone Escrow Locking & Release',
    'AI-Assisted Contract Analysis & Dispute Evidence',
    'Bank-Grade ISO 27001 & GDPR Compliance',
    'Real-Time Telemetry & Executive Reports',
  ];

  return (
    <div className="py-16 px-4 max-w-5xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold text-white">Built for High-Growth Enterprises</h3>
        <p className="text-slate-400 text-xs">Full regulatory and financial compliance out of the box</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {highlights.map((h, idx) => (
          <div key={idx} className="flex items-center gap-3 bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-sm font-semibold text-white">{h}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
