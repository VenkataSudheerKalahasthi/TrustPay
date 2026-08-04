import { useState, useEffect } from 'react';
import { analyticsService } from '@services/analytics.service';
import { ForecastChart } from '@components/analytics/ForecastChart';
import { Sparkles, Plus } from 'lucide-react';

export function ForecastPage() {
  const [forecasts, setForecasts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchForecasts = async () => {
    try {
      setLoading(true);
      const data = await analyticsService.getForecasts();
      setForecasts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForecasts();
  }, []);

  const handleRunForecast = async () => {
    try {
      await analyticsService.generateForecast({
        name: `Q4 2026 Workforce Capacity Projection ${new Date().toLocaleTimeString()}`,
        type: 'WORKFORCE',
        algorithm: 'MONTE_CARLO',
        confidence: 95.0,
      });
      fetchForecasts();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className={`space-y-8 pb-12 transition-opacity ${loading ? 'opacity-50' : ''}`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-sky-400" />
            Predictive Business Forecasting Engine
          </h1>
          <p className="text-slate-400 text-sm">Linear regression and Monte Carlo predictive modeling for revenue, GMV, and workforce capacity</p>
        </div>

        <button
          onClick={handleRunForecast}
          className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-sky-600/20"
        >
          <Plus className="w-4 h-4" />
          Run Predictive Forecast
        </button>
      </div>

      <div className="space-y-6">
        {forecasts.length === 0 ? (
          <ForecastChart />
        ) : (
          forecasts.map((f) => <ForecastChart key={f.id} forecast={f} />)
        )}
      </div>
    </div>
  );
}
