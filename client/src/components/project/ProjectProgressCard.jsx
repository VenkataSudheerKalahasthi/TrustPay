import { CheckCircle2, FileCheck2 } from 'lucide-react';
import { Card } from '@components/ui/Card';

export function ProjectProgressCard({ metrics = {} }) {
  const {
    progressPercentage = 0,
    completedMilestonesCount = 0,
    totalMilestonesCount = 0,
    approvedDeliverablesCount = 0,
    totalDeliverablesCount = 0,
  } = metrics;

  return (
    <Card className="p-5 bg-card border-surface-200">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-surface-600">
          Auto-Calculated Project Completion
        </span>
        <span className="text-lg font-bold text-primary-600">{progressPercentage}%</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-surface-50 h-2.5 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-gradient-to-r from-primary-500 to-indigo-500 dark:to-secondary-500 transition-all duration-500 rounded-full"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-surface-50/50 border border-surface-300/50">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <div>
            <span className="text-surface-600 block text-2xs">Milestones Done</span>
            <span className="font-semibold text-surface-900">
              {completedMilestonesCount} / {totalMilestonesCount}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-surface-50/50 border border-surface-300/50">
          <FileCheck2 size={16} className="text-indigo-400 shrink-0" />
          <div>
            <span className="text-surface-600 block text-2xs">Deliverables Approved</span>
            <span className="font-semibold text-surface-900">
              {approvedDeliverablesCount} / {totalDeliverablesCount}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

