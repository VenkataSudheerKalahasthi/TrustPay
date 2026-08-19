import { useState, useEffect } from 'react';
import { analyticsService } from '@services/analytics.service';
import { KPIWidget } from '@components/analytics/KPIWidget';
import { Target, Plus } from 'lucide-react';

export function KPIManagementPage() {
  const [kpis, setKpis] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchKPIs = async () => {
    try {
      setLoading(true);
      const data = await analyticsService.getKPIs();
      setKpis(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKPIs();
  }, []);

  const handleCreateKPI = async () => {
    try {
      await analyticsService.createKPI({
        code: `KPI_CUSTOM_${Date.now()}`,
        name: 'Escrow Settlement Efficiency',
        category: 'FINANCE',
        unit: '%',
        targetValue: 99.5,
        currentValue: 98.2,
      });
      fetchKPIs();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className={`space-y-8 pb-12 transition-opacity ${loading ? 'opacity-50' : ''}`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Target className="w-6 h-6 text-sky-400 dark:text-primary-400" />
            Enterprise Key Performance Indicators (KPIs)
          </h1>
          <p className="text-slate-400 text-sm">Define target values, track current velocity, and monitor variance thresholds</p>
        </div>

        <button
          onClick={handleCreateKPI}
          className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-sky-600/20"
        >
          <Plus className="w-4 h-4" />
          Define KPI Target
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <KPIWidget key={kpi.id || kpi.code} kpi={kpi} />
        ))}
      </div>
    </div>
  );
}
