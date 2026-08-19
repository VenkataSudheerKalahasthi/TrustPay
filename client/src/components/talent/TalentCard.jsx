import { UserCheck, Send, FolderPlus } from 'lucide-react';
import { CandidateScoreCard } from './CandidateScoreCard';
import { AvailabilityBadge } from './AvailabilityBadge';
import { Button } from '@components/ui/Button';

export function TalentCard({ worker, onInvite, onAddToPool }) {
  return (
    <div className="p-5 rounded-2xl bg-card border border-surface-200 space-y-4 hover:border-surface-300 transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 font-bold text-base flex items-center justify-center shrink-0">
            {worker.user?.firstName?.[0] || 'W'}
          </div>
          <div>
            <h4 className="text-xs font-bold text-surface-900 flex items-center gap-2">
              <span>{worker.user?.firstName} {worker.user?.lastName}</span>
              <UserCheck size={14} className="text-emerald-400" />
            </h4>
            <p className="text-3xs font-mono text-surface-600">{worker.title || 'Freelance Specialist'}</p>
          </div>
        </div>

        <CandidateScoreCard score={worker.matchScore?.overallScore || 90} />
      </div>

      <p className="text-xs text-surface-700 line-clamp-2 leading-relaxed">{worker.bio || 'Experienced software engineer specializing in scalable applications and cloud architectures.'}</p>

      <div className="flex items-center justify-between text-3xs font-mono text-surface-600 pt-2 border-t border-surface-200">
        <AvailabilityBadge status={worker.availabilityStatus} />
        <span className="text-emerald-400 font-bold">${worker.hourlyRate || 45}/hr</span>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <Button size="xs" variant="primary" fullWidth onClick={() => onInvite(worker.userId)} leftIcon={<Send size={12} />}>
          Invite to Job
        </Button>
        <Button size="xs" variant="outline" onClick={() => onAddToPool(worker.userId)} leftIcon={<FolderPlus size={12} />}>
          Save to Pool
        </Button>
      </div>
    </div>
  );
}

