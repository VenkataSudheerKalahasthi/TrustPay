export function EnterpriseTable({ columns = [], data = [], emptyText = 'No records found' }) {
  return (
    <div className="bg-card border border-surface-200 rounded-2xl overflow-hidden shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-surface-100/60 text-surface-600 text-xs font-semibold uppercase">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className="py-3.5 px-4">{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-800 text-surface-700">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-8 text-center text-xs text-surface-500">
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-surface-50/30 transition-colors">
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

