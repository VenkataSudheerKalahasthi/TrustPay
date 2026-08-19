import { Link } from 'react-router-dom';
import { BookOpen, Eye, ThumbsUp } from 'lucide-react';

export function KnowledgeArticleCard({ article }) {
  if (!article) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all shadow-md">
      <div className="flex items-center gap-2 text-xs font-bold text-sky-400 dark:text-primary-400 mb-2">
        <BookOpen className="w-4 h-4" />
        <span>{article.category?.name || 'General Help'}</span>
      </div>

      <h4 className="text-base font-bold text-white mb-2 line-clamp-1">
        <Link to={`/dashboard/client/support/knowledge/${article.slug}`} className="hover:text-sky-400 dark:text-primary-400 transition-colors">
          {article.title}
        </Link>
      </h4>

      <p className="text-xs text-slate-300 line-clamp-3 mb-4 leading-relaxed">{article.content}</p>

      <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 font-mono">
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            {article.viewCount} views
          </span>
          <span className="flex items-center gap-1 font-mono text-emerald-400">
            <ThumbsUp className="w-3.5 h-3.5" />
            {article.helpfulCount} helpful
          </span>
        </div>

        <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded font-semibold text-slate-300">
          {article.status}
        </span>
      </div>
    </div>
  );
}
