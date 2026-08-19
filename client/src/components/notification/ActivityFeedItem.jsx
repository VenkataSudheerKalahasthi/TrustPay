import { Avatar } from '@components/ui/Avatar';
import { ShieldCheck } from 'lucide-react';

export function ActivityFeedItem({ activity }) {
  if (!activity) return null;

  const actorName = activity.actorUser
    ? `${activity.actorUser.firstName} ${activity.actorUser.lastName}`
    : 'System Bot';

  return (
    <div className="flex items-start gap-3 p-3.5 rounded-xl bg-card border border-surface-200 hover:border-surface-300 transition-colors">
      <Avatar name={actorName} src={activity.actorUser?.avatar} size="xs" className="mt-0.5 shrink-0" />

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-xs font-semibold text-surface-900">{activity.title}</span>
          <span className="text-3xs text-surface-600 font-mono">
            {new Date(activity.createdAt).toLocaleString()}
          </span>
        </div>

        {activity.description && (
          <p className="text-xs text-surface-700 mb-2 leading-relaxed">{activity.description}</p>
        )}

        <div className="flex items-center gap-3 text-3xs text-surface-600">
          <span className="font-mono font-bold text-primary-600 uppercase bg-primary-50 px-2 py-0.5 rounded">
            {activity.category}
          </span>
          <span className="font-mono text-surface-600 truncate">Actor: {actorName}</span>
          {activity.ipAddress && (
            <span className="font-mono text-surface-500 hidden sm:inline flex items-center gap-1">
              <ShieldCheck size={10} className="text-emerald-400" /> {activity.ipAddress}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

