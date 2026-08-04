import { useState, useEffect } from 'react';
import { supportService } from '@services/support.service';
import { SLAIndicator } from '@components/support/SLAIndicator';
import { ShieldCheck } from 'lucide-react';

export function SLAMonitorPage() {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supportService
      .getSLAPolicies()
      .then((data) => setPolicies(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={`space-y-8 pb-12 transition-opacity ${loading ? 'opacity-50' : ''}`}>
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
          Service Level Agreement (SLA) Monitor
        </h1>
        <p className="text-slate-400 text-sm">Response & resolution deadline rules, target hours, and compliance policies</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {policies.length === 0 ? (
          <>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-bold text-white">Standard Enterprise SLA</h4>
                <SLAIndicator status="ON_TRACK" />
              </div>
              <p className="text-xs text-slate-400">Default policy for all tier-1 enterprise support tickets</p>
              <div className="pt-2 border-t border-slate-800 text-xs space-y-1 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">First Response:</span>
                  <span className="text-white font-bold">2 Hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Resolution Target:</span>
                  <span className="text-white font-bold">24 Hours</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-bold text-white">Critical Incident SLA</h4>
                <SLAIndicator status="AT_RISK" />
              </div>
              <p className="text-xs text-slate-400">Accelerated deadline rules for system outage / financial tickets</p>
              <div className="pt-2 border-t border-slate-800 text-xs space-y-1 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">First Response:</span>
                  <span className="text-amber-400 font-bold">15 Minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Resolution Target:</span>
                  <span className="text-amber-400 font-bold">4 Hours</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          policies.map((p) => (
            <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3">
              <h4 className="text-base font-bold text-white">{p.name}</h4>
              <p className="text-xs text-slate-400">{p.description}</p>
              <div className="pt-2 border-t border-slate-800 text-xs space-y-1 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">First Response:</span>
                  <span className="text-white font-bold">{p.firstResponseTimeMins} mins</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Resolution Target:</span>
                  <span className="text-white font-bold">{p.resolutionTimeMins} mins</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
