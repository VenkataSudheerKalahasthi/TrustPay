import { CreditCard, CheckCircle2 } from 'lucide-react';

export function PaymentMethodCard({ method }) {
  if (!method) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-sky-500/10 text-sky-400 dark:text-primary-400 rounded-xl">
          <CreditCard className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs font-bold text-white uppercase">{method.type} ({method.provider})</span>
          <p className="text-xs text-slate-400 font-mono">•••• •••• •••• {method.accountLast4 || '4242'}</p>
        </div>
      </div>

      {method.isDefault && (
        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          <CheckCircle2 className="w-3 h-3" /> Default
        </span>
      )}
    </div>
  );
}
