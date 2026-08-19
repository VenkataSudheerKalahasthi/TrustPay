import { useState, useEffect } from 'react';
import { Radio, Plus, Activity } from 'lucide-react';
import { integrationService } from '@services/integration.service';
import { WebhookLogModal } from '@components/integration/WebhookLogModal';
import { Button } from '@components/ui/Button';

export function WebhookPage() {
  const [webhooks, setWebhooks] = useState([]);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [activeModalWebhook, setActiveModalWebhook] = useState(null);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    async function loadWebhooks() {
      try {
        const data = await integrationService.getWebhooks();
        setWebhooks(data.webhooks || []);
      } catch (err) {
        console.error('Failed to load webhooks', err);
      }
    }
    loadWebhooks();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !url) return;
    setRegistering(true);
    try {
      const created = await integrationService.registerWebhook({
        name,
        url,
        events: ['project.created', 'contract.signed', 'escrow.deposited'],
      });
      setWebhooks((prev) => [created, ...prev]);
      setName('');
      setUrl('');
    } catch (err) {
      console.error('Failed to register webhook', err);
    } finally {
      setRegistering(false);
    }
  };

  const handleTestWebhook = async (id) => {
    try {
      await integrationService.testWebhook(id);
      alert('Test webhook payload dispatched successfully!');
    } catch (err) {
      console.error('Failed to dispatch test webhook', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-surface-900 flex items-center gap-2">
          <Radio size={20} className="text-primary-600" />
          <span>Realtime Webhook Subscriptions</span>
        </h1>
        <p className="text-xs text-surface-600">
          Subscribe external endpoints to platform events with HMAC-SHA256 signature verification.
        </p>
      </div>

      <form onSubmit={handleRegister} className="p-4 rounded-2xl bg-card border border-surface-200 flex flex-wrap gap-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Webhook Name..."
          className="flex-1 min-w-[150px] px-4 py-2.5 rounded-xl bg-surface-50 border border-surface-300 text-xs text-surface-900 focus:outline-none focus:border-primary-600"
        />
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://api.yourdomain.com/webhooks"
          className="flex-2 min-w-[250px] px-4 py-2.5 rounded-xl bg-surface-50 border border-surface-300 text-xs text-surface-900 focus:outline-none focus:border-primary-600"
        />
        <Button size="sm" variant="primary" type="submit" isLoading={registering} leftIcon={<Plus size={14} />}>
          Register Webhook
        </Button>
      </form>

      <div className="space-y-3">
        {webhooks.map((wh) => (
          <div key={wh.id} className="p-4 rounded-2xl bg-card border border-surface-200 flex items-center justify-between gap-4">
            <div className="space-y-1 min-w-0">
              <h4 className="text-xs font-bold text-surface-900">{wh.name}</h4>
              <p className="text-3xs font-mono text-surface-600 truncate">{wh.url}</p>
              <div className="flex items-center gap-2 text-3xs font-mono text-surface-500">
                <span>Status: {wh.status}</span>
                <span>Events: {wh.events}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button size="xs" variant="secondary" onClick={() => setActiveModalWebhook(wh)} leftIcon={<Activity size={12} />}>
                Logs
              </Button>
            </div>
          </div>
        ))}
      </div>

      <WebhookLogModal
        isOpen={!!activeModalWebhook}
        onClose={() => setActiveModalWebhook(null)}
        webhook={activeModalWebhook}
        onTest={handleTestWebhook}
      />
    </div>
  );
}

