import { Inbox } from 'lucide-react';

export function EnterpriseEmptyState({ title = 'No Data Available', description = 'There are no items to display at this time.', action }) {
  return (
    <div className="py-16 px-4 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/50 space-y-3">
      <Inbox className="w-10 h-10 text-slate-600 mx-auto" />
      <h3 className="text-base font-bold text-white">{title}</h3>
      <p className="text-xs text-slate-400 max-w-sm mx-auto">{description}</p>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}
