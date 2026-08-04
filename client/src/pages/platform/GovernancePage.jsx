import { useState, useEffect } from 'react';
import { platformService } from '@services/platform.service';
import { RunbookCard } from '@components/platform/RunbookCard';
import { BookOpen } from 'lucide-react';

export function GovernancePage() {
  const [runbooks, setRunbooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    platformService
      .getRunbooks()
      .then((data) => setRunbooks(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={`space-y-8 pb-12 transition-opacity ${loading ? 'opacity-50' : ''}`}>
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-sky-400" />
          Operational Runbooks & Platform Governance
        </h1>
        <p className="text-slate-400 text-sm">Disaster recovery procedures, database failovers, and operational compliance policies</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {runbooks.map((rb) => (
          <RunbookCard key={rb.id || rb.code} runbook={rb} />
        ))}
      </div>
    </div>
  );
}
