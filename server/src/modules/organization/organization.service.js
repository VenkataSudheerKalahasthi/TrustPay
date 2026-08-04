'use strict';

const crypto = require('crypto');
const organizationRepository = require('./organization.repository');
const permissionService = require('./permission.service');
const { sendEmail } = require('../../utils/email');

class OrganizationService {
  async createOrganization(userId, data) {
    return organizationRepository.createOrganization(userId, data);
  }

  async getUserOrganizations(userId) {
    return organizationRepository.findUserOrganizations(userId);
  }

  async getOrganization(id, userId) {
    const org = await organizationRepository.findOrganizationById(id, userId);
    if (!org) {
      return null;
    }

    const effective = await permissionService.getEffectivePermissions(userId, id);
    return { ...org, effectiveRole: effective.role, permissions: effective.permissions };
  }

  async inviteMember(organizationId, invitedById, { email, role = 'MEMBER' }) {
    const hasPerm = await permissionService.hasPermission(invitedById, organizationId, 'org:invite');
    if (!hasPerm) {
      throw new Error('Unauthorized to invite members to organization');
    }

    const token = crypto.randomBytes(32).toString('hex');
    const invitation = await organizationRepository.createInvitation(organizationId, invitedById, email, role, token);

    // Send invitation email asynchronously
    sendEmail({
      to: email,
      subject: 'You have been invited to join an Organization on TrustPay',
      html: `<p>You have been invited as <strong>${role}</strong>. Token: ${token}</p>`,
    }).catch(() => {});

    return invitation;
  }

  async createWorkspace(organizationId, userId, data) {
    const hasPerm = await permissionService.hasPermission(userId, organizationId, 'workspace:create');
    if (!hasPerm) {
      throw new Error('Unauthorized to create workspaces');
    }

    return organizationRepository.createWorkspace(organizationId, data);
  }

  async updateMemberRole(organizationId, userId, memberUserId, role) {
    const hasPerm = await permissionService.hasPermission(userId, organizationId, 'org:update');
    if (!hasPerm) {
      throw new Error('Unauthorized to modify member roles');
    }

    return organizationRepository.updateMemberRole(organizationId, memberUserId, role);
  }

  async removeMember(organizationId, userId, memberUserId) {
    const hasPerm = await permissionService.hasPermission(userId, organizationId, 'org:remove_member');
    if (!hasPerm) {
      throw new Error('Unauthorized to remove members');
    }

    return organizationRepository.removeMember(organizationId, memberUserId);
  }
}

module.exports = new OrganizationService();
