import { ShieldCheck, ShieldAlert } from 'lucide-react';
import { Card } from '@components/ui/Card';

export function SecurityScoreCard({ score = 85 }) {
  const isHealthy = score >= 80;

  return (
    <Card className="p-5 bg-surface-900 border-surface-800 flex items-center justify-between">
      <div className="space-y-1">
        <span className="text-xs text-surface-400 font-semibold uppercase tracking-wider">Platform Security Score</span>
        <div className="text-3xl font-bold text-surface-50 font-mono flex items-center gap-2">
          <span>{score}</span>
          <span className="text-xs font-semibold text-surface-400">/ 100</span>
        </div>
        <p className="text-3xs text-surface-400">Computed from active sessions, incidents, and device trust signals.</p>
      </div>

      <div className={`p-4 rounded-2xl border flex items-center justify-center ${isHealthy ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-amber-500/10 border-amber-500/30 text-amber-400'}`}>
        {isHealthy ? <ShieldCheck size={32} /> : <ShieldAlert size={32} />}
      </div>
    </Card>
  );
}
