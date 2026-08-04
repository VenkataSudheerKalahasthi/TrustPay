import { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import { operationService } from '@services/operation.service';
import { OperationLogTable } from '@components/operation/OperationLogTable';

export function OperationsCenterPage() {
  const [operations, setOperations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOperations() {
      try {
        const data = await operationService.getOperations();
        setOperations(data.operations || []);
      } catch (err) {
        console.error('Failed to load system operation logs', err);
      } finally {
        setLoading(false);
      }
    }
    loadOperations();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-surface-50 flex items-center gap-2">
          <Activity size={20} className="text-primary-400" />
          <span>Operations Center & Background Logs</span>
        </h1>
        <p className="text-xs text-surface-400">
          Track background jobs, system maintenance operations, operational categories, and audit logs.
        </p>
      </div>

      {loading ? (
        <p className="text-xs text-surface-400">Loading operation logs...</p>
      ) : (
        <OperationLogTable operations={operations} />
      )}
    </div>
  );
}
