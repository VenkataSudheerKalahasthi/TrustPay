import { X } from 'lucide-react';

export function EnterpriseModal({ isOpen, title, onClose, children, maxWidth = 'max-w-md' }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className={`bg-slate-900 border border-slate-800 rounded-2xl ${maxWidth} w-full p-6 space-y-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150`}>
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
