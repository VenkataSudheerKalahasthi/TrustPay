import { Clock, CheckCircle2, AlertCircle, FileText, Upload, RefreshCw } from 'lucide-react';

const iconMap = {
  CREATED: Clock,
  STARTED: CheckCircle2,
  MILESTONE_CREATED: FileText,
  DELIVERABLE_SUBMITTED: Upload,
  EVIDENCE_UPLOADED: Upload,
  APPROVED: CheckCircle2,
  REJECTED: AlertCircle,
  REVISION_REQUESTED: RefreshCw,
  CANCELLED: AlertCircle,
};

export function ProjectTimeline({ events = [] }) {
  if (!events || events.length === 0) {
    return (
      <div className="text-center py-8 text-xs text-surface-500">
        No timeline events recorded yet.
      </div>
    );
  }

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-surface-50">
      {events.map((event) => {
        const IconComponent = iconMap[event.eventType] || Clock;
        const performedByName = event.performedByUser
          ? `${event.performedByUser.firstName} ${event.performedByUser.lastName}`
          : 'System';

        return (
          <div key={event.id} className="relative group">
            {/* Timeline node */}
            <div className="absolute -left-6 top-0.5 p-1 rounded-full bg-card border border-surface-300 text-surface-600 group-hover:border-primary-600 group-hover:text-primary-600 transition-colors">
              <IconComponent size={12} />
            </div>

            <div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <h4 className="text-xs font-semibold text-surface-900">{event.title}</h4>
                <span className="text-2xs text-surface-500">
                  {new Date(event.createdAt).toLocaleString()}
                </span>
              </div>

              {event.description && (
                <p className="text-xs text-surface-600 leading-relaxed mb-1">
                  {event.description}
                </p>
              )}

              <span className="text-2xs text-surface-500 font-mono">
                By: {performedByName}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

