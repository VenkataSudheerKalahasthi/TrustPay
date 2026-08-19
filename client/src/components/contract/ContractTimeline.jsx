import { Clock, CheckCircle2, XCircle, FileText, Shield } from 'lucide-react';

export function ContractTimeline({ activities = [] }) {
  if (activities.length === 0) {
    return (
      <div className="text-xs text-surface-600 py-4 text-center">
        No contract history recorded yet.
      </div>
    );
  }

  const getActionIcon = (action) => {
    switch (action) {
      case 'ACCEPTED':
        return <CheckCircle2 size={14} className="text-success-600" />;
      case 'REJECTED':
      case 'CANCELLED':
        return <XCircle size={14} className="text-danger-600" />;
      case 'SIGNATURE_ADDED':
        return <Shield size={14} className="text-primary-600" />;
      default:
        return <FileText size={14} className="text-surface-600" />;
    }
  };

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-surface-50">
      {activities.map((act) => {
        const userName = act.user
          ? `${act.user.firstName || ''} ${act.user.lastName || ''}`
          : 'System';
        const dateStr = act.createdAt
          ? new Date(act.createdAt).toLocaleString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })
          : '';

        return (
          <div key={act.id} className="relative group">
            {/* Timeline node icon */}
            <div className="absolute -left-6 top-0.5 p-1 rounded-full bg-card border border-surface-300">
              {getActionIcon(act.action)}
            </div>

            <div className="bg-card/40 p-3 rounded-xl border border-surface-200/80">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-bold text-surface-800">
                  {act.action.replace('_', ' ')}
                </span>
                <div className="flex items-center gap-1 text-2xs text-surface-500 font-mono">
                  <Clock size={11} />
                  <span>{dateStr}</span>
                </div>
              </div>

              {act.details && (
                <p className="text-xs text-surface-700 leading-relaxed">{act.details}</p>
              )}

              {act.reason && (
                <p className="text-2xs text-danger-600 mt-1 italic">Reason: {act.reason}</p>
              )}

              <div className="mt-2 text-2xs text-surface-500 font-medium">
                By: <span className="text-surface-600">{userName}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

