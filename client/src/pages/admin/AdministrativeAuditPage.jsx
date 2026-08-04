import { useState, useEffect } from 'react';
import { adminService } from '@services/admin.service';
import { ShieldCheck } from 'lucide-react';

export function AdministrativeAuditPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService
      .getAdminActionHistory()
      .then((data) => setHistory(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={`space-y-8 pb-12 transition-opacity ${loading ? 'opacity-50' : ''}`}>
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-sky-400" />
          Administrative Audit Log & Action History
        </h1>
        <p className="text-slate-400 text-sm">Full audit trail of administrative interventions, restrictions, freezes, and bulk operations</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-800/60 text-slate-400 text-xs font-semibold uppercase">
            <tr>
              <th className="py-3.5 px-4">Admin</th>
              <th className="py-3.5 px-4 font-mono">Action</th>
              <th className="py-3.5 px-4 font-mono">Target Entity</th>
              <th className="py-3.5 px-4">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {history.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-xs text-slate-500">
                  No administrative actions logged yet
                </td>
              </tr>
            ) : (
              history.map((h) => (
                <tr key={h.id} className="hover:bg-slate-800/30">
                  <td className="py-3.5 px-4 font-bold text-white">
                    {h.admin?.firstName} {h.admin?.lastName} ({h.admin?.email})
                  </td>
                  <td className="py-3.5 px-4 font-mono text-sky-400 text-xs">{h.action}</td>
                  <td className="py-3.5 px-4 font-mono text-xs text-slate-400">
                    {h.targetEntity} ({h.targetId || 'GLOBAL'})
                  </td>
                  <td className="py-3.5 px-4 text-xs font-mono text-slate-400">
                    {new Date(h.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
