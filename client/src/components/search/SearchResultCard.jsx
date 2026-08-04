import { Link } from 'react-router-dom';
import { FolderOpen, FileText, User, MessageSquare, ExternalLink } from 'lucide-react';

const ENTITY_ICONS = {
  PROJECT: FolderOpen,
  CONTRACT: FileText,
  WORKER: User,
  CLIENT: User,
  MESSAGE: MessageSquare,
};

export function SearchResultCard({ result, onResultClick }) {
  if (!result) return null;

  const Icon = ENTITY_ICONS[result.entityType] || FileText;

  return (
    <div className="p-4 rounded-xl bg-surface-900 border border-surface-800 hover:border-surface-700 transition-all flex items-start gap-3">
      <div className="p-2.5 rounded-xl bg-primary-500/10 border border-primary-500/30 text-primary-400 shrink-0 mt-0.5">
        <Icon size={16} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <Link
            to={result.linkUrl}
            onClick={() => onResultClick && onResultClick(result.id)}
            className="text-sm font-bold text-surface-100 hover:text-primary-400 transition-colors truncate"
            dangerouslySetInnerHTML={{ __html: result.highlightedTitle || result.title }}
          />
          <span className="text-3xs font-mono uppercase font-bold px-2 py-0.5 rounded bg-surface-800 text-primary-400 shrink-0">
            {result.entityType}
          </span>
        </div>

        {result.content && (
          <p
            className="text-xs text-surface-300 line-clamp-2 leading-relaxed mb-2"
            dangerouslySetInnerHTML={{ __html: result.highlightedContent || result.content }}
          />
        )}

        <div className="flex items-center justify-between text-3xs text-surface-400 pt-2 border-t border-surface-800/60">
          <span>{result.subtitle || 'Match found'}</span>
          <Link
            to={result.linkUrl}
            onClick={() => onResultClick && onResultClick(result.id)}
            className="text-primary-400 hover:underline flex items-center gap-1 font-semibold"
          >
            <span>View Record</span>
            <ExternalLink size={10} />
          </Link>
        </div>
      </div>
    </div>
  );
}
