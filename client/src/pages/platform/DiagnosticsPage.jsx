import { useState, useEffect } from 'react';
import { platformService } from '@services/platform.service';
import { DiagnosticReportCard } from '@components/platform/DiagnosticReportCard';
import { Activity, Play } from 'lucide-react';

export function DiagnosticsPage() {
  const [diagnostics, setDiagnostics] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDiagnostics = async () => {
    try {
      setLoading(true);
      const data = await platformService.getDiagnosticHistory();
      setDiagnostics(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiagnostics();
  }, []);

  const handleRunDiagnostics = async () => {
    try {
      await platformService.runDiagnostics('DATABASE');
      fetchDiagnostics();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className={`space-y-8 pb-12 transition-opacity ${loading ? 'opacity-50' : ''}`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-sky-400" />
            System Diagnostics & Data Integrity Suite
          </h1>
          <p className="text-slate-400 text-sm">Execute automated database pool checks, schema constraint verification, and API gateway latencies</p>
        </div>

        <button
          onClick={handleRunDiagnostics}
          className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-sky-600/20"
        >
          <Play className="w-4 h-4" />
          Run Diagnostic Test
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {diagnostics.length === 0 ? (
          <div className="col-span-full py-16 text-center border border-dashed border-slate-800 rounded-xl bg-slate-900/50">
            <Activity className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-slate-400 font-medium">No diagnostic tests logged yet</p>
          </div>
        ) : (
          diagnostics.map((diag) => <DiagnosticReportCard key={diag.id} diagnostic={diag} />)
        )}
      </div>
    </div>
  );
}
