'use strict';

const { prisma } = require('../../config/database');

class SupportRepository {
  // ─── Tickets ────────────────────────────────────────────────
  async createTicket(data) {
    const count = await prisma.supportTicket.count();
    const ticketNumber = `TICK-${new Date().getFullYear()}-${String(count + 1).padStart(6, '0')}`;

    return prisma.supportTicket.create({
      data: {
        ticketNumber,
        requesterUserId: data.requesterUserId,
        assigneeUserId: data.assigneeUserId || null,
        categoryId: data.categoryId || null,
        subject: data.subject,
        description: data.description,
        status: data.status || 'OPEN',
        priority: data.priority || 'MEDIUM',
        source: data.source || 'WEB',
        organizationId: data.organizationId || null,
        contractId: data.contractId || null,
        projectId: data.projectId || null,
        responseDueAt: data.responseDueAt || null,
        resolutionDueAt: data.resolutionDueAt || null,
      },
      include: {
        requesterUser: { select: { id: true, firstName: true, lastName: true, email: true, avatar: true } },
        assigneeUser: { select: { id: true, firstName: true, lastName: true, email: true, avatar: true } },
        category: true,
      },
    });
  }

  async findTicketById(id) {
    return prisma.supportTicket.findUnique({
      where: { id },
      include: {
        requesterUser: { select: { id: true, firstName: true, lastName: true, email: true, avatar: true } },
        assigneeUser: { select: { id: true, firstName: true, lastName: true, email: true, avatar: true } },
        category: true,
        messages: {
          include: {
            sender: { select: { id: true, firstName: true, lastName: true, avatar: true, role: true } },
            attachments: true,
          },
          orderBy: { createdAt: 'asc' },
        },
        attachments: true,
        slaMetrics: true,
      },
    });
  }

  async findTickets(filter = {}) {
    const where = {};
    if (filter.requesterUserId) {
      where.requesterUserId = filter.requesterUserId;
    }
    if (filter.assigneeUserId) {
      where.assigneeUserId = filter.assigneeUserId;
    }
    if (filter.status) {
      where.status = filter.status;
    }
    if (filter.priority) {
      where.priority = filter.priority;
    }
    if (filter.organizationId) {
      where.organizationId = filter.organizationId;
    }

    return prisma.supportTicket.findMany({
      where,
      include: {
        requesterUser: { select: { id: true, firstName: true, lastName: true, email: true, avatar: true } },
        assigneeUser: { select: { id: true, firstName: true, lastName: true, email: true, avatar: true } },
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateTicket(id, data) {
    return prisma.supportTicket.update({
      where: { id },
      data: {
        ...data,
        version: { increment: 1 },
      },
      include: {
        requesterUser: { select: { id: true, firstName: true, lastName: true, email: true, avatar: true } },
        assigneeUser: { select: { id: true, firstName: true, lastName: true, email: true, avatar: true } },
        category: true,
      },
    });
  }

  // ─── Ticket Messages ────────────────────────────────────────
  async createTicketMessage(data) {
    return prisma.ticketMessage.create({
      data: {
        ticketId: data.ticketId,
        senderId: data.senderId,
        body: data.body,
        isInternal: data.isInternal !== undefined ? data.isInternal : false,
      },
      include: {
        sender: { select: { id: true, firstName: true, lastName: true, avatar: true, role: true } },
        attachments: true,
      },
    });
  }

  async createTicketAssignment(data) {
    return prisma.ticketAssignment.create({
      data: {
        ticketId: data.ticketId,
        assignedById: data.assignedById,
        assignedToId: data.assignedToId,
      },
      include: {
        assignedTo: { select: { id: true, firstName: true, lastName: true, email: true, avatar: true } },
      },
    });
  }

  // ─── SLA Policies & Metrics ─────────────────────────────────
  async createSLAPolicy(data) {
    return prisma.sLAPolicy.create({
      data: {
        name: data.name,
        description: data.description || null,
        firstResponseTimeMins: data.firstResponseTimeMins || 120,
        resolutionTimeMins: data.resolutionTimeMins || 1440,
        isDefault: data.isDefault || false,
      },
    });
  }

  async findSLAPolicies() {
    return prisma.sLAPolicy.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async createSLAMetric(data) {
    return prisma.sLAMetric.create({
      data: {
        ticketId: data.ticketId,
        slaPolicyId: data.slaPolicyId || null,
        status: data.status || 'ON_TRACK',
        firstResponseTimeMins: data.firstResponseTimeMins || null,
        resolutionTimeMins: data.resolutionTimeMins || null,
      },
    });
  }

  async updateSLAMetric(id, data) {
    return prisma.sLAMetric.update({
      where: { id },
      data,
    });
  }

  // ─── Knowledge Base Articles & Categories ───────────────────
  async createKnowledgeArticle(data) {
    const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    return prisma.knowledgeBaseArticle.create({
      data: {
        title: data.title,
        slug: `${slug}-${Date.now().toString(36)}`,
        content: data.content,
        categoryId: data.categoryId || null,
        authorId: data.authorId,
        status: data.status || 'DRAFT',
        tags: data.tags || [],
        publishedAt: data.status === 'PUBLISHED' ? new Date() : null,
      },
      include: {
        author: { select: { id: true, firstName: true, lastName: true } },
        category: true,
      },
    });
  }

  async findKnowledgeArticles(filter = {}) {
    const where = {};
    if (filter.status) {
      where.status = filter.status;
    }
    if (filter.categoryId) {
      where.categoryId = filter.categoryId;
    }
    if (filter.query) {
      where.OR = [
        { title: { contains: filter.query, mode: 'insensitive' } },
        { content: { contains: filter.query, mode: 'insensitive' } },
      ];
    }

    return prisma.knowledgeBaseArticle.findMany({
      where,
      include: {
        author: { select: { id: true, firstName: true, lastName: true } },
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findKnowledgeArticleBySlug(slug) {
    const article = await prisma.knowledgeBaseArticle.findUnique({
      where: { slug },
      include: {
        author: { select: { id: true, firstName: true, lastName: true } },
        category: true,
      },
    });
    if (article) {
      await prisma.knowledgeBaseArticle.update({
        where: { id: article.id },
        data: { viewCount: { increment: 1 } },
      });
    }
    return article;
  }

  // ─── Customer Feedback & Satisfaction (CSAT) ───────────────
  async createCustomerFeedback(data) {
    return prisma.customerFeedback.create({
      data: {
        userId: data.userId,
        type: data.type || 'GENERAL',
        rating: data.rating || 5,
        title: data.title || null,
        comment: data.comment || null,
      },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, avatar: true } },
      },
    });
  }

  async findCustomerFeedbacks() {
    return prisma.customerFeedback.findMany({
      include: {
        user: { select: { id: true, firstName: true, lastName: true, avatar: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createCustomerSatisfaction(data) {
    return prisma.customerSatisfaction.create({
      data: {
        userId: data.userId,
        ticketId: data.ticketId || null,
        csatScore: data.csatScore || 5,
        npsScore: data.npsScore || null,
        feedbackText: data.feedbackText || null,
      },
    });
  }

  async findCSATMetrics() {
    return prisma.customerSatisfaction.findMany({ orderBy: { createdAt: 'desc' } });
  }

  // ─── Dispute Cases & Resolutions ────────────────────────────
  async createDisputeCase(data) {
    const count = await prisma.disputeCase.count();
    const disputeNumber = `DSP-${new Date().getFullYear()}-${String(count + 1).padStart(6, '0')}`;

    return prisma.disputeCase.create({
      data: {
        disputeNumber,
        ticketId: data.ticketId || null,
        contractId: data.contractId || null,
        projectId: data.projectId || null,
        raiserUserId: data.raiserUserId,
        targetUserId: data.targetUserId || null,
        amountDisputed: data.amountDisputed || 0,
        reason: data.reason,
        evidenceUrls: data.evidenceUrls || [],
        status: data.status || 'OPEN',
      },
      include: {
        raiserUser: { select: { id: true, firstName: true, lastName: true, email: true } },
        targetUser: { select: { id: true, firstName: true, lastName: true, email: true } },
        resolutions: true,
      },
    });
  }

  async findDisputeCases(filter = {}) {
    const where = {};
    if (filter.raiserUserId) {
      where.raiserUserId = filter.raiserUserId;
    }
    if (filter.targetUserId) {
      where.targetUserId = filter.targetUserId;
    }
    if (filter.status) {
      where.status = filter.status;
    }

    return prisma.disputeCase.findMany({
      where,
      include: {
        raiserUser: { select: { id: true, firstName: true, lastName: true, email: true } },
        targetUser: { select: { id: true, firstName: true, lastName: true, email: true } },
        resolutions: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createDisputeResolution(data) {
    const res = await prisma.disputeResolution.create({
      data: {
        disputeCaseId: data.disputeCaseId,
        resolvedById: data.resolvedById,
        notes: data.notes,
        refundAmount: data.refundAmount || 0,
        releaseAmount: data.releaseAmount || 0,
      },
    });

    await prisma.disputeCase.update({
      where: { id: data.disputeCaseId },
      data: {
        status: 'RESOLVED',
        resolvedAt: new Date(),
      },
    });

    return res;
  }
}

module.exports = new SupportRepository();
