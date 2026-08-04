'use strict';

const { prisma } = require('../../config/database');

class AdminRepository {
  // ─── Overview Metrics ──────────────────────────────────────────
  async getOverviewMetrics() {
    const [
      totalUsers,
      totalOrganizations,
      totalProjects,
      totalContracts,
      totalEscrowDeposits,
      totalAiUsages,
      totalWebhooks,
      recentAnnouncements,
    ] = await Promise.all([
      prisma.user.count().catch(() => 0),
      prisma.organization.count().catch(() => 0),
      prisma.project.count().catch(() => 0),
      prisma.contract.count().catch(() => 0),
      prisma.escrowDeposit.aggregate({ _sum: { amount: true } }).catch(() => ({ _sum: { amount: 0 } })),
      prisma.aiUsage.aggregate({ _sum: { totalTokens: true } }).catch(() => ({ _sum: { totalTokens: 0 } })),
      prisma.webhook.count().catch(() => 0),
      prisma.adminAnnouncement.findMany({ take: 5, orderBy: { createdAt: 'desc' } }).catch(() => []),
    ]);

    return {
      totalUsers,
      totalOrganizations,
      totalProjects,
      totalContracts,
      totalEscrowVolume: totalEscrowDeposits._sum.amount || 0,
      totalAiTokens: totalAiUsages._sum.totalTokens || 0,
      totalWebhooks,
      recentAnnouncements,
    };
  }

  // ─── User Administration ───────────────────────────────────────
  async findUsers(search, role) {
    const where = {};
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (role) {
      where.role = role;
    }

    return prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isVerified: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async setUserSuspension(userId, isSuspended) {
    return prisma.user.update({
      where: { id: userId },
      data: { isActive: !isSuspended },
    });
  }

  async createUserRestriction(data) {
    return prisma.userRestriction.create({
      data: {
        targetUserId: data.targetUserId,
        imposedById: data.imposedById,
        type: data.type || 'LIMITED_ACCESS',
        reason: data.reason,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      },
    });
  }

  async addUserAdministrativeNote(data) {
    return prisma.userAdministrativeNote.create({
      data: {
        targetUserId: data.targetUserId,
        authorId: data.authorId,
        noteText: data.noteText,
      },
    });
  }

  // ─── Verification Reviews ─────────────────────────────────────
  async findVerificationReviews() {
    return prisma.userVerificationReview.findMany({
      include: {
        targetUser: { select: { id: true, email: true, firstName: true, lastName: true, role: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 30,
    });
  }

  async reviewVerification(id, reviewerId, status, notes) {
    const review = await prisma.userVerificationReview.update({
      where: { id },
      data: {
        reviewerId,
        status,
        notes,
        reviewedAt: new Date(),
      },
    });

    if (status === 'VERIFIED') {
      await prisma.user.update({
        where: { id: review.targetUserId },
        data: { isVerified: true },
      });
    }

    return review;
  }

  // ─── Contract Oversight ───────────────────────────────────────
  async findContractsOversight() {
    return prisma.contract.findMany({
      select: {
        id: true,
        contractNumber: true,
        title: true,
        status: true,
        totalAmount: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 30,
    });
  }

  async updateContractOversight(data) {
    return prisma.contractAdministration.upsert({
      where: { contractId: data.contractId },
      update: {
        statusNote: data.statusNote,
        isFlagged: data.isFlagged || false,
        flagReason: data.flagReason,
      },
      create: {
        contractId: data.contractId,
        statusNote: data.statusNote,
        isFlagged: data.isFlagged || false,
        flagReason: data.flagReason,
      },
    });
  }

  // ─── Wallet Oversight ─────────────────────────────────────────
  async findWalletsOversight() {
    return prisma.escrowWallet.findMany({
      select: {
        id: true,
        balance: true,
        heldInEscrow: true,
        currency: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 30,
    });
  }

  async updateWalletOversight(data) {
    return prisma.walletAdministration.upsert({
      where: { walletId: data.walletId },
      update: {
        isFrozen: data.isFrozen || false,
        freezeReason: data.freezeReason,
      },
      create: {
        walletId: data.walletId,
        isFrozen: data.isFrozen || false,
        freezeReason: data.freezeReason,
      },
    });
  }

  // ─── Announcements & Operational Notices ─────────────────────
  async createAnnouncement(createdById, data) {
    return prisma.adminAnnouncement.create({
      data: {
        createdById,
        title: data.title,
        message: data.content || data.message,
        targetRole: data.targetRole || 'ALL',
      },
    });
  }

  async getAnnouncements() {
    return prisma.adminAnnouncement.findMany({
      orderBy: { createdAt: 'desc' },
      include: { createdBy: { select: { firstName: true, lastName: true } } },
    });
  }

  // ─── Bulk Operations ──────────────────────────────────────────
  async createBulkOperation(operationType, targetCount, detailsJson) {
    return prisma.adminBulkOperation.create({
      data: {
        operationType,
        targetCount,
        status: 'RUNNING',
        detailsJson: typeof detailsJson === 'string' ? detailsJson : JSON.stringify(detailsJson),
      },
    });
  }

  async updateBulkOperationProgress(id, successCount, failureCount, status) {
    return prisma.adminBulkOperation.update({
      where: { id },
      data: {
        successCount,
        failureCount,
        status: status || 'COMPLETED',
      },
    });
  }

  async getBulkOperations() {
    return prisma.adminBulkOperation.findMany({
      orderBy: { executedAt: 'desc' },
      take: 20,
    });
  }

  // ─── Platform Settings & Audit History ───────────────────────
  async getPlatformSettings() {
    return prisma.platformSetting.findMany({
      orderBy: { key: 'asc' },
    });
  }

  async updatePlatformSetting(key, value) {
    return prisma.platformSetting.upsert({
      where: { key },
      update: { value, updatedAt: new Date() },
      create: { key, value },
    });
  }

  async logAdminAction(adminId, action, targetEntity, targetId, detailsJson) {
    return prisma.adminActionHistory.create({
      data: {
        adminId,
        action,
        targetEntity,
        targetId,
        detailsJson: typeof detailsJson === 'string' ? detailsJson : JSON.stringify(detailsJson),
      },
    });
  }

  async getAdminActionHistory() {
    return prisma.adminActionHistory.findMany({
      include: { admin: { select: { firstName: true, lastName: true, email: true } } },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }
}

module.exports = new AdminRepository();
