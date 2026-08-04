import { CheckCircle2, Shield } from 'lucide-react';

export function SubscriptionCard({ plan, isCurrent = false, onSelect }) {
  if (!plan) return null;

  return (
    <div
      className={`bg-slate-900 border rounded-2xl p-6 transition-all flex flex-col justify-between shadow-xl ${
        isCurrent ? 'border-sky-500 ring-2 ring-sky-500/20' : 'border-slate-800 hover:border-slate-700'
      }`}
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-widest">{plan.code}</span>
          {isCurrent && (
            <span className="flex items-center gap-1 text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2.5 py-0.5 rounded-full">
              <Shield className="w-3 h-3" /> Current Plan
            </span>
          )}
        </div>

        <h3 className="text-2xl font-black text-white">{plan.name}</h3>
        <p className="text-xs text-slate-300 mt-1 line-clamp-2">{plan.description}</p>

        <div className="my-6">
          <span className="text-4xl font-black text-white font-mono">₹{plan.priceMonthly}</span>
          <span className="text-xs text-slate-400 font-semibold"> / month</span>
        </div>

        <div className="space-y-2.5 pt-4 border-t border-slate-800 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Up to {plan.maxProjects} active projects</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Up to {plan.maxUsers} team members</span>
          </div>
          {plan.features?.map((feat, idx) => (
            <div key={idx} className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{feat}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <button
          onClick={() => onSelect && onSelect(plan)}
          disabled={isCurrent}
          className={`w-full py-3 rounded-xl text-xs font-bold transition-all shadow-lg ${
            isCurrent
              ? 'bg-slate-800 text-slate-500 cursor-default'
              : 'bg-sky-600 hover:bg-sky-500 text-white shadow-sky-600/20'
          }`}
        >
          {isCurrent ? 'Active Plan' : 'Select Plan'}
        </button>
      </div>
    </div>
  );
}
