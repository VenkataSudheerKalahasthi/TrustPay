import { useState, useEffect } from 'react';
import { Key, Plus } from 'lucide-react';
import { integrationService } from '@services/integration.service';
import { ApiKeyCard } from '@components/integration/ApiKeyCard';
import { Button } from '@components/ui/Button';

export function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState([]);
  const [name, setName] = useState('');
  const [newRawKey, setNewRawKey] = useState(null);
  const [newKeyObj, setNewKeyObj] = useState(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    async function loadKeys() {
      try {
        const data = await integrationService.getApiKeys();
        setApiKeys(data.apiKeys || []);
      } catch (err) {
        console.error('Failed to load API keys', err);
      }
    }
    loadKeys();
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setGenerating(true);
    try {
      const res = await integrationService.generateApiKey({ name });
      setNewRawKey(res.rawKey);
      setNewKeyObj(res.apiKey);
      setApiKeys((prev) => [res.apiKey, ...prev]);
      setName('');
    } catch (err) {
      console.error('Failed to generate API key', err);
    } finally {
      setGenerating(false);
    }
  };

  const handleRevoke = async (id) => {
    try {
      await integrationService.revokeApiKey(id);
      setApiKeys((prev) => prev.filter((k) => k.id !== id));
    } catch (err) {
      console.error('Failed to revoke API key', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-surface-900 flex items-center gap-2">
          <Key size={20} className="text-primary-600" />
          <span>Public REST API Keys</span>
        </h1>
        <p className="text-xs text-surface-600">
          Generate API keys for external REST API integration with SHA-256 secret hashing.
        </p>
      </div>

      <form onSubmit={handleGenerate} className="p-4 rounded-2xl bg-card border border-surface-200 flex gap-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="API Key Name (e.g. Production Zapier Integration)"
          className="flex-1 px-4 py-2.5 rounded-xl bg-surface-50 border border-surface-300 text-xs text-surface-900 placeholder-surface-500 focus:outline-none focus:border-primary-600"
        />
        <Button size="sm" variant="primary" type="submit" isLoading={generating} leftIcon={<Plus size={14} />}>
          Generate Key
        </Button>
      </form>

      {newKeyObj && newRawKey && (
        <ApiKeyCard apiKey={newKeyObj} rawKey={newRawKey} onRevoke={handleRevoke} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {apiKeys.map((key) => (
          <ApiKeyCard key={key.id} apiKey={key} onRevoke={handleRevoke} />
        ))}
      </div>
    </div>
  );
}

