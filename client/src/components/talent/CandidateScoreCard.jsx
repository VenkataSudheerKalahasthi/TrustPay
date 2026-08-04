import { Sparkles } from 'lucide-react';

export function CandidateScoreCard({ score = 88 }) {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-primary-500/10 border border-primary-500/30 text-primary-300 font-mono text-xs font-bold">
      <Sparkles size={14} className="text-primary-400" />
      <span>{score}% Match</span>
    </div>
  );
}
