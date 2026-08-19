import { useState, useEffect } from 'react';
import { Users, Mail } from 'lucide-react';
import { organizationService } from '@services/organization.service';
import { OrgMemberTable } from '@components/organization/OrgMemberTable';
import { RolePermissionMatrix } from '@components/organization/RolePermissionMatrix';
import { Button } from '@components/ui/Button';

export function MemberManagementPage() {
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrgId, setSelectedOrgId] = useState(null);
  const [orgDetails, setOrgDetails] = useState(null);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('MEMBER');

  useEffect(() => {
    async function loadData() {
      try {
        const data = await organizationService.getOrganizations();
        const orgs = data.organizations || [];
        setOrganizations(orgs);
        if (orgs.length > 0) {
          setSelectedOrgId(orgs[0].id);
        }
      } catch (err) {
        console.error('Failed to load orgs for member management', err);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    if (!selectedOrgId) return;
    async function loadOrgDetails() {
      try {
        const data = await organizationService.getOrganization(selectedOrgId);
        setOrgDetails(data.organization);
      } catch (err) {
        console.error('Failed to load org details', err);
      }
    }
    loadOrgDetails();
  }, [selectedOrgId]);

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!email || !selectedOrgId) return;
    try {
      await organizationService.inviteMember(selectedOrgId, { email, role });
      setEmail('');
      alert(`Invitation sent to ${email}`);
    } catch (err) {
      console.error('Failed to invite member', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-surface-900 flex items-center gap-2">
            <Users size={20} className="text-primary-600" />
            <span>Member Management & RBAC</span>
          </h1>
          <p className="text-xs text-surface-600">
            Invite organization members, assign fine-grained roles, and inspect effective permission matrices.
          </p>
        </div>

        {organizations.length > 0 && (
          <select
            value={selectedOrgId || ''}
            onChange={(e) => setSelectedOrgId(e.target.value)}
            className="bg-card border border-surface-200 text-xs font-semibold text-surface-900 rounded-xl px-3 py-2"
          >
            {organizations.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Invite Member Form */}
      <form onSubmit={handleInvite} className="p-4 rounded-2xl bg-card border border-surface-200 flex flex-wrap gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="New member email address..."
          className="flex-1 min-w-[200px] px-4 py-2.5 rounded-xl bg-surface-50 border border-surface-300 text-xs text-surface-900 focus:outline-none focus:border-primary-600"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="bg-surface-50 border border-surface-300 text-xs font-semibold text-surface-900 rounded-xl px-3"
        >
          <option value="ADMIN">ADMIN</option>
          <option value="MANAGER">MANAGER</option>
          <option value="MEMBER">MEMBER</option>
          <option value="VIEWER">VIEWER</option>
        </select>
        <Button size="sm" variant="primary" type="submit" leftIcon={<Mail size={14} />}>
          Send Invite
        </Button>
      </form>

      {/* Member Table & Role Matrix */}
      {orgDetails && (
        <div className="space-y-6">
          <OrgMemberTable
            members={orgDetails.members || []}
            onUpdateRole={(mId, r) => organizationService.updateMemberRole(selectedOrgId, mId, r)}
            onRemoveMember={(mId) => organizationService.removeMember(selectedOrgId, mId)}
          />

          <RolePermissionMatrix
            effectiveRole={orgDetails.effectiveRole}
            permissions={orgDetails.permissions || []}
          />
        </div>
      )}
    </div>
  );
}

