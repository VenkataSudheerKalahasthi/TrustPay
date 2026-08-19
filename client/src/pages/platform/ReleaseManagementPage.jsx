import { useState, useEffect } from 'react';
import { platformService } from '@services/platform.service';
import { ReleaseTimeline } from '@components/platform/ReleaseTimeline';
import { CreateReleaseModal } from '@components/platform/CreateReleaseModal';
import { GitCommit, Plus } from 'lucide-react';

export function ReleaseManagementPage() {
  const [versions, setVersions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchVersions = async () => {
    try {
      setLoading(true);
      const data = await platformService.getVersions();
      setVersions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVersions();
  }, []);

  return (
    <div className={`space-y-8 pb-12 transition-opacity ${loading ? 'opacity-50' : ''}`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <GitCommit className="w-6 h-6 text-sky-400 dark:text-primary-400" />
            Release Management & Version Notes
          </h1>
          <p className="text-slate-400 text-sm">Application build tracking, release changelogs, and version publishing</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-sky-600/20"
        >
          <Plus className="w-4 h-4" />
          Publish New Version
        </button>
      </div>

      <ReleaseTimeline versions={versions} />

      <CreateReleaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchVersions}
      />
    </div>
  );
}
