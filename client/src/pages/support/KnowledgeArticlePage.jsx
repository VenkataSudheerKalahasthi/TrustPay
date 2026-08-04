import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supportService } from '@services/support.service';
import { BookOpen, ArrowLeft, Eye } from 'lucide-react';

export function KnowledgeArticlePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supportService
      .getKnowledgeArticleBySlug(slug)
      .then((data) => setArticle(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [slug]);

  if (!article && !loading) {
    return (
      <div className="py-12 text-center text-slate-400">
        <p>Knowledge article not found.</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-sky-400 font-semibold">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className={`space-y-6 pb-12 transition-opacity ${loading ? 'opacity-50' : ''}`}>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Knowledge Base
      </button>

      {article && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6 max-w-4xl">
          <div className="flex items-center gap-2 text-xs font-bold text-sky-400">
            <BookOpen className="w-4 h-4" />
            <span>{article.category?.name || 'General Documentation'}</span>
          </div>

          <h1 className="text-3xl font-black text-white">{article.title}</h1>

          <div className="flex items-center gap-4 text-xs text-slate-400 pb-6 border-b border-slate-800">
            <span>By {article.author?.firstName} {article.author?.lastName}</span>
            <span>•</span>
            <span className="flex items-center gap-1 font-mono">
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              {article.viewCount} Views
            </span>
          </div>

          <div className="text-slate-200 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
            {article.content}
          </div>
        </div>
      )}
    </div>
  );
}
