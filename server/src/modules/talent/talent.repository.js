'use strict';

const prisma = require('../../config/database');

class TalentRepository {
  async searchWorkers({ query, availability, skip = 0, take = 20 }) {
    const where = {};
    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { bio: { contains: query, mode: 'insensitive' } },
      ];
    }
    if (availability) {
      where.availabilityStatus = availability;
    }

    const [total, workers] = await Promise.all([
      prisma.workerProfile.count({ where }),
      prisma.workerProfile.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          userId: true,
          slug: true,
          title: true,
          bio: true,
          hourlyRate: true,
          availabilityStatus: true,
          yearsExperience: true,
          verificationStatus: true,
          user: {
            select: { id: true, firstName: true, lastName: true, avatarUrl: true },
          },
          skills: {
            select: {
              skill: { select: { id: true, name: true, slug: true } },
            },
          },
        },
      }),
    ]);

    return { total, workers };
  }

  async findWorkerByUserId(userId) {
    return prisma.workerProfile.findUnique({
      where: { userId },
      select: {
        id: true,
        userId: true,
        slug: true,
        title: true,
        bio: true,
        hourlyRate: true,
        availabilityStatus: true,
        yearsExperience: true,
        verificationStatus: true,
        user: {
          select: { id: true, firstName: true, lastName: true, avatarUrl: true },
        },
        skills: {
          select: { skill: { select: { id: true, name: true } } },
        },
      },
    });
  }

  async getTalentPools(clientUserId) {
    return prisma.talentPool.findMany({
      where: { clientUserId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        description: true,
        visibility: true,
        version: true,
        createdAt: true,
        candidates: {
          select: {
            id: true,
            workerUserId: true,
            status: true,
            notes: true,
            createdAt: true,
          },
        },
      },
    });
  }

  async createTalentPoolInTx(tx, clientUserId, data) {
    return tx.talentPool.create({
      data: {
        clientUserId,
        name: data.name,
        description: data.description || null,
        visibility: data.visibility || 'PRIVATE',
      },
      select: { id: true, name: true, description: true, visibility: true, createdAt: true },
    });
  }

  async addCandidateToPoolInTx(tx, talentPoolId, workerUserId, notes) {
    return tx.savedCandidate.create({
      data: { talentPoolId, workerUserId, notes: notes || null },
      select: { id: true, talentPoolId: true, workerUserId: true, status: true, createdAt: true },
    });
  }

  async createInvitationInTx(tx, clientUserId, data) {
    return tx.candidateInvitation.create({
      data: {
        jobId: data.jobId,
        clientUserId,
        workerUserId: data.workerUserId,
        message: data.message || null,
      },
      select: { id: true, jobId: true, clientUserId: true, workerUserId: true, status: true, createdAt: true },
    });
  }

  async updateMatchingConfigInTx(tx, clientUserId, data) {
    return tx.matchingConfiguration.upsert({
      where: { clientUserId },
      update: {
        skillWeight: data.skillWeight,
        experienceWeight: data.experienceWeight,
        ratingWeight: data.ratingWeight,
        availabilityWeight: data.availabilityWeight,
        version: { increment: 1 },
      },
      create: {
        clientUserId,
        skillWeight: data.skillWeight,
        experienceWeight: data.experienceWeight,
        ratingWeight: data.ratingWeight,
        availabilityWeight: data.availabilityWeight,
      },
      select: { id: true, clientUserId: true, skillWeight: true, version: true },
    });
  }

  async getWorkersByIds(workerUserIds) {
    return prisma.workerProfile.findMany({
      where: { userId: { in: workerUserIds } },
      select: {
        id: true,
        userId: true,
        title: true,
        hourlyRate: true,
        availabilityStatus: true,
        yearsExperience: true,
        user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
        skills: { select: { skill: { select: { name: true } } } },
      },
    });
  }
}

module.exports = new TalentRepository();
