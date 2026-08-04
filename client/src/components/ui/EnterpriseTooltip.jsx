import { useState } from 'react';

export function EnterpriseTooltip({ content, children }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative inline-block" onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
      {children}
      {visible && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 text-xs font-semibold text-white bg-slate-800 border border-slate-700 rounded-lg shadow-xl whitespace-nowrap z-50">
          {content}
        </div>
      )}
    </div>
  );
}
