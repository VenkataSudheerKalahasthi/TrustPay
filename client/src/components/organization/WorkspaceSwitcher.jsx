import { useState, useEffect } from 'react';
import { Building2, ChevronDown, Check, Plus } from 'lucide-react';
import { organizationService } from '@services/organization.service';

export function WorkspaceSwitcher() {
  const [organizations, setOrganizations] = useState([]);
  const [activeOrg, setActiveOrg] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function loadOrgs() {
      try {
        const data = await organizationService.getOrganizations();
        const orgs = data.organizations || [];
        setOrganizations(orgs);
        if (orgs.length > 0) {
          setActiveOrg(orgs[0]);
        }
      } catch (err) {
        console.error('Failed to load organizations for switcher', err);
      }
    }
    loadOrgs();
  }, []);

  if (organizations.length === 0) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card border border-surface-200 hover:border-surface-300 text-xs font-semibold text-surface-800 transition-colors"
      >
        <Building2 size={14} className="text-primary-600" />
        <span className="truncate max-w-[120px]">{activeOrg ? activeOrg.name : 'Select Org'}</span>
        <ChevronDown size={12} className="text-surface-600" />
      </button>

      {open && (
        <div className="absolute left-0 mt-2 w-56 rounded-2xl bg-card border border-surface-200 shadow-2xl p-1.5 z-dropdown space-y-1">
          <div className="text-3xs font-mono uppercase text-surface-600 px-2.5 py-1">Organizations</div>
          {organizations.map((org) => (
            <button
              key={org.id}
              onClick={() => {
                setActiveOrg(org);
                setOpen(false);
              }}
              className={`w-full text-left px-2.5 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                activeOrg?.id === org.id
                  ? 'bg-primary-500/20 text-primary-700 font-bold'
                  : 'text-surface-700 hover:bg-surface-50'
              }`}
            >
              <span className="truncate">{org.name}</span>
              {activeOrg?.id === org.id && <Check size={14} className="text-primary-600" />}
            </button>
          ))}
          <div className="border-t border-surface-200 pt-1">
            <button
              onClick={() => {
                setOpen(false);
                window.location.href = '/dashboard/client/organizations';
              }}
              className="w-full text-left px-2.5 py-1.5 rounded-xl text-3xs font-bold text-primary-600 hover:bg-surface-50 flex items-center gap-1.5"
            >
              <Plus size={12} />
              <span>Manage Organizations</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

