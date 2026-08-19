'use strict';

const { prisma } = require('../../config/database');

class ActivityService {
  /**
   * Log System / Business Activity
   */
  async logActivity({
    actorUserId = null,
    targetUserId = null,
    category = 'SYSTEM',
    action,
    title,
    description = null,
    ipAddress = null,
    userAgent = null,
    metadata = null,
    projectId = null,
    contractId = null,
  }) {
    const activity = await prisma.activity.create({
      data: {
        actorUserId,
        targetUserId,
        category,
        action,
        title,
        description,
        ipAddress,
        userAgent,
        metadataJson: metadata ? JSON.stringify(metadata) : null,
        projectId,
        contractId,
      },
      include: {
        actorUser: { select: { id: true, firstName: true, lastName: true, avatar: true } },
        targetUser: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    return activity;
  }

  /**
   * Find Activity Feed Items (Paginated)
   */
  async getActivityFeed({ category, actorUserId, limit = 20, page = 1 } = {}) {
    const skip = (page - 1) * limit;

    const where = {};
    if (category) {
      where.category = category;
    }
    if (actorUserId) {
      where.actorUserId = actorUserId;
    }

    const [total, activities] = await Promise.all([
      prisma.activity.count({ where }),
      prisma.activity.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          actorUser: { select: { id: true, firstName: true, lastName: true, avatar: true, role: true } },
          targetUser: { select: { id: true, firstName: true, lastName: true } },
          project: { select: { id: true, projectNumber: true, title: true } },
          contract: { select: { id: true, contractNumber: true, title: true } },
        },
      }),
    ]);

    return { activities, total, page, limit };
  }
}

module.exports = new ActivityService();
