import { Link } from 'react-router-dom';
import { MapPin, Heart, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { Avatar } from '@components/ui/Avatar';
import { Button } from '@components/ui/Button';

export function WorkerCard({ worker, isFavorite = false, onToggleFavorite }) {
  const user = worker.user || {};
  const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Worker';
  const title = worker.title || 'Independent Specialist';
  const rate = worker.hourlyRate ? `₹${worker.hourlyRate}/hr` : 'Custom Quote';
  const location = worker.city ? `${worker.city}, ${worker.country || 'India'}` : 'Remote';
  const skills = worker.skills ? worker.skills.map((s) => s.skill?.name || s.name).slice(0, 4) : [];

  return (
    <div className="glass-card p-6 flex flex-col justify-between hover:shadow-glow transition-all duration-200 group">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <Avatar name={name} src={user.avatar} size="md" status="online" />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <Link
                  to={`/workers/${worker.slug || worker.id}`}
                  className="font-bold text-sm text-surface-100 hover:text-primary-500 transition-colors"
                >
                  {name}
                </Link>
                {worker.verificationStatus === 'VERIFIED' && (
                  <CheckCircle2 size={14} className="text-primary-500 shrink-0" />
                )}
              </div>
              <span className="text-2xs text-surface-400 font-medium line-clamp-1">{title}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onToggleFavorite && onToggleFavorite(worker.id)}
            className={`p-2 rounded-full transition-colors ${
              isFavorite
                ? 'bg-danger-50 text-danger-500 hover:bg-danger-50/80'
                : 'bg-surface-700/50 text-surface-400 hover:text-surface-100'
            }`}
            aria-label="Save worker to favorites"
          >
            <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Bio */}
        {worker.bio && (
          <p className="text-xs text-surface-400 line-clamp-2 mb-4 leading-relaxed">
            {worker.bio}
          </p>
        )}

        {/* Skills Tag List */}
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-full bg-surface-700/60 text-surface-300 text-2xs font-medium border border-surface-700"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-surface-700 flex items-center justify-between">
        <div className="flex items-center gap-3 text-2xs text-surface-400">
          <div className="flex items-center gap-1">
            <MapPin size={12} className="text-surface-500" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-1 font-semibold text-primary-500">
            <span>{rate}</span>
          </div>
        </div>

        <Link to={`/workers/${worker.slug || worker.id}`}>
          <Button variant="outline" size="xs" rightIcon={<ArrowUpRight size={12} />}>
            View Profile
          </Button>
        </Link>
      </div>
    </div>
  );
}
