import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function EnterpriseAccordion({ items = [] }) {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <div className="divide-y divide-slate-800 border border-slate-800 rounded-2xl bg-slate-900 overflow-hidden">
      {items.map((item, idx) => {
        const isOpen = openIdx === idx;
        return (
          <div key={idx} className="p-4 space-y-2">
            <button
              onClick={() => setOpenIdx(isOpen ? null : idx)}
              className="w-full flex items-center justify-between text-left text-sm font-bold text-white"
            >
              {item.title}
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && <div className="text-xs text-slate-300 pt-2 leading-relaxed">{item.content}</div>}
          </div>
        );
      })}
    </div>
  );
}
