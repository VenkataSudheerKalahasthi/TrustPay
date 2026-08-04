import { useState, useEffect } from 'react';
import { workforceService } from '@services/workforce.service';
import { ProductivityScoreCard } from '@components/workforce/ProductivityScoreCard';
import { WorkloadChart } from '@components/workforce/WorkloadChart';
import { Award } from 'lucide-react';

export function ProductivityPage() {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    workforceService
      .getProductivity()
      .then((data) => setMetrics(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={`space-y-8 pb-12 transition-opacity ${loading ? 'opacity-50' : ''}`}>
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Award className="w-6 h-6 text-amber-400" />
          Workforce Productivity Analytics
        </h1>
        <p className="text-slate-400 text-sm">Billable utilization, efficiency index, attendance adherence, and idle time trends</p>
      </div>

      <ProductivityScoreCard metrics={metrics?.[0]} />
      <WorkloadChart />
    </div>
  );
}
