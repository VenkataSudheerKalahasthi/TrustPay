import { ActivityFeedItem } from './ActivityFeedItem';
import { Activity } from 'lucide-react';

export function ActivityTimeline({ activities = [] }) {
  if (activities.length === 0) {
    return (
      <div className="p-8 text-center bg-surface-900 border border-surface-800 rounded-2xl">
        <Activity className="w-8 h-8 text-surface-600 mx-auto mb-2" />
        <p className="text-xs text-surface-400">No activity feed records found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((act) => (
        <ActivityFeedItem key={act.id} activity={act} />
      ))}
    </div>
  );
}
