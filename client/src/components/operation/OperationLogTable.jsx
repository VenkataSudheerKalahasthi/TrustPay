export function OperationLogTable({ operations = [] }) {
  if (operations.length === 0) {
    return <p className="text-xs text-surface-600 p-4 text-center">No system operations logged yet.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-surface-200 bg-card">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-surface-200 bg-card/60 text-3xs font-mono uppercase text-surface-600">
            <th className="p-3.5">Operation Name</th>
            <th className="p-3.5">Category</th>
            <th className="p-3.5">Status</th>
            <th className="p-3.5">Executed At</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-800 text-xs">
          {operations.map((op) => (
            <tr key={op.id} className="hover:bg-surface-850 transition-colors">
              <td className="p-3.5 font-bold text-surface-900">{op.name}</td>
              <td className="p-3.5 text-3xs font-mono uppercase text-surface-600">{op.category}</td>
              <td className="p-3.5">
                <span className="text-3xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded">
                  {op.status}
                </span>
              </td>
              <td className="p-3.5 text-3xs font-mono text-surface-600">
                {new Date(op.executedAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

