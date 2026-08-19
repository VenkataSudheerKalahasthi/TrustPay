import { Check } from 'lucide-react';

export function ReleaseTimeline() {
  const milestones = [
    { phase: 'Phase 1', title: 'Core Escrow, Wallet, Auth & Contracts', status: 'COMPLETED' },
    { phase: 'Phase 2', title: 'Milestone Escrow, Dispute & Multi-Sig Vault', status: 'COMPLETED' },
    { phase: 'Phase 3', title: 'Talent Discovery, AI Matching & Workforce', status: 'COMPLETED' },
    { phase: 'Phase 4', title: 'Enterprise Finance, Analytics & Governance', status: 'COMPLETED' },
    { phase: 'Phase 5', title: 'Admin Control Center, Design System & Final Lock', status: 'CERTIFIED' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <h3 className="text-lg font-bold text-white">TrustPay Roadmap Execution Timeline</h3>
      <div className="space-y-3">
        {milestones.map((m, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs p-3.5 rounded-xl bg-slate-800/40 border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400 font-bold">
                <Check className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="font-bold text-sky-400 dark:text-primary-400 block">{m.phase}</span>
                <span className="text-white font-semibold text-sm">{m.title}</span>
              </div>
            </div>
            <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">{m.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
