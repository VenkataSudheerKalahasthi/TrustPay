import { useState, useEffect } from 'react';
import { analyticsService } from '@services/analytics.service';
import { TrendChart } from '@components/analytics/TrendChart';
import { ScorecardTable } from '@components/analytics/ScorecardTable';
import { BarChart3 } from 'lucide-react';

export function BusinessIntelligencePage() {
  const [scorecards, setScorecards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsService
      .getScorecards()
      .then((data) => setScorecards(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={`space-y-8 pb-12 transition-opacity ${loading ? 'opacity-50' : ''}`}>
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-sky-400 dark:text-primary-400" />
          Enterprise Business Intelligence Hub
        </h1>
        <p className="text-slate-400 text-sm">Cross-module operational BI data breakdown, trend exploration, and scorecards</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendChart title="Platform Revenue Velocity (30-Day Trend)" />
        <TrendChart title="Workforce Productivity Velocity Index" />
      </div>

      {scorecards.length > 0 && <ScorecardTable scorecard={scorecards[0]} />}
    </div>
  );
}
