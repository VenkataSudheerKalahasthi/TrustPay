import { Lock, Unlock } from 'lucide-react';

export function WalletManagementTable({ wallets = [], onToggleFreeze }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-800/60 text-slate-400 text-xs font-semibold uppercase">
          <tr>
            <th className="py-3.5 px-4 font-mono">Wallet ID</th>
            <th className="py-3.5 px-4">Available Balance</th>
            <th className="py-3.5 px-4">Held in Escrow</th>
            <th className="py-3.5 px-4">Status</th>
            <th className="py-3.5 px-4 text-right">Oversight</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800 text-slate-300">
          {wallets.map((w) => (
            <tr key={w.id} className="hover:bg-slate-800/30">
              <td className="py-3.5 px-4 font-mono text-sky-400 dark:text-primary-400 font-bold">{w.id.slice(0, 10)}</td>
              <td className="py-3.5 px-4 font-mono text-emerald-400 font-bold">₹{(w.balance || 0).toLocaleString()}</td>
              <td className="py-3.5 px-4 font-mono text-amber-400">₹{(w.heldInEscrow || 0).toLocaleString()}</td>
              <td className="py-3.5 px-4 font-mono text-xs">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    w.isFrozen ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}
                >
                  {w.isFrozen ? 'FROZEN' : 'ACTIVE'}
                </span>
              </td>
              <td className="py-3.5 px-4 text-right">
                <button
                  onClick={() => onToggleFreeze && onToggleFreeze(w.id, w.isFrozen)}
                  className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    w.isFrozen ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' : 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20'
                  }`}
                  title={w.isFrozen ? 'Unfreeze Wallet' : 'Freeze Wallet'}
                >
                  {w.isFrozen ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
