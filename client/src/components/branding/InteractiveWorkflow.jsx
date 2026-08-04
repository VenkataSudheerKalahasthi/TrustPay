import { FileCheck, Shield, CheckSquare, Zap } from 'lucide-react';

export function InteractiveWorkflow() {
  const steps = [
    { number: '01', title: 'Contract Creation', desc: 'Define digital milestones, deliverables, and payment terms.', icon: FileCheck },
    { number: '02', title: 'Escrow Deposit', desc: 'Client deposits funds into 100% secured escrow account.', icon: Shield },
    { number: '03', title: 'Milestone Execution', desc: 'Worker delivers milestone deliverables with proof of work.', icon: CheckSquare },
    { number: '04', title: 'Automated Settlement', desc: 'Funds automatically released upon milestone approval.', icon: Zap },
  ];

  return (
    <div id="workflow" className="py-16 px-4 max-w-7xl mx-auto space-y-12">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-extrabold text-white">How TrustPay Works</h2>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">4-step automated escrow lifecycle guaranteeing complete financial protection</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((s, idx) => {
          const IconComp = s.icon;
          return (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3 relative">
              <span className="text-3xl font-extrabold text-slate-800 font-mono absolute top-4 right-4">{s.number}</span>
              <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 w-fit">
                <IconComp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">{s.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
