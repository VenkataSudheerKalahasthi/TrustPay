import { useState, useEffect } from 'react';
import { platformService } from '@services/platform.service';
import { VersionHistoryTable } from '@components/platform/VersionHistoryTable';
import { GitCommit } from 'lucide-react';

export function VersionHistoryPage() {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    platformService
      .getVersions()
      .then((data) => setVersions(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={`space-y-8 pb-12 transition-opacity ${loading ? 'opacity-50' : ''}`}>
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <GitCommit className="w-6 h-6 text-sky-400" />
          Application Version Directory
        </h1>
        <p className="text-slate-400 text-sm">Full deployment version history and active build status</p>
      </div>

      <VersionHistoryTable versions={versions} />
    </div>
  );
}
