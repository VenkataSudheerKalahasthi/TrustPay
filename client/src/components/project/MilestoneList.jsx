import { Plus, CheckCircle, Clock, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Button } from '@components/ui/Button';
import { Badge } from '@components/ui/Badge';
import { Card } from '@components/ui/Card';

export function MilestoneList({ milestones = [], onAdd, onUpdateStatus, isClientOwner, isWorkerAssigned }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-surface-100">Project Milestones</h3>
          <p className="text-xs text-surface-400">
            Sequential project goals with dependency checks and escrow release readiness
          </p>
        </div>
        {(isClientOwner || isWorkerAssigned) && (
          <Button size="sm" onClick={onAdd} leftIcon={<Plus size={14} />}>
            Add Milestone
          </Button>
        )}
      </div>

      {milestones.length === 0 ? (
        <Card className="p-8 text-center bg-surface-900 border-surface-800">
          <Clock className="w-8 h-8 text-surface-600 mx-auto mb-2" />
          <p className="text-xs text-surface-400">No milestones defined for this project yet.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {milestones.map((m, index) => {
            const readiness = m.escrowReadiness || {};
            const isCompleted = m.status === 'COMPLETED';
            const hasPrerequisite = !!m.prerequisiteMilestone;

            return (
              <Card
                key={m.id}
                className="p-4 bg-surface-900 border-surface-800 hover:border-surface-700 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-surface-800 text-surface-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h4 className="text-sm font-semibold text-surface-100">{m.title}</h4>
                        <Badge
                          variant={
                            isCompleted ? 'success' : m.status === 'IN_PROGRESS' ? 'warning' : 'neutral'
                          }
                          size="sm"
                        >
                          {m.status}
                        </Badge>

                        {hasPrerequisite && (
                          <span className="text-2xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <AlertTriangle size={10} />
                            Depends on: {m.prerequisiteMilestone.title}
                          </span>
                        )}
                      </div>

                      {m.description && (
                        <p className="text-xs text-surface-400 mb-2 leading-relaxed">
                          {m.description}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-2xs text-surface-400">
                        {m.dueDate && (
                          <span>Due: {new Date(m.dueDate).toLocaleDateString()}</span>
                        )}
                        {m.estimatedAmount && (
                          <span className="font-semibold text-surface-200">
                            Est. Amount: ₹{m.estimatedAmount.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-surface-800">
                    {readiness.isReleaseEligible ? (
                      <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-xl">
                        <ShieldCheck size={14} />
                        <span className="font-semibold">Escrow Release Ready</span>
                      </div>
                    ) : (
                      <span className="text-2xs text-surface-500">
                        Escrow Ready: No ({readiness.reason || 'Pending tasks'})
                      </span>
                    )}

                    {!isCompleted && (isClientOwner || isWorkerAssigned) && (
                      <Button
                        size="xs"
                        variant="secondary"
                        leftIcon={<CheckCircle size={12} />}
                        onClick={() => onUpdateStatus(m.id, 'COMPLETED')}
                      >
                        Mark Completed
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
