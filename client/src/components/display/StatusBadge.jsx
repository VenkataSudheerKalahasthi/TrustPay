import { Badge } from '@components/ui/Badge';

export function StatusBadge({ status, size = 'md' }) {
  const statusMap = {
    ACTIVE: { variant: 'success', label: 'Active' },
    COMPLETED: { variant: 'primary', label: 'Completed' },
    PENDING: { variant: 'warning', label: 'Pending' },
    DRAFT: { variant: 'surface', label: 'Draft' },
    CANCELLED: { variant: 'danger', label: 'Cancelled' },
    DISPUTED: { variant: 'danger', label: 'Disputed' },
    IN_ESCROW: { variant: 'secondary', label: 'In Escrow' },
    RELEASED: { variant: 'success', label: 'Released' },
    REFUNDED: { variant: 'warning', label: 'Refunded' },
  };

  const config = statusMap[status?.toUpperCase()] || { variant: 'surface', label: status || 'Unknown' };

  return (
    <Badge variant={config.variant} size={size} dot>
      {config.label}
    </Badge>
  );
}
