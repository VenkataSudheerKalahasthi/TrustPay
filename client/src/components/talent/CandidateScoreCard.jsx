import { Sparkles } from 'lucide-react';

export function CandidateScoreCard({ score = 88 }) {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-primary-50 border border-primary-600/30 text-primary-700 font-mono text-xs font-bold">
      <Sparkles size={14} className="text-primary-600" />
      <span>{score}% Match</span>
    </div>
  );
}

