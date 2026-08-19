import { ChevronRight } from 'lucide-react';

export function EnterpriseBreadcrumb({ items = [] }) {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-slate-400">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-1.5">
          {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-surface-600" />}
          {item.href ? (
            <a href={item.href} className="hover:text-white transition-colors">{item.label}</a>
          ) : (
            <span className="font-semibold text-slate-200">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
