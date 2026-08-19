export function EnterpriseTable({ columns = [], data = [], emptyText = 'No records found' }) {
  return (
    <div className="bg-surface-900 border border-surface-800 rounded-2xl overflow-hidden shadow-glow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-surface-800/60 text-surface-400 text-xs font-semibold uppercase">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className="py-3.5 px-4">{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-800 text-surface-300">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-8 text-center text-xs text-surface-500">
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-surface-800/30 transition-colors">
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
