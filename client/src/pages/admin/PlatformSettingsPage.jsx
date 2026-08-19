import { useState, useEffect } from 'react';
import { Sliders } from 'lucide-react';
import { adminService } from '@services/admin.service';
import { PlatformSettingForm } from '@components/admin/PlatformSettingForm';

export function PlatformSettingsPage() {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await adminService.getPlatformSettings();
        setSettings(data.settings || []);
      } catch (err) {
        console.error('Failed to load platform settings', err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (key, value) => {
    try {
      await adminService.updatePlatformSetting({ key, value });
      alert(`Setting ${key} updated!`);
    } catch (err) {
      console.error('Failed to update setting', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-surface-900 flex items-center gap-2">
          <Sliders size={20} className="text-primary-600" />
          <span>Platform Settings & Configuration</span>
        </h1>
        <p className="text-xs text-surface-600">
          Global platform parameters, default currencies, system constants, and maintenance controls.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <p className="text-xs text-surface-600">Loading settings...</p>
        ) : settings.length === 0 ? (
          <p className="text-xs text-surface-600">No custom settings configured yet.</p>
        ) : (
          settings.map((s) => (
            <PlatformSettingForm key={s.id} setting={s} onSave={handleSave} />
          ))
        )}
      </div>
    </div>
  );
}

