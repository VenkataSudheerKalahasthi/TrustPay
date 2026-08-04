import { Card } from '@components/ui/Card';
import { KeyValueDisplay } from './KeyValueDisplay';

export function InformationCard({ title, items = [], icon: Icon, className }) {
  return (
    <Card className={className}>
      <Card.Header>
        <div className="flex items-center gap-2">
          {Icon && <Icon size={18} className="text-primary-400" />}
          <Card.Title>{title}</Card.Title>
        </div>
      </Card.Header>
      <Card.Body>
        <KeyValueDisplay items={items} />
      </Card.Body>
    </Card>
  );
}
