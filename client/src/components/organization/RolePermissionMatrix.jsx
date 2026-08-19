import { ShieldCheck } from 'lucide-react';
import { Card } from '@components/ui/Card';

export function RolePermissionMatrix({ effectiveRole = 'MEMBER', permissions = [] }) {
  const allPermissions = [
    { code: 'org:update', label: 'Modify Organization Settings' },
    { code: 'org:invite', label: 'Invite & Resend Invitations' },
    { code: 'org:remove_member', label: 'Remove Members' },
    { code: 'workspace:create', label: 'Create Workspaces' },
    { code: 'project:create', label: 'Create Projects' },
    { code: 'contract:create', label: 'Draft Contracts' },
    { code: 'escrow:manage', label: 'Authorize Escrow Deposits' },
  ];

  const hasAll = permissions.includes('*') || effectiveRole === 'OWNER';

  return (
    <Card className="p-4 bg-card border-surface-200 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-surface-900 flex items-center gap-2">
          <ShieldCheck size={16} className="text-primary-600" />
          <span>Effective Role: <span className="text-primary-600 font-mono">{effectiveRole}</span></span>
        </h3>
        {hasAll && (
          <span className="text-3xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded">
            Full Unrestricted Privileges
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {allPermissions.map((p) => {
          const isAllowed = hasAll || permissions.includes(p.code);
          return (
            <div
              key={p.code}
              className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                isAllowed
                  ? 'bg-surface-100/80 border-surface-300 text-surface-900'
                  : 'bg-card/40 border-surface-200/40 text-surface-500 opacity-60'
              }`}
            >
              <span>{p.label}</span>
              <span className={`text-3xs font-mono px-2 py-0.5 rounded ${isAllowed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-surface-50 text-surface-500'}`}>
                {isAllowed ? 'ALLOWED' : 'DENIED'}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

