import { useState, useEffect } from 'react';
import { workforceService } from '@services/workforce.service';
import { AllocationBoard } from '@components/workforce/AllocationBoard';
import { CreateAllocationModal } from '@components/workforce/CreateAllocationModal';
import { Layers } from 'lucide-react';

export function ResourceAllocationPage() {
  const [allocations, setAllocations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchAllocations = async () => {
    try {
      setLoading(true);
      const data = await workforceService.getWorkAllocations();
      setAllocations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllocations();
  }, []);

  return (
    <div className={`space-y-8 pb-12 transition-opacity ${loading ? 'opacity-50' : ''}`}>
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Layers className="w-6 h-6 text-sky-400 dark:text-primary-400" />
          Resource Allocation Engine
        </h1>
        <p className="text-slate-400 text-sm">Assign team members, balance workloads, and prevent over-allocation</p>
      </div>

      <AllocationBoard allocations={allocations} onAddAllocation={() => setIsModalOpen(true)} />

      <CreateAllocationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchAllocations}
      />
    </div>
  );
}
