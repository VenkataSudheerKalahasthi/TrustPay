import { Badge } from '@components/ui/Badge';

const statusConfig = {
  DRAFT: { label: 'Draft', variant: 'neutral' },
  ACTIVE: { label: 'Active', variant: 'success' },
  ON_HOLD: { label: 'On Hold', variant: 'warning' },
  IN_REVIEW: { label: 'In Review', variant: 'secondary' },
  COMPLETED: { label: 'Completed', variant: 'primary' },
  CANCELLED: { label: 'Cancelled', variant: 'danger' },
  ARCHIVED: { label: 'Archived', variant: 'neutral' },
};

export function ProjectStatusBadge({ status = 'DRAFT', size = 'md' }) {
  const config = statusConfig[status] || { label: status, variant: 'neutral' };

  return (
    <Badge variant={config.variant} size={size}>
      {status === 'ACTIVE' && (
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1.5 inline-block" />
      )}
      {config.label}
    </Badge>
  );
}
