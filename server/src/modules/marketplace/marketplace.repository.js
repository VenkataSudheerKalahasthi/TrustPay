'use strict';

const prisma = require('../../config/database');

class MarketplaceRepository {
  async getJobs({ query, categoryId, workType, experienceLevel, visibility = 'PUBLIC', skip = 0, take = 20 }) {
    const where = {
      status: 'OPEN',
      visibility,
    };

    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ];
    }
    if (categoryId) {
      where.categoryId = categoryId;
    }
    if (workType) {
      where.workType = workType;
    }
    if (experienceLevel) {
      where.experienceLevel = experienceLevel;
    }

    const [total, jobs] = await Promise.all([
      prisma.job.count({ where }),
      prisma.job.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          workType: true,
          budget: true,
          hourlyMin: true,
          hourlyMax: true,
          experienceLevel: true,
          visibility: true,
          status: true,
          proposalCount: true,
          version: true,
          createdAt: true,
          clientUser: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
            },
          },
          skills: {
            select: {
              skillId: true,
              isMandatory: true,
            },
          },
        },
      }),
    ]);

    return { total, jobs };
  }

  async findJobBySlug(slug) {
    return prisma.job.findUnique({
      where: { slug },
      select: {
        id: true,
        clientUserId: true,
        organizationId: true,
        workspaceId: true,
        title: true,
        slug: true,
        description: true,
        workType: true,
        budget: true,
        hourlyMin: true,
        hourlyMax: true,
        experienceLevel: true,
        visibility: true,
        status: true,
        proposalCount: true,
        deadlineAt: true,
        version: true,
        createdAt: true,
        updatedAt: true,
        clientUser: {
          select: { id: true, firstName: true, lastName: true, avatarUrl: true },
        },
        skills: { select: { id: true, skillId: true, isMandatory: true } },
        questions: { select: { id: true, question: true, type: true, isRequired: true } },
        attachments: { select: { id: true, name: true, storagePath: true, sizeBytes: true } },
      },
    });
  }

  async findJobById(id) {
    return prisma.job.findUnique({
      where: { id },
      select: {
        id: true,
        clientUserId: true,
        organizationId: true,
        workspaceId: true,
        title: true,
        slug: true,
        description: true,
        workType: true,
        budget: true,
        status: true,
        version: true,
        createdAt: true,
      },
    });
  }

  async findClientDuplicateJobs(clientUserId, title) {
    return prisma.job.findMany({
      where: {
        clientUserId,
        status: { in: ['OPEN', 'DRAFT'] },
        title: { contains: title, mode: 'insensitive' },
      },
      select: { id: true, title: true, slug: true, status: true, createdAt: true },
      take: 3,
    });
  }

  async createJobInTx(tx, clientUserId, data, slug) {
    return tx.job.create({
      data: {
        clientUserId,
        organizationId: data.organizationId || null,
        workspaceId: data.workspaceId || null,
        title: data.title,
        slug,
        description: data.description,
        categoryId: data.categoryId || null,
        workType: data.workType || 'FIXED',
        budget: data.budget || null,
        hourlyMin: data.hourlyMin || null,
        hourlyMax: data.hourlyMax || null,
        experienceLevel: data.experienceLevel || 'INTERMEDIATE',
        visibility: data.visibility || 'PUBLIC',
        deadlineAt: data.deadlineAt ? new Date(data.deadlineAt) : null,
        skills: data.skills
          ? { create: data.skills.map((skillId) => ({ skillId })) }
          : undefined,
        questions: data.screeningQuestions
          ? {
              create: data.screeningQuestions.map((q) => ({
                question: q.question,
                type: q.type || 'SHORT_TEXT',
                isRequired: q.isRequired !== false,
              })),
            }
          : undefined,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        version: true,
        createdAt: true,
      },
    });
  }

  async createProposalInTx(tx, workerUserId, data) {
    const proposal = await tx.proposal.create({
      data: {
        jobId: data.jobId,
        workerUserId,
        coverLetter: data.coverLetter,
        bidAmount: data.bidAmount,
        estimatedDays: data.estimatedDays,
        milestones: data.milestones
          ? {
              create: data.milestones.map((m, idx) => ({
                title: m.title,
                amount: m.amount,
                durationDays: m.durationDays,
                orderIndex: idx,
              })),
            }
          : undefined,
        answers: data.answers
          ? {
              create: data.answers.map((a) => ({
                screeningQuestionId: a.screeningQuestionId,
                answerText: a.answerText,
              })),
            }
          : undefined,
      },
      select: {
        id: true,
        jobId: true,
        workerUserId: true,
        bidAmount: true,
        estimatedDays: true,
        status: true,
        version: true,
        createdAt: true,
      },
    });

    await tx.job.update({
      where: { id: data.jobId },
      data: { proposalCount: { increment: 1 } },
    });

    return proposal;
  }

  async getJobProposals(jobId, clientUserId) {
    const job = await prisma.job.findFirst({
      where: { id: jobId, clientUserId },
      select: { id: true },
    });
    if (!job) {
      return null;
    }

    return prisma.proposal.findMany({
      where: { jobId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        jobId: true,
        workerUserId: true,
        coverLetter: true,
        bidAmount: true,
        estimatedDays: true,
        status: true,
        isFrozen: true,
        version: true,
        createdAt: true,
        workerUser: {
          select: { id: true, firstName: true, lastName: true, avatarUrl: true },
        },
        milestones: { select: { id: true, title: true, amount: true, durationDays: true } },
        answers: {
          select: {
            id: true,
            answerText: true,
            screeningQuestion: { select: { question: true } },
          },
        },
      },
    });
  }

  async updateProposalStatusInTx(tx, proposalId, status, isFrozen = false, currentVersion = 1) {
    const proposal = await tx.proposal.findUnique({
      where: { id: proposalId },
      select: { id: true, jobId: true, workerUserId: true, version: true, isFrozen: true },
    });

    if (!proposal || proposal.version !== currentVersion) {
      throw new Error('VERSION_CONFLICT');
    }

    return tx.proposal.update({
      where: { id: proposalId },
      data: {
        status,
        isFrozen: isFrozen || proposal.isFrozen,
        version: { increment: 1 },
      },
      select: {
        id: true,
        jobId: true,
        workerUserId: true,
        status: true,
        isFrozen: true,
        version: true,
        updatedAt: true,
      },
    });
  }

  async createHiringActivityInTx(tx, jobId, proposalId, actorId, action, notes) {
    return tx.hiringActivity.create({
      data: { jobId, proposalId: proposalId || null, actorId, action, notes: notes || null },
    });
  }
}

module.exports = new MarketplaceRepository();
