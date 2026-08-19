import { useState, useEffect } from 'react';
import { adminService } from '@services/admin.service';
import { BulkOperationProgress } from '@components/admin/BulkOperationProgress';
import { BulkOperationModal } from '@components/admin/BulkOperationModal';
import { Layers, Play } from 'lucide-react';

export function BulkOperationsPage() {
  const [operations, setOperations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchOperations = async () => {
    try {
      setLoading(true);
      const data = await adminService.getBulkOperations();
      setOperations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOperations();
  }, []);

  return (
    <div className={`space-y-8 pb-12 transition-opacity ${loading ? 'opacity-50' : ''}`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-sky-400 dark:text-primary-400" />
            Bulk Administrative Operations & Runner
          </h1>
          <p className="text-slate-400 text-sm">Execute transactional bulk user suspensions, restorations, and identity verifications safely</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-sky-600/20"
        >
          <Play className="w-4 h-4" />
          Dispatch Bulk Operation
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {operations.length === 0 ? (
          <div className="col-span-full py-16 text-center border border-dashed border-slate-800 rounded-xl bg-slate-900/50">
            <Layers className="w-10 h-10 text-surface-600 mx-auto mb-2" />
            <p className="text-slate-400 font-medium">No bulk operations executed yet</p>
          </div>
        ) : (
          operations.map((op) => <BulkOperationProgress key={op.id} operation={op} />)
        )}
      </div>

      <BulkOperationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchOperations}
      />
    </div>
  );
}
