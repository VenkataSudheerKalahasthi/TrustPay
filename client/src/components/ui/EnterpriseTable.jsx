export function EnterpriseTable({ columns = [], data = [], emptyText = 'No records found' }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-800/60 text-slate-400 text-xs font-semibold uppercase">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className="py-3.5 px-4">{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800 text-slate-300">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-8 text-center text-xs text-slate-500">
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-slate-800/30">
                {columns.map((col, cIdx) => (
                  <td key={cIdx} className="py-3.5 px-4">
                    {col.render ? col.render(row) : row[col.accessorKey]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
