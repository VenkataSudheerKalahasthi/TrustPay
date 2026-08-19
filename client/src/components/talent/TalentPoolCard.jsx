import { Folder, Users } from 'lucide-react';
import { Card } from '@components/ui/Card';

export function TalentPoolCard({ pool }) {
  return (
    <Card className="p-4 bg-card border-surface-200 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-primary-50 text-primary-600">
            <Folder size={18} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-surface-900">{pool.name}</h4>
            <span className="text-3xs font-mono text-surface-600">Visibility: {pool.visibility}</span>
          </div>
        </div>

        <span className="flex items-center gap-1 text-3xs font-mono font-bold bg-surface-50 text-surface-700 px-2 py-0.5 rounded">
          <Users size={12} />
          <span>{pool.candidates?.length || 0} Candidates</span>
        </span>
      </div>

      {pool.description && (
        <p className="text-3xs text-surface-600 line-clamp-2">{pool.description}</p>
      )}
    </Card>
  );
}

