'use strict';

const prisma = require('../../config/database');

class OrganizationRepository {
  async createOrganization(userId, data) {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now().toString().slice(-4);

    return prisma.organization.create({
      data: {
        name: data.name,
        slug,
        logo: data.logo || null,
        primaryColor: data.primaryColor || '#0ea5e9',
        companyAddress: data.companyAddress || null,
        members: {
          create: {
            userId,
            role: 'OWNER',
          },
        },
        workspaces: {
          create: {
            name: 'Main Workspace',
            slug: 'main',
          },
        },
      },
      include: {
        members: { include: { user: { select: { firstName: true, lastName: true, email: true } } } },
        workspaces: true,
      },
    });
  }

  async findUserOrganizations(userId) {
    return prisma.organization.findMany({
      where: {
        isArchived: false,
        members: { some: { userId } },
      },
      include: {
        members: { include: { user: { select: { id: true, firstName: true, lastName: true, avatar: true } } } },
        workspaces: true,
      },
    });
  }

  async findOrganizationById(id, userId) {
    return prisma.organization.findFirst({
      where: {
        id,
        members: { some: { userId } },
      },
      include: {
        members: { include: { user: { select: { id: true, firstName: true, lastName: true, email: true, avatar: true } } } },
        invitations: true,
        workspaces: true,
      },
    });
  }

  async createInvitation(organizationId, invitedById, email, role, token) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 day expiration

    return prisma.organizationInvitation.create({
      data: {
        organizationId,
        invitedById,
        email,
        role,
        token,
        expiresAt,
      },
    });
  }

  async createWorkspace(organizationId, data) {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now().toString().slice(-4);

    return prisma.workspace.create({
      data: {
        organizationId,
        name: data.name,
        slug,
      },
    });
  }

  async updateMemberRole(organizationId, memberUserId, role) {
    return prisma.organizationMember.updateMany({
      where: { organizationId, userId: memberUserId },
      data: { role, updatedAt: new Date() },
    });
  }

  async removeMember(organizationId, memberUserId) {
    return prisma.organizationMember.deleteMany({
      where: { organizationId, userId: memberUserId },
    });
  }
}

module.exports = new OrganizationRepository();
