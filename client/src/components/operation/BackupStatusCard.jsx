import { Database, CheckCircle2 } from 'lucide-react';
import { Card } from '@components/ui/Card';

export function BackupStatusCard({ backupJob }) {
  return (
    <Card className="p-4 bg-card border-surface-200 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-primary-50 text-primary-600">
            <Database size={18} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-surface-900">{backupJob.name}</h4>
            <span className="text-3xs font-mono text-surface-600">Retention: {backupJob.retentionDays} Days</span>
          </div>
        </div>

        <span className="flex items-center gap-1 text-3xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded">
          <CheckCircle2 size={12} />
          <span>{backupJob.status}</span>
        </span>
      </div>

      <div className="flex items-center justify-between text-3xs font-mono text-surface-600 pt-2 border-t border-surface-200">
        <span>Type: {backupJob.type}</span>
        <span>Created: {new Date(backupJob.createdAt).toLocaleDateString()}</span>
      </div>
    </Card>
  );
}

