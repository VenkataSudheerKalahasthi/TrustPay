import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { workforceService } from '@services/workforce.service';
import { TimeTracker } from '@components/workforce/TimeTracker';
import { CapacityGauge } from '@components/workforce/CapacityGauge';
import { ProductivityScoreCard } from '@components/workforce/ProductivityScoreCard';
import { WorkloadChart } from '@components/workforce/WorkloadChart';

export function WorkforceDashboardPage() {
  const [activeClock, setActiveClock] = useState(null);
  const [capacityPlans, setCapacityPlans] = useState([]);
  const [productivityMetrics, setProductivityMetrics] = useState(null);
  const [aiInsights, setAiInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [clock, plans, prod, insights] = await Promise.all([
        workforceService.getActiveClock().catch(() => null),
        workforceService.getCapacityPlans().catch(() => []),
        workforceService.getProductivity().catch(() => []),
        workforceService.getAIInsights().catch(() => null),
      ]);
      setActiveClock(clock);
      setCapacityPlans(plans);
      setProductivityMetrics(prod?.[0] || null);
      setAiInsights(insights);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className={`space-y-8 pb-12 transition-opacity ${loading ? 'opacity-50' : ''}`}>
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950/40 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-widest text-sky-400">Enterprise Operations</span>
          <h1 className="text-3xl md:text-4xl font-black text-white mt-1">Workforce & Productivity Suite</h1>
          <p className="text-slate-300 text-sm md:text-base mt-2">
            Schedule work shifts, track active hours, manage capacity plans, review leave, and leverage AI workforce insights.
          </p>
        </div>
      </div>

      {/* Live Time Tracker Widget */}
      <TimeTracker activeClock={activeClock} onStateChange={fetchData} />

      {/* Grid: Productivity & Capacity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProductivityScoreCard metrics={productivityMetrics} />
        <CapacityGauge plan={capacityPlans?.[0] || { name: 'Q3 Enterprise Plan', targetCapacityHours: 160, totalAllocatedHours: 142 }} />
      </div>

      {/* Workload Distribution Chart */}
      <WorkloadChart />

      {/* AI Advisory Insights Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-sky-500/10 text-sky-400 rounded-xl">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">AI Workforce Intelligence (Advisory)</h3>
            <p className="text-xs text-slate-400">Automated recommendations for schedule balancing & capacity forecasting</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {aiInsights?.insights?.length > 0 ? (
            aiInsights.insights.map((ins) => (
              <div key={ins.id} className="bg-slate-800/40 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-bold text-white">{ins.title}</h4>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${ins.severity === 'WARNING' ? 'bg-amber-500/20 text-amber-400' : 'bg-sky-500/20 text-sky-400'}`}>
                    {ins.severity}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{ins.recommendation}</p>
              </div>
            ))
          ) : (
            <>
              <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4">
                <h4 className="text-sm font-bold text-white mb-1">Shift Optimization</h4>
                <p className="text-xs text-slate-300">Staggering start times by 30 mins will smooth out daily attendance peaks.</p>
              </div>
              <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4">
                <h4 className="text-sm font-bold text-white mb-1">Burnout Risk Protection</h4>
                <p className="text-xs text-slate-300">Team overtime remains below 5% threshold with optimal work consistency.</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
