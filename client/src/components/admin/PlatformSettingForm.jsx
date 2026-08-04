import { useState } from 'react';
import { Button } from '@components/ui/Button';

export function PlatformSettingForm({ setting, onSave }) {
  const [value, setValue] = useState(setting.value || '');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(setting.key, value);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 rounded-2xl bg-surface-900 border border-surface-800 space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-surface-100 font-mono">{setting.key}</label>
        <span className="text-3xs font-mono text-surface-500 uppercase">{setting.category}</span>
      </div>

      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full px-3 py-2 rounded-xl bg-surface-800 border border-surface-700 text-xs text-surface-100 focus:outline-none focus:border-primary-500"
      />

      <div className="flex justify-end">
        <Button size="xs" variant="primary" type="submit" isLoading={saving}>
          Save Setting
        </Button>
      </div>
    </form>
  );
}
