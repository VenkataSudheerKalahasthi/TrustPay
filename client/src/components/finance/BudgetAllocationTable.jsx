export function BudgetAllocationTable({ allocations = [] }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-800/60 text-slate-400 text-xs font-semibold uppercase">
          <tr>
            <th className="py-3.5 px-4">Department</th>
            <th className="py-3.5 px-4 font-mono">Allocated Budget</th>
            <th className="py-3.5 px-4 font-mono">Spent Amount</th>
            <th className="py-3.5 px-4">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800 text-slate-300">
          {allocations.length === 0 ? (
            <tr>
              <td colSpan={4} className="py-8 text-center text-slate-500 font-medium">
                No department allocations recorded
              </td>
            </tr>
          ) : (
            allocations.map((alloc) => {
              const pct = alloc.allocated > 0 ? Math.round((alloc.spent / alloc.allocated) * 100) : 0;
              return (
                <tr key={alloc.id} className="hover:bg-slate-800/30">
                  <td className="py-3.5 px-4 font-bold text-white uppercase text-xs">{alloc.department}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-sky-400">₹{alloc.allocated.toLocaleString()}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">₹{alloc.spent.toLocaleString()}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                        pct > 100 ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'
                      }`}
                    >
                      {pct}% Used
                    </span>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
