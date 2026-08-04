import { useState, useEffect } from 'react';
import { platformService } from '@services/platform.service';
import { ConfigurationEditor } from '@components/platform/ConfigurationEditor';
import { Settings } from 'lucide-react';

export function ConfigurationPage() {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchConfigs = async () => {
    try {
      setLoading(true);
      const data = await platformService.getConfigurations();
      setConfigs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  const handleSave = async (configKey, configValue) => {
    try {
      await platformService.setConfiguration({ configKey, configValue, scope: 'GLOBAL' });
      fetchConfigs();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className={`space-y-8 pb-12 transition-opacity ${loading ? 'opacity-50' : ''}`}>
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-sky-400" />
          Enterprise Configuration & System Settings
        </h1>
        <p className="text-slate-400 text-sm">Global platform tokens, environment profile variables, and module settings</p>
      </div>

      <ConfigurationEditor configs={configs} onSave={handleSave} />
    </div>
  );
}
