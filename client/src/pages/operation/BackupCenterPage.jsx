import { useState, useEffect } from 'react';
import { Database } from 'lucide-react';
import { operationService } from '@services/operation.service';
import { BackupStatusCard } from '@components/operation/BackupStatusCard';

export function BackupCenterPage() {
  const [backupJobs, setBackupJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBackups() {
      try {
        const data = await operationService.getBackupJobs();
        setBackupJobs(data.backupJobs || []);
      } catch (err) {
        console.error('Failed to load backup metadata', err);
      } finally {
        setLoading(false);
      }
    }
    loadBackups();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-surface-50 flex items-center gap-2">
          <Database size={20} className="text-primary-400" />
          <span>Backup & Disaster Recovery Metadata</span>
        </h1>
        <p className="text-xs text-surface-400">
          Database and Supabase storage backup job schedules, retention policy metadata, and restore history.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <p className="text-xs text-surface-400">Loading backup jobs...</p>
        ) : backupJobs.length === 0 ? (
          <p className="text-xs text-surface-400">No backup records configured yet.</p>
        ) : (
          backupJobs.map((b) => (
            <BackupStatusCard key={b.id} backupJob={b} />
          ))
        )}
      </div>
    </div>
  );
}
