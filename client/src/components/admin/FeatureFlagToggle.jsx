import { Switch } from '@components/ui/Switch';

export function FeatureFlagToggle({ flag, onToggle }) {
  return (
    <div className="p-4 rounded-2xl bg-surface-900 border border-surface-800 flex items-center justify-between gap-4">
      <div className="space-y-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-surface-100">{flag.name}</span>
          <span className="text-3xs font-mono bg-surface-800 text-primary-400 px-2 py-0.5 rounded font-bold">
            {flag.key}
          </span>
        </div>
        <p className="text-3xs text-surface-400 line-clamp-1">{flag.description}</p>
        <div className="text-3xs font-mono text-surface-500">Rollout: {flag.rolloutPercentage}%</div>
      </div>

      <Switch checked={flag.isEnabled} onChange={(val) => onToggle(flag.id, val)} />
    </div>
  );
}
