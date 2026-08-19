import { Calendar, Video, MessageSquare, Mail, Zap } from 'lucide-react';
import { Switch } from '@components/ui/Switch';

const INTEGRATION_ICONS = {
  GOOGLE_CALENDAR: Calendar,
  GOOGLE_MEET: Video,
  SLACK: MessageSquare,
  MICROSOFT_OUTLOOK: Mail,
  MICROSOFT_TEAMS: Video,
  ZAPIER: Zap,
};

export function IntegrationCard({ integration, onToggleStatus, onConnect }) {
  const Icon = INTEGRATION_ICONS[integration.code] || Zap;
  const isConnected = integration.credentials && integration.credentials.length > 0;
  const isEnabled = integration.status === 'ACTIVE';

  return (
    <div className="p-4 rounded-2xl bg-card border border-surface-200 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary-50 text-primary-600">
            <Icon size={20} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-surface-900">{integration.name}</h4>
            <span className="text-3xs font-mono uppercase text-surface-600">{integration.category}</span>
          </div>
        </div>

        <Switch checked={isEnabled} onChange={(val) => onToggleStatus(integration.id, val ? 'ACTIVE' : 'DISABLED')} />
      </div>

      <div className="flex items-center justify-between text-3xs pt-2 border-t border-surface-200">
        <span className={`font-mono font-bold ${isConnected ? 'text-emerald-400' : 'text-surface-600'}`}>
          {isConnected ? 'OAuth Connected' : 'Not Connected'}
        </span>

        <button
          onClick={() => onConnect(integration.id)}
          className="text-primary-600 hover:underline font-semibold"
        >
          {isConnected ? 'Re-authorize OAuth' : 'Connect Integration'}
        </button>
      </div>
    </div>
  );
}

