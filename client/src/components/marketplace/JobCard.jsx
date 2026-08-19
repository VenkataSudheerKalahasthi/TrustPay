import { Briefcase, DollarSign, Clock, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { JobStatusBadge } from './JobStatusBadge';

export function JobCard({ job }) {
  return (
    <div className="p-5 rounded-2xl bg-card border border-surface-200 space-y-4 hover:border-surface-300 transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <Link to={`/dashboard/client/marketplace/${job.slug}`} className="text-sm font-bold text-surface-900 hover:text-primary-600 transition-colors line-clamp-1">
            {job.title}
          </Link>
          <div className="flex items-center gap-3 text-3xs font-mono text-surface-600">
            <span className="flex items-center gap-1">
              <Briefcase size={12} className="text-primary-600" />
              <span>{job.workType}</span>
            </span>
            <span className="flex items-center gap-1">
              <DollarSign size={12} className="text-emerald-400" />
              <span>{job.budget ? `$${job.budget}` : `$${job.hourlyMin || 25}-$${job.hourlyMax || 75}/hr`}</span>
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} className="text-amber-400" />
              <span>{job.experienceLevel}</span>
            </span>
          </div>
        </div>

        <JobStatusBadge status={job.status} />
      </div>

      <p className="text-xs text-surface-700 line-clamp-2 leading-relaxed">{job.description}</p>

      <div className="flex items-center justify-between pt-3 border-t border-surface-200 text-3xs font-mono text-surface-600">
        <div className="flex items-center gap-2">
          <UserCheck size={12} className="text-emerald-400" />
          <span>{job.proposalCount || 0} Proposals</span>
        </div>
        <span>Posted: {new Date(job.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
}

