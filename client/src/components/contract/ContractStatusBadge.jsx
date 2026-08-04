import { Badge } from '@components/ui/Badge';

export function ContractStatusBadge({ status }) {
  let variant = 'neutral';
  let label = status || 'DRAFT';

  switch (status) {
    case 'ACCEPTED':
      variant = 'success';
      label = 'Accepted & Active';
      break;
    case 'PENDING_ACCEPTANCE':
    case 'PENDING_REVIEW':
      variant = 'warning';
      label = 'Pending Acceptance';
      break;
    case 'DRAFT':
      variant = 'info';
      label = 'Draft';
      break;
    case 'REJECTED':
    case 'CANCELLED':
      variant = 'danger';
      label = status;
      break;
    case 'EXPIRED':
    case 'ARCHIVED':
      variant = 'neutral';
      label = status;
      break;
    default:
      variant = 'neutral';
  }

  return <Badge variant={variant}>{label}</Badge>;
}
