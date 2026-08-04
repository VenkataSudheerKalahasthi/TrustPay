'use strict';

const prisma = require('../../config/database');

const ROLE_PERMISSIONS = {
  OWNER: ['*'],
  ADMIN: [
    'org:update',
    'org:invite',
    'org:remove_member',
    'workspace:create',
    'workspace:update',
    'project:create',
    'contract:create',
    'escrow:manage',
  ],
  MANAGER: [
    'org:view',
    'workspace:view',
    'project:create',
    'project:update',
    'contract:create',
    'contract:update',
  ],
  MEMBER: [
    'org:view',
    'workspace:view',
    'project:view',
    'contract:view',
    'chat:send',
  ],
  VIEWER: [
    'org:view',
    'workspace:view',
    'project:view',
    'contract:view',
  ],
};

class PermissionService {
  /**
   * Get Effective Permissions for a User in an Organization
   */
  async getEffectivePermissions(userId, organizationId) {
    const member = await prisma.organizationMember.findUnique({
      where: { organizationId_userId: { organizationId, userId } },
    });

    if (!member) {
      return { role: null, permissions: [] };
    }

    const permissions = ROLE_PERMISSIONS[member.role] || ROLE_PERMISSIONS.VIEWER;

    return {
      role: member.role,
      permissions,
      hasFullAccess: member.role === 'OWNER',
    };
  }

  /**
   * Check if User has specific permission action
   */
  async hasPermission(userId, organizationId, action) {
    const { role, permissions, hasFullAccess } = await this.getEffectivePermissions(userId, organizationId);
    if (!role) {
      return false;
    }
    if (hasFullAccess) {
      return true;
    }
    return permissions.includes(action) || permissions.includes('*');
  }
}

module.exports = new PermissionService();
