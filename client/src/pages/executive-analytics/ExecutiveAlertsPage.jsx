import { useState, useEffect } from 'react';
import { executiveAnalyticsService } from '@services/executiveAnalytics.service';
import { ExecutiveAlertCard } from '@components/executive-analytics/ExecutiveAlertCard';
import { Bell, Plus } from 'lucide-react';

export function ExecutiveAlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const data = await executiveAnalyticsService.getAlerts();
      setAlerts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleCreateAlert = async () => {
    const title = prompt('Enter alert title:');
    const message = prompt('Enter alert message details:');
    if (title && message) {
      try {
        await executiveAnalyticsService.createAlert({
          title,
          metricKey: 'EXECUTIVE_AUDIT',
          severity: 'HIGH',
          message,
        });
        fetchAlerts();
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
            <Bell className="w-6 h-6 text-sky-400" />
            Executive Anomalies & Threshold Alert Directory
          </h1>
          <p className="text-slate-400 text-sm">Real-time alert notifications for high-value wallet releases, SLA breaches, and system anomalies</p>
        </div>

        <button
          onClick={handleCreateAlert}
          className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-sky-600/20"
        >
          <Plus className="w-4 h-4" />
          Create Alert Rule
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {alerts.length === 0 ? (
          <div className="col-span-full py-16 text-center border border-dashed border-slate-800 rounded-xl bg-slate-900/50">
            <Bell className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-slate-400 font-medium">No executive alerts triggered</p>
          </div>
        ) : (
          alerts.map((alt) => <ExecutiveAlertCard key={alt.id} alert={alt} />)
        )}
      </div>
    </div>
  );
}
