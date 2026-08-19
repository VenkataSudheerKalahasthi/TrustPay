import { useState, useEffect } from 'react';
import { executiveAnalyticsService } from '@services/executiveAnalytics.service';
import { DashboardCustomizationPanel } from '@components/executive-analytics/DashboardCustomizationPanel';
import { Sliders } from 'lucide-react';

export function DashboardCustomizationPage() {
  const [dashboards, setDashboards] = useState([]);
  const [activeDashboard, setActiveDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboards = async () => {
    try {
      setLoading(true);
      const data = await executiveAnalyticsService.getDashboards();
      setDashboards(data);
      if (data.length > 0) setActiveDashboard(data[0]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboards();
  }, []);

  const handleAddWidget = async () => {
    if (!activeDashboard) return;
    const title = prompt('Enter widget title:');
    const metricKey = prompt('Enter metric key (e.g. REVENUE, ESCROW, WORKFORCE):');
    if (title && metricKey) {
      try {
        await executiveAnalyticsService.createDashboard({
          ...activeDashboard,
          widgets: [
            ...(activeDashboard.widgets || []),
            { id: `w_${Date.now()}`, title, type: 'KPI', metricKey, width: 4, height: 3 },
          ],
        });
        fetchDashboards();
      } catch (err) {
        alert(err.response?.data?.message || err.message);
      }
    }
  };

  return (
    <div className={`space-y-8 pb-12 transition-opacity ${loading ? 'opacity-50' : ''}`}>
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Sliders className="w-6 h-6 text-sky-400 dark:text-primary-400" />
          Dashboard Customization & Layout Builder
        </h1>
        <p className="text-slate-400 text-sm">Personalize executive layout grids, place custom metric widgets, and manage dashboard templates</p>
      </div>

      <div className="flex gap-2">
        {dashboards.map((d) => (
          <button
            key={d.id}
            onClick={() => setActiveDashboard(d)}
            className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
              activeDashboard?.id === d.id
                ? 'border-sky-500 bg-sky-500/10 text-white'
                : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            {d.title}
          </button>
        ))}
      </div>

      <DashboardCustomizationPanel dashboard={activeDashboard} onAddWidget={handleAddWidget} />
    </div>
  );
}
