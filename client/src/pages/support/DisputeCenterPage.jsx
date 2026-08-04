import { useState, useEffect } from 'react';
import { supportService } from '@services/support.service';
import { DisputeTimeline } from '@components/support/DisputeTimeline';
import { CreateDisputeModal } from '@components/support/CreateDisputeModal';
import { AlertOctagon, Plus } from 'lucide-react';

export function DisputeCenterPage() {
  const [disputes, setDisputes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchDisputes = async () => {
    try {
      setLoading(true);
      const data = await supportService.getDisputes();
      setDisputes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisputes();
  }, []);

  return (
    <div className={`space-y-8 pb-12 transition-opacity ${loading ? 'opacity-50' : ''}`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <AlertOctagon className="w-6 h-6 text-rose-400" />
            Contract Dispute & Settlement Hub
          </h1>
          <p className="text-slate-400 text-sm">Raise payment or contract scope disputes, submit evidence, and manage administrative resolutions</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-rose-600/20"
        >
          <Plus className="w-4 h-4" />
          Open Dispute Case
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {disputes.length === 0 ? (
          <div className="col-span-full py-16 text-center border border-dashed border-slate-800 rounded-xl bg-slate-900/50">
            <AlertOctagon className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-slate-400 font-medium">No active contract dispute cases</p>
          </div>
        ) : (
          disputes.map((dispute) => <DisputeTimeline key={dispute.id} dispute={dispute} />)
        )}
      </div>

      <CreateDisputeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchDisputes}
      />
    </div>
  );
}
