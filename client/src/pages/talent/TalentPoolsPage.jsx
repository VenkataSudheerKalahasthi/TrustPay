import { useState, useEffect } from 'react';
import { Folder, Plus } from 'lucide-react';
import { talentService } from '@services/talent.service';
import { TalentPoolCard } from '@components/talent/TalentPoolCard';
import { Button } from '@components/ui/Button';

export function TalentPoolsPage() {
  const [pools, setPools] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPools() {
      try {
        const res = await talentService.getTalentPools();
        setPools(res.pools || []);
      } catch (err) {
        console.error('Failed to load talent pools', err);
      } finally {
        setLoading(false);
      }
    }
    loadPools();
  }, []);

  const handleCreatePool = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    try {
      const created = await talentService.createTalentPool({ name, description });
      setPools((prev) => [created, ...prev]);
      setName('');
      setDescription('');
    } catch (err) {
      console.error('Failed to create talent pool', err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-surface-50 flex items-center gap-2">
            <Folder size={20} className="text-primary-400" />
            <span>Enterprise Talent Pools</span>
          </h1>
          <p className="text-xs text-surface-400">
            Create reusable talent pool folders, group preferred candidates, and manage candidate sourcing lists.
          </p>
        </div>
      </div>

      {/* Create Talent Pool Form */}
      <form onSubmit={handleCreatePool} className="p-4 rounded-2xl bg-surface-900 border border-surface-800 space-y-3">
        <h3 className="text-xs font-bold text-surface-100">Create New Talent Pool Folder</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Pool Name (e.g. Senior Node.js Specialists)"
            required
            className="px-3 py-2 rounded-xl bg-surface-800 border border-surface-700 text-xs text-surface-100 focus:outline-none focus:border-primary-500"
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short Description..."
            className="px-3 py-2 rounded-xl bg-surface-800 border border-surface-700 text-xs text-surface-100 focus:outline-none focus:border-primary-500"
          />
        </div>
        <Button size="sm" variant="primary" type="submit" isLoading={creating} leftIcon={<Plus size={14} />}>
          Create Talent Pool
        </Button>
      </form>

      {/* Talent Pools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <p className="text-xs text-surface-400">Loading talent pools...</p>
        ) : pools.length === 0 ? (
          <p className="text-xs text-surface-400">No talent pools created yet.</p>
        ) : (
          pools.map((p) => (
            <TalentPoolCard key={p.id} pool={p} />
          ))
        )}
      </div>
    </div>
  );
}
