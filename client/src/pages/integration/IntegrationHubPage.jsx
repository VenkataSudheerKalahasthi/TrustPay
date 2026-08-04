import { useState, useEffect } from 'react';
import { Layers } from 'lucide-react';
import { integrationService } from '@services/integration.service';
import { IntegrationCard } from '@components/integration/IntegrationCard';

export function IntegrationHubPage() {
  const [integrations, setIntegrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadIntegrations() {
      try {
        const data = await integrationService.getIntegrations();
        setIntegrations(data.integrations || []);
      } catch (err) {
        console.error('Failed to load integrations directory', err);
      } finally {
        setLoading(false);
      }
    }
    loadIntegrations();
  }, []);

  const handleToggleStatus = async (id, status) => {
    try {
      const updated = await integrationService.toggleIntegration(id, status);
      setIntegrations((prev) => prev.map((item) => (item.id === id ? updated : item)));
    } catch (err) {
      console.error('Failed to toggle integration status', err);
    }
  };

  const handleConnect = async (id) => {
    try {
      await integrationService.connectIntegration(id, { accessToken: 'demo_oauth_token_' + Date.now() });
      alert('OAuth integration connected successfully!');
      const data = await integrationService.getIntegrations();
      setIntegrations(data.integrations || []);
    } catch (err) {
      console.error('Failed to connect integration', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-surface-50 flex items-center gap-2">
          <Layers size={20} className="text-primary-400" />
          <span>Integration Hub & Adapters</span>
        </h1>
        <p className="text-xs text-surface-400">
          Connect TrustPay to Google Calendar, Google Meet, Microsoft Outlook, Slack, Teams, and Zapier.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <p className="text-xs text-surface-400">Loading integrations directory...</p>
        ) : (
          integrations.map((item) => (
            <IntegrationCard
              key={item.id}
              integration={item}
              onToggleStatus={handleToggleStatus}
              onConnect={handleConnect}
            />
          ))
        )}
      </div>
    </div>
  );
}
