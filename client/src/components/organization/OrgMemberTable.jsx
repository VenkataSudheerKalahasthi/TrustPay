import { Trash2 } from 'lucide-react';

export function OrgMemberTable({ members = [], onUpdateRole, onRemoveMember }) {
  if (members.length === 0) {
    return <p className="text-xs text-surface-400 p-4 text-center">No members in this organization yet.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-surface-800 bg-surface-900">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-surface-800 bg-surface-950/60 text-3xs font-mono uppercase text-surface-400">
            <th className="p-3.5">Member</th>
            <th className="p-3.5">Role</th>
            <th className="p-3.5">Last Active</th>
            <th className="p-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-800 text-xs">
          {members.map((m) => (
            <tr key={m.id} className="hover:bg-surface-850 transition-colors">
              <td className="p-3.5 font-semibold text-surface-100">
                {m.user?.firstName} {m.user?.lastName}
                <span className="block text-3xs font-mono font-normal text-surface-400">{m.user?.email}</span>
              </td>
              <td className="p-3.5">
                <select
                  value={m.role}
                  onChange={(e) => onUpdateRole(m.userId, e.target.value)}
                  className="bg-surface-800 border border-surface-700 text-xs text-surface-100 rounded-lg px-2 py-1 focus:outline-none focus:border-primary-500"
                >
                  <option value="OWNER">OWNER</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="MANAGER">MANAGER</option>
                  <option value="MEMBER">MEMBER</option>
                  <option value="VIEWER">VIEWER</option>
                </select>
              </td>
              <td className="p-3.5 text-3xs font-mono text-surface-400">
                {m.lastActiveAt ? new Date(m.lastActiveAt).toLocaleDateString() : 'Recently'}
              </td>
              <td className="p-3.5 text-right">
                <button
                  onClick={() => onRemoveMember(m.userId)}
                  className="p-1.5 rounded-lg text-surface-400 hover:text-red-400 hover:bg-surface-800 transition-colors"
                  title="Remove Member"
                >
                  <Trash2 size={14} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
