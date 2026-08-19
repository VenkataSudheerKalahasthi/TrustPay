import { useState, useEffect } from 'react';
import { analyticsService } from '@services/analytics.service';
import { BusinessInsightCard } from '@components/analytics/BusinessInsightCard';
import { Sparkles } from 'lucide-react';

export function DecisionInsightsPage() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsService
      .getDecisionInsights()
      .then((data) => setInsights(data?.insights || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={`space-y-8 pb-12 transition-opacity ${loading ? 'opacity-50' : ''}`}>
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-sky-400 dark:text-primary-400" />
          AI Decision Support & Strategic Recommendations
        </h1>
        <p className="text-slate-400 text-sm">Automated business anomaly detection, strategic advice, and operational insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {insights.map((ins) => (
          <BusinessInsightCard key={ins.id} insight={ins} />
        ))}
      </div>
    </div>
  );
}
