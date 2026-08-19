import { ExternalLink, Github, Trash2 } from 'lucide-react';

export function PortfolioCard({ project, onDelete }) {
  const techs = project.technologies
    ? project.technologies.map((t) => t.technology?.name || t.name)
    : [];

  return (
    <div className="glass-card p-5 flex flex-col justify-between relative group">
      <div>
        {/* Header & Title */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-bold text-base text-surface-900 font-display line-clamp-1">
            {project.title}
          </h3>
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(project.id)}
              className="p-1.5 rounded-lg text-surface-500 hover:text-danger-500 hover:bg-danger-50 transition-colors"
              aria-label="Delete project"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>

        {/* Description */}
        {project.description && (
          <p className="text-xs text-surface-700 line-clamp-3 mb-4 leading-relaxed">
            {project.description}
          </p>
        )}

        {/* Technologies used */}
        {techs.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {techs.map((t, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-primary-50 text-primary-600 text-2xs font-mono border border-primary-100"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* External Links */}
      <div className="pt-3 border-t border-surface-200/60 flex items-center gap-3">
        {project.projectUrl && (
          <a
            href={project.projectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-primary-600 hover:underline"
          >
            <ExternalLink size={12} />
            <span>Live Demo</span>
          </a>
        )}
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-surface-700 hover:text-surface-900"
          >
            <Github size={12} />
            <span>GitHub Repository</span>
          </a>
        )}
      </div>
    </div>
  );
}

