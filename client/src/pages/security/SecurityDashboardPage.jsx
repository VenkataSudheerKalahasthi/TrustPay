import { useState, useEffect } from 'react';
import { Shield, Smartphone, Key } from 'lucide-react';
import { securityService } from '@services/security.service';
import { SecurityScoreCard } from '@components/security/SecurityScoreCard';
import { SecurityAlertCard } from '@components/security/SecurityAlertCard';
import { Card } from '@components/ui/Card';

export function SecurityDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await securityService.getDashboard();
        setData(res);
      } catch (err) {
        console.error('Failed to load security dashboard', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-surface-50 flex items-center gap-2">
          <Shield size={20} className="text-primary-400" />
          <span>Security Center & Session Auditing</span>
        </h1>
        <p className="text-xs text-surface-400">
          Monitor platform security health score, login history, trusted devices, and active sessions.
        </p>
      </div>

      {loading ? (
        <p className="text-xs text-surface-400">Loading security intelligence...</p>
      ) : (
        <>
          <SecurityScoreCard score={data?.securityScore || 85} />

          {/* Security Incidents & Alerts */}
          {data?.incidents && data.incidents.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-surface-200 uppercase tracking-wider">Security Incidents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.incidents.map((inc) => (
                  <SecurityAlertCard key={inc.id} incident={inc} />
                ))}
              </div>
            </div>
          )}

          {/* Active Sessions & Trusted Devices Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4 bg-surface-900 border-surface-800 space-y-3">
              <h3 className="text-xs font-bold text-surface-100 flex items-center gap-2">
                <Key size={14} className="text-primary-400" />
                <span>Active Sessions ({data?.activeSessions?.length || 0})</span>
              </h3>
              <div className="space-y-1.5">
                {data?.activeSessions?.map((s) => (
                  <div key={s.id} className="flex items-center justify-between p-2 rounded-xl bg-surface-800/60 text-xs font-semibold text-surface-200">
                    <div>
                      <span>Session ID: {s.sessionId.substring(0, 10)}...</span>
                      <span className="block text-3xs font-mono text-surface-400">IP: {s.ipAddress || '127.0.0.1'}</span>
                    </div>
                    <button
                      onClick={async () => {
                        await securityService.revokeSession(s.sessionId);
                        setData((prev) => ({
                          ...prev,
                          activeSessions: prev.activeSessions.filter((x) => x.sessionId !== s.sessionId),
                        }));
                      }}
                      className="text-3xs font-bold text-red-400 hover:underline"
                    >
                      Revoke
                    </button>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4 bg-surface-900 border-surface-800 space-y-3">
              <h3 className="text-xs font-bold text-surface-100 flex items-center gap-2">
                <Smartphone size={14} className="text-emerald-400" />
                <span>Trusted Devices ({data?.trustedDevices?.length || 0})</span>
              </h3>
              <div className="space-y-1.5">
                {data?.trustedDevices?.map((d) => (
                  <div key={d.id} className="flex items-center justify-between p-2 rounded-xl bg-surface-800/60 text-xs font-semibold text-surface-200">
                    <span>{d.deviceName}</span>
                    <span className="text-3xs font-mono text-emerald-400 font-bold">TRUSTED</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
