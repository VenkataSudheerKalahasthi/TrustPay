export function VersionHistoryTable({ versions = [] }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-800/60 text-slate-400 text-xs font-semibold uppercase">
          <tr>
            <th className="py-3.5 px-4">Version</th>
            <th className="py-3.5 px-4 font-mono">Build #</th>
            <th className="py-3.5 px-4">Release Date</th>
            <th className="py-3.5 px-4">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800 text-slate-300">
          {versions.map((ver) => (
            <tr key={ver.id} className="hover:bg-slate-800/30">
              <td className="py-3.5 px-4 font-mono font-bold text-white">v{ver.version}</td>
              <td className="py-3.5 px-4 font-mono text-sky-400">{ver.buildNumber}</td>
              <td className="py-3.5 px-4 text-xs font-mono text-slate-400">
                {new Date(ver.releaseDate).toLocaleDateString()}
              </td>
              <td className="py-3.5 px-4">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    ver.isCurrent ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {ver.isCurrent ? 'CURRENT' : 'ARCHIVED'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
