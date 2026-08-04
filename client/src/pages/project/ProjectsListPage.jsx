import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, FolderOpen, RefreshCw } from 'lucide-react';
import { projectService } from '@services/project.service';
import { useAuth } from '@hooks/useAuth';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { ProjectCard } from '@components/project/ProjectCard';

export function ProjectsListPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, total: 0 });

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await projectService.searchProjects({
        q: searchQuery,
        status: selectedStatus || undefined,
        priority: selectedPriority || undefined,
        page,
        limit: 9,
      });
      setProjects(data.projects || []);
      setPagination(data.pagination || { totalPages: 1, total: 0 });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedStatus, selectedPriority, page]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const isClient = user?.role === 'CLIENT' || user?.role === 'ADMIN';

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-surface-50 tracking-tight">Project Management Workspace</h1>
          <p className="text-xs text-surface-400">
            Enterprise project execution, milestone tracking, deliverable versioning, and escrow readiness.
          </p>
        </div>

        {isClient && (
          <Link to="/projects/create">
            <Button leftIcon={<Plus size={16} />}>Create New Project</Button>
          </Link>
        )}
      </div>

      <div className="p-4 rounded-2xl bg-surface-900 border border-surface-800 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            placeholder="Search by title or PRJ number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search size={16} />}
          />

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl bg-surface-800 border border-surface-700 text-xs text-surface-100 focus:outline-none focus:border-primary-500"
          >
            <option value="">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="ACTIVE">Active</option>
            <option value="ON_HOLD">On Hold</option>
            <option value="IN_REVIEW">In Review</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="ARCHIVED">Archived</option>
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-2 rounded-xl bg-surface-800 border border-surface-700 text-xs text-surface-100 focus:outline-none focus:border-primary-500"
          >
            <option value="">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 rounded-2xl bg-surface-900 border border-surface-800 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-surface-900 border border-red-500/20 text-center">
          <p className="text-xs text-red-400 mb-3">{error}</p>
          <Button size="sm" variant="secondary" onClick={fetchProjects} leftIcon={<RefreshCw size={14} />}>
            Retry
          </Button>
        </div>
      ) : projects.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-surface-900 border border-surface-800">
          <FolderOpen className="w-12 h-12 text-surface-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-surface-200">No Projects Found</h3>
          <p className="text-xs text-surface-400 mb-4 max-w-sm mx-auto">
            No project records match your filter criteria or role access.
          </p>
          {isClient && (
            <Link to="/projects/create">
              <Button size="sm" leftIcon={<Plus size={14} />}>
                Create Your First Project
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 text-xs text-surface-400 border-t border-surface-800">
              <span>
                Showing page {page} of {pagination.totalPages} ({pagination.total} total projects)
              </span>
              <div className="flex items-center gap-2">
                <Button
                  size="xs"
                  variant="ghost"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <Button
                  size="xs"
                  variant="ghost"
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
