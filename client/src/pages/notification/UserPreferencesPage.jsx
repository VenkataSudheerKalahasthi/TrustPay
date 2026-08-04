import { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle, Bell, Moon } from 'lucide-react';
import { notificationService } from '@services/notification.service';
import { Button } from '@components/ui/Button';
import { Card } from '@components/ui/Card';

export function UserPreferencesPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  // User Preferences
  const [theme, setTheme] = useState('DARK');
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [currency, setCurrency] = useState('INR');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
  const [timeFormat, setTimeFormat] = useState('12H');

  // Notification Preferences
  const [inAppNotifications, setInAppNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [desktopNotifications, setDesktopNotifications] = useState(true);

  useEffect(() => {
    async function loadPreferences() {
      setLoading(true);
      try {
        const data = await notificationService.getUserPreferences();
        const up = data.userPreferences || {};
        const np = data.notificationPreferences || {};

        setTheme(up.theme || 'DARK');
        setLanguage(up.language || 'en');
        setTimezone(up.timezone || 'Asia/Kolkata');
        setCurrency(up.currency || 'INR');
        setDateFormat(up.dateFormat || 'DD/MM/YYYY');
        setTimeFormat(up.timeFormat || '12H');

        setInAppNotifications(np.inAppNotifications ?? true);
        setEmailNotifications(np.emailNotifications ?? true);
        setSoundEnabled(np.soundEnabled ?? true);
        setDesktopNotifications(np.desktopNotifications ?? true);
      } catch (err) {
        console.error('Failed to load preferences', err);
      } finally {
        setLoading(false);
      }
    }
    loadPreferences();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    try {
      await notificationService.updateUserPreferences({
        userPreferences: {
          theme,
          language,
          timezone,
          currency,
          dateFormat,
          timeFormat,
        },
        notificationPreferences: {
          inAppNotifications,
          emailNotifications,
          soundEnabled,
          desktopNotifications,
        },
      });
      setSuccessMsg('Preferences saved successfully!');
    } catch (err) {
      console.error('Failed to save preferences', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="h-64 bg-surface-900 border border-surface-800 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-surface-50 flex items-center gap-2">
          <Settings size={20} className="text-primary-400" />
          <span>User & System Preferences</span>
        </h1>
        <p className="text-xs text-surface-400">
          Configure application theme, timezone, currency, date format, and realtime notification channels.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Appearance & Locale */}
        <Card className="p-6 bg-surface-900 border-surface-800 space-y-4">
          <h3 className="text-sm font-bold text-surface-100 flex items-center gap-2 border-b border-surface-800 pb-3">
            <Moon size={16} className="text-indigo-400" />
            <span>Appearance & Globalization</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-surface-300 mb-1">Theme</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface-800 border border-surface-700 text-xs text-surface-100 focus:outline-none focus:border-primary-500"
              >
                <option value="DARK">Dark Mode (Default)</option>
                <option value="LIGHT">Light Mode</option>
                <option value="SYSTEM">System Sync</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-surface-300 mb-1">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface-800 border border-surface-700 text-xs text-surface-100 focus:outline-none focus:border-primary-500"
              >
                <option value="en">English (US/UK)</option>
                <option value="hi">Hindi (हिन्दी)</option>
                <option value="es">Spanish (Español)</option>
                <option value="fr">French (Français)</option>
                <option value="de">German (Deutsch)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-surface-300 mb-1">Timezone</label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface-800 border border-surface-700 text-xs text-surface-100 focus:outline-none focus:border-primary-500"
              >
                <option value="Asia/Kolkata">Asia/Kolkata (IST - UTC+05:30)</option>
                <option value="UTC">UTC (Coordinated Universal Time)</option>
                <option value="America/New_York">America/New_York (EST - UTC-05:00)</option>
                <option value="Europe/London">Europe/London (GMT - UTC+00:00)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-surface-300 mb-1">Display Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface-800 border border-surface-700 text-xs text-surface-100 focus:outline-none focus:border-primary-500"
              >
                <option value="INR">INR (₹ Indian Rupee)</option>
                <option value="USD">USD ($ US Dollar)</option>
                <option value="EUR">EUR (€ Euro)</option>
                <option value="GBP">GBP (£ British Pound)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-surface-300 mb-1">Date Format</label>
              <select
                value={dateFormat}
                onChange={(e) => setDateFormat(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface-800 border border-surface-700 text-xs text-surface-100 focus:outline-none focus:border-primary-500"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY (e.g. 02/08/2026)</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY (e.g. 08/02/2026)</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD (e.g. 2026-08-02)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-surface-300 mb-1">Time Format</label>
              <select
                value={timeFormat}
                onChange={(e) => setTimeFormat(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface-800 border border-surface-700 text-xs text-surface-100 focus:outline-none focus:border-primary-500"
              >
                <option value="12H">12-Hour (e.g. 04:30 PM)</option>
                <option value="24H">24-Hour (e.g. 16:30)</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Notifications & Toggles */}
        <Card className="p-6 bg-surface-900 border-surface-800 space-y-4">
          <h3 className="text-sm font-bold text-surface-100 flex items-center gap-2 border-b border-surface-800 pb-3">
            <Bell size={16} className="text-primary-400" />
            <span>Notification & Communication Channels</span>
          </h3>

          <div className="space-y-3">
            {[
              {
                title: 'In-App Realtime Notifications',
                desc: 'Show realtime alert badges and popups in top navbar',
                value: inAppNotifications,
                setter: setInAppNotifications,
              },
              {
                title: 'Nodemailer Email Notifications',
                desc: 'Send transactional email alerts for contracts, escrow, and milestone events',
                value: emailNotifications,
                setter: setEmailNotifications,
              },
              {
                title: 'Notification Sound Alerts',
                desc: 'Play subtle audio chime when new realtime notification arrives',
                value: soundEnabled,
                setter: setSoundEnabled,
              },
              {
                title: 'Browser Desktop Notifications',
                desc: 'Allow native browser desktop notification popups',
                value: desktopNotifications,
                setter: setDesktopNotifications,
              },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-surface-800/60 border border-surface-700/60">
                <div>
                  <h4 className="text-xs font-bold text-surface-100">{item.title}</h4>
                  <p className="text-2xs text-surface-400">{item.desc}</p>
                </div>
                <input
                  type="checkbox"
                  checked={item.value}
                  onChange={(e) => item.setter(e.target.checked)}
                  className="w-4 h-4 rounded border-surface-600 bg-surface-800 text-primary-500 focus:ring-primary-500"
                />
              </div>
            ))}
          </div>
        </Card>

        <div className="flex items-center justify-end gap-3">
          <Button type="submit" size="sm" loading={saving} leftIcon={<Save size={14} />}>
            Save All Preferences
          </Button>
        </div>
      </form>
    </div>
  );
}
