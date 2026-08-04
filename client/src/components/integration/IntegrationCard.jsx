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
    <div className="p-4 rounded-2xl bg-surface-900 border border-surface-800 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary-500/10 text-primary-400">
            <Icon size={20} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-surface-100">{integration.name}</h4>
            <span className="text-3xs font-mono uppercase text-surface-400">{integration.category}</span>
          </div>
        </div>

        <Switch checked={isEnabled} onChange={(val) => onToggleStatus(integration.id, val ? 'ACTIVE' : 'DISABLED')} />
      </div>

      <div className="flex items-center justify-between text-3xs pt-2 border-t border-surface-800">
        <span className={`font-mono font-bold ${isConnected ? 'text-emerald-400' : 'text-surface-400'}`}>
          {isConnected ? 'OAuth Connected' : 'Not Connected'}
        </span>

        <button
          onClick={() => onConnect(integration.id)}
          className="text-primary-400 hover:underline font-semibold"
        >
          {isConnected ? 'Re-authorize OAuth' : 'Connect Integration'}
        </button>
      </div>
    </div>
  );
}
