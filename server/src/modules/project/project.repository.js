'use strict';

const prisma = require('../../config/database');

class ProjectRepository {
  /**
   * Create a new Project record
   */
  async create(data) {
    return prisma.project.create({
      data,
      include: {
        clientProfile: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, email: true, avatar: true },
            },
          },
        },
        workerProfile: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, email: true, avatar: true },
            },
          },
        },
        contract: {
          select: { id: true, contractNumber: true, title: true, status: true },
        },
        escrowWallet: {
          select: { id: true, totalBalance: true, availableBalance: true, heldBalance: true },
        },
      },
    });
  }

  /**
   * Find project by ID with full execution details
   */
  async findById(id) {
    return prisma.project.findUnique({
      where: { id },
      include: {
        clientProfile: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, email: true, avatar: true },
            },
          },
        },
        workerProfile: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, email: true, avatar: true },
            },
          },
        },
        contract: {
          select: { id: true, contractNumber: true, title: true, status: true, scopeOfWork: true },
        },
        escrowWallet: {
          select: { id: true, totalBalance: true, availableBalance: true, heldBalance: true },
        },
        createdBy: {
          select: { id: true, firstName: true, lastName: true, email: true, avatar: true },
        },
        members: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, email: true, avatar: true, role: true },
            },
          },
        },
        milestones: {
          orderBy: { order: 'asc' },
          include: {
            prerequisiteMilestone: {
              select: { id: true, title: true, status: true },
            },
            deliverables: {
              include: {
                versions: {
                  orderBy: { versionNumber: 'desc' },
                  include: {
                    submittedByUser: {
                      select: { id: true, firstName: true, lastName: true, email: true },
                    },
                  },
                },
              },
            },
            evidenceList: {
              include: {
                uploadedByUser: {
                  select: { id: true, firstName: true, lastName: true },
                },
              },
            },
          },
        },
        deliverables: {
          orderBy: { createdAt: 'desc' },
          include: {
            versions: {
              orderBy: { versionNumber: 'desc' },
              include: {
                submittedByUser: {
                  select: { id: true, firstName: true, lastName: true, email: true },
                },
              },
            },
            milestone: { select: { id: true, title: true, status: true } },
          },
        },
        evidenceList: {
          orderBy: { uploadedAt: 'desc' },
          include: {
            uploadedByUser: {
              select: { id: true, firstName: true, lastName: true, email: true },
            },
            milestone: { select: { id: true, title: true } },
            deliverable: { select: { id: true, title: true } },
          },
        },
        attachments: {
          orderBy: { createdAt: 'desc' },
          include: {
            uploadedByUser: {
              select: { id: true, firstName: true, lastName: true, email: true },
            },
          },
        },
        timelines: {
          orderBy: { createdAt: 'desc' },
          include: {
            performedByUser: {
              select: { id: true, firstName: true, lastName: true, email: true },
            },
          },
        },
        statusHistory: {
          orderBy: { createdAt: 'desc' },
          include: {
            changedByUser: {
              select: { id: true, firstName: true, lastName: true, email: true },
            },
          },
        },
      },
    });
  }

  /**
   * Search and filter projects with pagination
   */
  async findMany({ where, orderBy, page = 1, limit = 10 }) {
    const skip = (page - 1) * limit;

    const [total, projects] = await Promise.all([
      prisma.project.count({ where }),
      prisma.project.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          clientProfile: {
            include: {
              user: {
                select: { id: true, firstName: true, lastName: true, email: true, avatar: true },
              },
            },
          },
          workerProfile: {
            include: {
              user: {
                select: { id: true, firstName: true, lastName: true, email: true, avatar: true },
              },
            },
          },
          contract: { select: { id: true, contractNumber: true, title: true, status: true } },
          milestones: { select: { id: true, status: true } },
          deliverables: { select: { id: true, status: true } },
        },
      }),
    ]);

    return {
      projects,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Update Project record
   */
  async update(id, data) {
    return prisma.project.update({
      where: { id },
      data,
    });
  }

  /**
   * Add Member to Project
   */
  async addMember(projectId, userId, role = 'WORKER') {
    return prisma.projectMember.upsert({
      where: {
        projectId_userId: { projectId, userId },
      },
      update: { role },
      create: { projectId, userId, role },
    });
  }

  /**
   * Create Project Milestone
   */
  async createMilestone(data) {
    return prisma.projectMilestone.create({
      data,
      include: {
        prerequisiteMilestone: { select: { id: true, title: true, status: true } },
      },
    });
  }

  /**
   * Find Milestone by ID
   */
  async findMilestoneById(id) {
    return prisma.projectMilestone.findUnique({
      where: { id },
      include: {
        prerequisiteMilestone: true,
        deliverables: true,
      },
    });
  }

  /**
   * Update Milestone
   */
  async updateMilestone(id, data) {
    return prisma.projectMilestone.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete Milestone
   */
  async deleteMilestone(id) {
    return prisma.projectMilestone.delete({ where: { id } });
  }

  /**
   * Create Project Deliverable
   */
  async createDeliverable(data) {
    return prisma.projectDeliverable.create({
      data,
    });
  }

  /**
   * Find Deliverable by ID
   */
  async findDeliverableById(id) {
    return prisma.projectDeliverable.findUnique({
      where: { id },
      include: {
        versions: {
          orderBy: { versionNumber: 'desc' },
        },
      },
    });
  }

  /**
   * Create immutable DeliverableVersion
   */
  async createDeliverableVersion(data) {
    return prisma.deliverableVersion.create({
      data,
    });
  }

  /**
   * Update Deliverable status and version metadata
   */
  async updateDeliverable(id, data) {
    return prisma.projectDeliverable.update({
      where: { id },
      data,
    });
  }

  /**
   * Create Project Evidence entry
   */
  async createEvidence(data) {
    return prisma.projectEvidence.create({
      data,
    });
  }

  /**
   * Create Project Attachment entry
   */
  async createAttachment(data) {
    return prisma.projectAttachment.create({
      data,
    });
  }

  /**
   * Record Timeline Event
   */
  async createTimelineEvent(data) {
    return prisma.projectTimeline.create({
      data,
    });
  }

  /**
   * Record Status History
   */
  async createStatusHistory(data) {
    return prisma.projectStatusHistory.create({
      data,
    });
  }

  /**
   * Record Audit Activity Log
   */
  async createAuditActivity(data) {
    return prisma.projectActivity.create({
      data,
    });
  }

  /**
   * Add Comment
   */
  async createComment(data) {
    return prisma.projectComment.create({
      data,
      include: {
        authorUser: {
          select: { id: true, firstName: true, lastName: true, avatar: true },
        },
      },
    });
  }
}

module.exports = new ProjectRepository();
