import { useState } from 'react';
import { Sliders, Sparkles } from 'lucide-react';
import { talentService } from '@services/talent.service';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';

export function CandidateComparisonPage() {
  const [workerUserIds, setWorkerUserIds] = useState('user_1, user_2');
  const [matrix, setMatrix] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleCompare = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const ids = workerUserIds.split(',').map((s) => s.trim()).filter(Boolean);
      const res = await talentService.compareCandidates(ids);
      setMatrix(res.comparisonMatrix || []);
    } catch (err) {
      console.error('Failed to compare candidates', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-surface-900 flex items-center gap-2">
          <Sliders size={20} className="text-primary-600" />
          <span>Side-by-Side Candidate Comparison Matrix</span>
        </h1>
        <p className="text-xs text-surface-600">
          Compare candidate match scores, hourly rates, experience levels, and AI skill gap analysis.
        </p>
      </div>

      <form onSubmit={handleCompare} className="p-4 rounded-2xl bg-card border border-surface-200 flex gap-2">
        <input
          type="text"
          value={workerUserIds}
          onChange={(e) => setWorkerUserIds(e.target.value)}
          placeholder="Enter comma-separated Worker User IDs..."
          className="flex-1 px-3 py-2 rounded-xl bg-surface-50 border border-surface-300 text-xs text-surface-900 focus:outline-none focus:border-primary-600"
        />
        <Button size="sm" variant="primary" type="submit" isLoading={loading} leftIcon={<Sparkles size={14} />}>
          Compare Candidates
        </Button>
      </form>

      {matrix.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matrix.map((item, idx) => (
            <Card key={idx} className="p-5 bg-card border-surface-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-surface-900">
                  {item.worker?.user?.firstName || `Candidate #${idx + 1}`} {item.worker?.user?.lastName}
                </h4>
                <span className="text-xs font-mono font-bold text-primary-600">
                  {item.matchingScore?.overallScore}% Match
                </span>
              </div>

              <div className="text-3xs font-mono text-surface-600 space-y-1 pt-2 border-t border-surface-200">
                <p>Skill Match: <strong className="text-emerald-400">{item.matchingScore?.skillMatchPct}%</strong></p>
                <p>Experience Match: <strong className="text-amber-400">{item.matchingScore?.experienceMatchPct}%</strong></p>
                <p>Rating Score: <strong className="text-sky-400 dark:text-primary-400">{item.matchingScore?.ratingScorePct}%</strong></p>
              </div>

              <div className="p-3 rounded-xl bg-card text-3xs text-surface-700 space-y-1">
                <p className="font-bold text-primary-700">Skill Gap Recommendation Note:</p>
                <p>{item.skillGap?.recommendationNote}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

