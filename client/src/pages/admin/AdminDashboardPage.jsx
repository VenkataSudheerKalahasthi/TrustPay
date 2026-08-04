import { useState, useEffect } from 'react';
import { Shield, Users, Building2, FolderOpen, FileText, Wallet, Bot, Radio } from 'lucide-react';
import { adminService } from '@services/admin.service';
import { Card } from '@components/ui/Card';

export function AdminDashboardPage() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMetrics() {
      try {
        const data = await adminService.getOverviewMetrics();
        setMetrics(data.metrics || null);
      } catch (err) {
        console.error('Failed to load admin overview metrics', err);
      } finally {
        setLoading(false);
      }
    }
    loadMetrics();
  }, []);

  const statCards = [
    { title: 'Total Registered Users', val: metrics?.totalUsers || 0, icon: Users, color: 'text-indigo-400' },
    { title: 'Organizations', val: metrics?.totalOrganizations || 0, icon: Building2, color: 'text-sky-400' },
    { title: 'Active Projects', val: metrics?.totalProjects || 0, icon: FolderOpen, color: 'text-amber-400' },
    { title: 'Digital Contracts', val: metrics?.totalContracts || 0, icon: FileText, color: 'text-emerald-400' },
    { title: 'Escrow Volume (₹)', val: `₹${(metrics?.totalEscrowVolume || 0).toLocaleString()}`, icon: Wallet, color: 'text-purple-400' },
    { title: 'AI Tokens Consumed', val: (metrics?.totalAiTokens || 0).toLocaleString(), icon: Bot, color: 'text-pink-400' },
    { title: 'Active Webhooks', val: metrics?.totalWebhooks || 0, icon: Radio, color: 'text-teal-400' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-surface-50 flex items-center gap-2">
          <Shield size={20} className="text-primary-400" />
          <span>Executive Administration Overview</span>
        </h1>
        <p className="text-xs text-surface-400">
          Platform oversight metrics, organization management, feature flags, and system announcements.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-surface-900 border border-surface-800 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((c, idx) => {
            const Icon = c.icon;
            return (
              <Card key={idx} className="p-4 bg-surface-900 border-surface-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-surface-400 font-semibold">{c.title}</span>
                  <div className={`p-2 rounded-xl bg-surface-800 ${c.color}`}>
                    <Icon size={16} />
                  </div>
                </div>
                <div className="text-xl font-bold text-surface-50 font-mono">{c.val}</div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
