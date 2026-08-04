import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function EnterpriseDropdown({ label, options = [], onSelect }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-white hover:bg-slate-700 transition-all"
      >
        {label}
        <ChevronDown className="w-4 h-4 text-slate-400" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-1 z-50">
          {options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => {
                onSelect(opt);
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
            >
              {opt.label || opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
