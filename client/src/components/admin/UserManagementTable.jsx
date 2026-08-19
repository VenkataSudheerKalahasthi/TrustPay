import { UserX, ShieldAlert, CheckCircle2 } from 'lucide-react';

export function UserManagementTable({ users = [], onToggleSuspend, onRestrict }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-800/60 text-slate-400 text-xs font-semibold uppercase">
          <tr>
            <th className="py-3.5 px-4">User</th>
            <th className="py-3.5 px-4 font-mono">Role</th>
            <th className="py-3.5 px-4">Verification</th>
            <th className="py-3.5 px-4">Status</th>
            <th className="py-3.5 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800 text-slate-300">
          {users.map((usr) => (
            <tr key={usr.id} className="hover:bg-slate-800/30">
              <td className="py-3.5 px-4">
                <span className="font-bold text-white block">{usr.firstName} {usr.lastName}</span>
                <span className="text-xs text-slate-400 font-mono">{usr.email}</span>
              </td>
              <td className="py-3.5 px-4 font-mono text-sky-400 dark:text-primary-400 text-xs">{usr.role}</td>
              <td className="py-3.5 px-4">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    usr.isVerified
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}
                >
                  {usr.isVerified ? 'VERIFIED' : 'UNVERIFIED'}
                </span>
              </td>
              <td className="py-3.5 px-4">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    usr.isActive
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}
                >
                  {usr.isActive ? 'ACTIVE' : 'SUSPENDED'}
                </span>
              </td>
              <td className="py-3.5 px-4 text-right space-x-2">
                <button
                  onClick={() => onToggleSuspend && onToggleSuspend(usr.id, usr.isActive)}
                  className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    usr.isActive ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                  }`}
                  title={usr.isActive ? 'Suspend User' : 'Restore User'}
                >
                  {usr.isActive ? <UserX className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => onRestrict && onRestrict(usr)}
                  className="p-1.5 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 rounded-lg text-xs font-semibold"
                  title="Restrict Access"
                >
                  <ShieldAlert className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
