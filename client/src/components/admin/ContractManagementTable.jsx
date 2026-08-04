import { Flag } from 'lucide-react';

export function ContractManagementTable({ contracts = [], onFlagContract }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-800/60 text-slate-400 text-xs font-semibold uppercase">
          <tr>
            <th className="py-3.5 px-4 font-mono">Contract #</th>
            <th className="py-3.5 px-4">Title</th>
            <th className="py-3.5 px-4">Total Amount</th>
            <th className="py-3.5 px-4">Status</th>
            <th className="py-3.5 px-4 text-right">Oversight</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800 text-slate-300">
          {contracts.map((ctr) => (
            <tr key={ctr.id} className="hover:bg-slate-800/30">
              <td className="py-3.5 px-4 font-mono text-sky-400 font-bold">{ctr.contractNumber || ctr.id.slice(0, 8)}</td>
              <td className="py-3.5 px-4 font-bold text-white">{ctr.title}</td>
              <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">₹{(ctr.totalAmount || 0).toLocaleString()}</td>
              <td className="py-3.5 px-4 font-mono text-xs text-slate-400">{ctr.status}</td>
              <td className="py-3.5 px-4 text-right">
                <button
                  onClick={() => onFlagContract && onFlagContract(ctr)}
                  className="p-1.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 rounded-lg text-xs font-semibold"
                  title="Flag for Oversight"
                >
                  <Flag className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
