import { useState, useEffect } from 'react';
import { executiveAnalyticsService } from '@services/executiveAnalytics.service';
import { ExecutiveKPIWidget } from '@components/executive-analytics/ExecutiveKPIWidget';
import { Target, Plus } from 'lucide-react';

export function KPIBenchmarkPage() {
  const [benchmarks, setBenchmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBenchmarks = async () => {
    try {
      setLoading(true);
      const data = await executiveAnalyticsService.getKPIBenchmarks();
      setBenchmarks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBenchmarks();
  }, []);

  const handleCreateBenchmark = async () => {
    const kpiCode = prompt('Enter KPI code (e.g., REVENUE_RETENTION):');
    const name = prompt('Enter KPI name:');
    const targetValue = parseFloat(prompt('Enter target value (number):'));
    const warningValue = parseFloat(prompt('Enter warning threshold (number):'));

    if (kpiCode && name && !isNaN(targetValue) && !isNaN(warningValue)) {
      try {
        await executiveAnalyticsService.upsertKPIBenchmark(kpiCode, {
          name,
          targetValue,
          warningValue,
          status: 'ON_TARGET',
          unit: '%',
        });
        fetchBenchmarks();
      } catch (err) {
        alert(err.response?.data?.message || err.message);
      }
    }
  };

  return (
    <div className={`space-y-8 pb-12 transition-opacity ${loading ? 'opacity-50' : ''}`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Target className="w-6 h-6 text-sky-400" />
            Enterprise KPI Targets & Benchmarks Scorecard
          </h1>
          <p className="text-slate-400 text-sm">Define strategic target benchmarks and warning thresholds for core platform KPIs</p>
        </div>

        <button
          onClick={handleCreateBenchmark}
          className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-sky-600/20"
        >
          <Plus className="w-4 h-4" />
          Add KPI Benchmark
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {benchmarks.map((kpi) => (
          <ExecutiveKPIWidget key={kpi.id || kpi.kpiCode} kpi={kpi} />
        ))}
      </div>
    </div>
  );
}
