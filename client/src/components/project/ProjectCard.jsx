import { Link } from 'react-router-dom';
import { Calendar, UserCheck, ShieldCheck } from 'lucide-react';
import { Card } from '@components/ui/Card';
import { Avatar } from '@components/ui/Avatar';
import { ProjectStatusBadge } from './ProjectStatusBadge';

export function ProjectCard({ project }) {
  if (!project) return null;

  const {
    id,
    projectNumber,
    title,
    description,
    status,
    clientProfile,
    workerProfile,
    contract,
    progressMetrics = {},
    createdAt,
  } = project;

  const progress = progressMetrics.progressPercentage || 0;
  const clientName = clientProfile?.user ? `${clientProfile.user.firstName} ${clientProfile.user.lastName}` : 'Client';
  const workerName = workerProfile?.user ? `${workerProfile.user.firstName} ${workerProfile.user.lastName}` : 'Unassigned Worker';

  return (
    <Card className="p-6 bg-card border-surface-200 hover:border-surface-300 transition-all group flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <span className="text-2xs font-mono text-primary-600 uppercase tracking-wider font-semibold block mb-1">
              {projectNumber}
            </span>
            <Link
              to={`/projects/${id}`}
              className="text-base font-semibold text-surface-900 group-hover:text-primary-600 transition-colors line-clamp-1"
            >
              {title}
            </Link>
          </div>
          <ProjectStatusBadge status={status} />
        </div>

        <p className="text-xs text-surface-600 line-clamp-2 mb-4 leading-relaxed">
          {description || 'No project description provided.'}
        </p>

        <div className="mb-4">
          <div className="flex items-center justify-between text-2xs mb-1.5 font-medium text-surface-600">
            <span>Execution Progress</span>
            <span className="text-surface-800 font-semibold">{progress}%</span>
          </div>
          <div className="w-full bg-surface-50 h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-2xs text-surface-700 pt-3 border-t border-surface-200/80 mb-4">
          <div className="flex items-center gap-1.5 truncate">
            <Avatar name={clientName} size="xs" />
            <span className="truncate">{clientName}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <UserCheck size={14} className="text-surface-600 shrink-0" />
            <span className="truncate">{workerName}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-surface-200/60 text-2xs text-surface-500">
        <div className="flex items-center gap-1">
          <Calendar size={12} />
          <span>{new Date(createdAt).toLocaleDateString()}</span>
        </div>

        {contract && (
          <div className="flex items-center gap-1 text-emerald-400 font-medium">
            <ShieldCheck size={12} />
            <span>Contract {contract.contractNumber}</span>
          </div>
        )}

        <Link
          to={`/projects/${id}`}
          className="text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors"
        >
          View Execution →
        </Link>
      </div>
    </Card>
  );
}

