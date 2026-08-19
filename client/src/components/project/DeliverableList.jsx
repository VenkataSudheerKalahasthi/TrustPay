import { Plus, History, Upload, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { Button } from '@components/ui/Button';
import { Badge } from '@components/ui/Badge';
import { Card } from '@components/ui/Card';

const deliverableBadgeConfig = {
  DRAFT: { label: 'Draft', variant: 'neutral' },
  SUBMITTED: { label: 'Submitted', variant: 'warning' },
  UNDER_REVIEW: { label: 'Under Review', variant: 'secondary' },
  APPROVED: { label: 'Approved', variant: 'success' },
  REVISION_REQUESTED: { label: 'Revision Requested', variant: 'warning' },
  REJECTED: { label: 'Rejected', variant: 'danger' },
};

export function DeliverableList({
  deliverables = [],
  onAdd,
  onSubmitVersion,
  onReview,
  onViewHistory,
  isClientOwner,
  isWorkerAssigned,
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-surface-900">Project Deliverables</h3>
          <p className="text-xs text-surface-600">
            Immutable versioned deliverable submissions and client approval workflow
          </p>
        </div>
        {(isClientOwner || isWorkerAssigned) && (
          <Button size="sm" onClick={onAdd} leftIcon={<Plus size={14} />}>
            New Deliverable
          </Button>
        )}
      </div>

      {deliverables.length === 0 ? (
        <Card className="p-8 text-center bg-card border-surface-200">
          <p className="text-xs text-surface-600">No deliverables recorded for this project yet.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {deliverables.map((d) => {
            const config = deliverableBadgeConfig[d.status] || { label: d.status, variant: 'neutral' };
            const canWorkerSubmit = isWorkerAssigned && (d.status === 'DRAFT' || d.status === 'REVISION_REQUESTED' || d.status === 'REJECTED');
            const canClientReview = isClientOwner && (d.status === 'SUBMITTED' || d.status === 'UNDER_REVIEW');

            return (
              <Card key={d.id} className="p-4 bg-card border-surface-200 hover:border-surface-300 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h4 className="text-sm font-semibold text-surface-900">{d.title}</h4>
                      <Badge variant={config.variant} size="sm">
                        {config.label}
                      </Badge>
                      <span className="text-2xs font-mono text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
                        v{d.currentVersion}
                      </span>
                    </div>

                    {d.description && (
                      <p className="text-xs text-surface-600 mb-2 leading-relaxed">
                        {d.description}
                      </p>
                    )}

                    {d.clientFeedback && (
                      <div className="p-2.5 rounded-xl bg-surface-100/80 border border-surface-300/60 text-xs text-surface-700 mb-2">
                        <span className="font-semibold text-surface-800 block text-2xs mb-0.5">Client Feedback:</span>
                        {d.clientFeedback}
                      </div>
                    )}

                    <div className="flex items-center gap-3 text-2xs text-surface-500">
                      {d.milestone && <span>Milestone: {d.milestone.title}</span>}
                      <span>Revisions: {d.revisionCount}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <Button
                      size="xs"
                      variant="ghost"
                      leftIcon={<History size={12} />}
                      onClick={() => onViewHistory(d)}
                    >
                      History ({d.versions?.length || 1})
                    </Button>

                    {canWorkerSubmit && (
                      <Button
                        size="xs"
                        variant="primary"
                        leftIcon={<Upload size={12} />}
                        onClick={() => onSubmitVersion(d)}
                      >
                        Submit v{d.versions?.length ? d.versions.length + 1 : 1}
                      </Button>
                    )}

                    {canClientReview && (
                      <div className="flex items-center gap-1.5">
                        <Button
                          size="xs"
                          variant="success"
                          leftIcon={<CheckCircle2 size={12} />}
                          onClick={() => onReview(d, 'APPROVED')}
                        >
                          Approve
                        </Button>
                        <Button
                          size="xs"
                          variant="warning"
                          leftIcon={<RefreshCw size={12} />}
                          onClick={() => onReview(d, 'REVISION_REQUESTED')}
                        >
                          Request Revision
                        </Button>
                        <Button
                          size="xs"
                          variant="danger"
                          leftIcon={<XCircle size={12} />}
                          onClick={() => onReview(d, 'REJECTED')}
                        >
                          Reject
                        </Button>
                      </div>
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

