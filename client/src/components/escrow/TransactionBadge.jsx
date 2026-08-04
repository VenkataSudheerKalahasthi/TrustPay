import { Badge } from '@components/ui/Badge';

export function TransactionBadge({ type }) {
  let variant = 'neutral';
  let label = type || 'TRANSACTION';

  switch (type) {
    case 'DEPOSIT':
      variant = 'success';
      label = 'Deposit';
      break;
    case 'HOLD':
      variant = 'warning';
      label = 'Held in Escrow';
      break;
    case 'RELEASE':
      variant = 'info';
      label = 'Released';
      break;
    case 'REFUND':
      variant = 'danger';
      label = 'Refunded';
      break;
    case 'REVERSAL':
      variant = 'neutral';
      label = 'Reversal';
      break;
    default:
      variant = 'neutral';
  }

  return <Badge variant={variant}>{label}</Badge>;
}
