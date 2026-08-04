import { useState, useEffect } from 'react';
import { Building2, Plus, Users, FolderOpen } from 'lucide-react';
import { organizationService } from '@services/organization.service';
import { Button } from '@components/ui/Button';
import { Card } from '@components/ui/Card';

export function OrganizationsPage() {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    async function loadOrgs() {
      try {
        const data = await organizationService.getOrganizations();
        setOrganizations(data.organizations || []);
      } catch (err) {
        console.error('Failed to load organizations', err);
      } finally {
        setLoading(false);
      }
    }
    loadOrgs();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    try {
      const created = await organizationService.createOrganization({ name });
      setOrganizations((prev) => [...prev, created]);
      setName('');
    } catch (err) {
      console.error('Failed to create organization', err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-surface-50 flex items-center gap-2">
            <Building2 size={20} className="text-primary-400" />
            <span>Organization Management</span>
          </h1>
          <p className="text-xs text-surface-400">
            Multi-tenant organization workspaces, member roles, and branding settings.
          </p>
        </div>
      </div>

      {/* Create Org Form */}
      <form onSubmit={handleCreate} className="p-4 rounded-2xl bg-surface-900 border border-surface-800 flex gap-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New Organization Name (e.g. Acme Enterprise Corp)"
          className="flex-1 px-4 py-2.5 rounded-xl bg-surface-800 border border-surface-700 text-xs text-surface-100 placeholder-surface-500 focus:outline-none focus:border-primary-500"
        />
        <Button size="sm" variant="primary" type="submit" isLoading={creating} leftIcon={<Plus size={14} />}>
          Create Org
        </Button>
      </form>

      {/* Organizations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <p className="text-xs text-surface-400">Loading organizations...</p>
        ) : organizations.length === 0 ? (
          <p className="text-xs text-surface-400">No organizations created yet.</p>
        ) : (
          organizations.map((org) => (
            <Card key={org.id} className="p-5 bg-surface-900 border-surface-800 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-500/20 text-primary-400 flex items-center justify-center font-bold text-sm">
                  {org.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-surface-100">{org.name}</h3>
                  <span className="text-3xs font-mono text-surface-400">Slug: {org.slug}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-surface-400 pt-3 border-t border-surface-800">
                <span className="flex items-center gap-1">
                  <Users size={14} />
                  <span>{org.members?.length || 1} Members</span>
                </span>
                <span className="flex items-center gap-1">
                  <FolderOpen size={14} />
                  <span>{org.workspaces?.length || 1} Workspaces</span>
                </span>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
