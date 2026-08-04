import { RuntimeMetricCard } from '@components/performance/RuntimeMetricCard';
import { ResourceUsageChart } from '@components/performance/ResourceUsageChart';

export function RuntimeMonitoringPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-white">Runtime Observability & Host Telemetry</h1>
        <p className="text-slate-400 text-xs">Live server resource allocation, active handles, and garbage collection metrics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <RuntimeMetricCard title="Node.js Active Handles" value="42" status="HEALTHY" />
        <RuntimeMetricCard title="Event Loop Lag" value="1.2 ms" status="LOW" />
        <RuntimeMetricCard title="HTTP Throughput" value="1,240 rps" status="HIGH" />
      </div>

      <ResourceUsageChart cpuPct={12.4} memoryMb={184} />
    </div>
  );
}

export default RuntimeMonitoringPage;
