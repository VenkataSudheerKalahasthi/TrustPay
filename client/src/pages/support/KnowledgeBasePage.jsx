import { useState, useEffect } from 'react';
import { supportService } from '@services/support.service';
import { KnowledgeArticleCard } from '@components/support/KnowledgeArticleCard';
import { KnowledgeSearchBar } from '@components/support/KnowledgeSearchBar';
import { CreateArticleModal } from '@components/support/CreateArticleModal';
import { BookOpen, Plus } from 'lucide-react';

export function KnowledgeBasePage() {
  const [articles, setArticles] = useState([]);
  const [query, setQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchArticles = async (searchQuery = '') => {
    try {
      setLoading(true);
      const data = await supportService.getKnowledgeArticles({ query: searchQuery });
      setArticles(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleSearch = (q) => {
    fetchArticles(q);
  };

  return (
    <div className={`space-y-8 pb-12 transition-opacity ${loading ? 'opacity-50' : ''}`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-sky-400 dark:text-primary-400" />
            Knowledge Base & Help Center
          </h1>
          <p className="text-slate-400 text-sm">Search documentation, user guides, platform tutorials, and policies</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-sky-600/20"
        >
          <Plus className="w-4 h-4" />
          Create Article
        </button>
      </div>

      <KnowledgeSearchBar query={query} onQueryChange={setQuery} onSearch={handleSearch} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.length === 0 ? (
          <div className="col-span-full py-16 text-center border border-dashed border-slate-800 rounded-xl bg-slate-900/50">
            <BookOpen className="w-10 h-10 text-surface-600 mx-auto mb-2" />
            <p className="text-slate-400 font-medium">No knowledge base articles found</p>
          </div>
        ) : (
          articles.map((article) => <KnowledgeArticleCard key={article.id} article={article} />)
        )}
      </div>

      <CreateArticleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchArticles}
      />
    </div>
  );
}
