'use strict';

const prisma = require('../../config/database');
const talentRepository = require('./talent.repository');
const matchingEngineService = require('./matchingEngine.service');
const recommendationService = require('./recommendation.service');
const { logger } = require('../../utils/logger');

class TalentService {
  async searchTalent(query) {
    const { total, workers } = await talentRepository.searchWorkers(query);

    // Attach dynamic weighted matching scores
    const scoredWorkers = workers.map((w) => {
      const matchScore = matchingEngineService.calculateMatchingScore(w, query);
      return { ...w, matchScore };
    });

    return { total, workers: scoredWorkers };
  }

  async getTalentPools(clientUserId) {
    return talentRepository.getTalentPools(clientUserId);
  }

  async createTalentPool(clientUserId, data) {
    let pool = null;

    await prisma.$transaction(async (tx) => {
      pool = await talentRepository.createTalentPoolInTx(tx, clientUserId, data);
    });

    logger.info('Talent pool created and committed. Dispatching post-commit events.', { poolId: pool.id });
    return pool;
  }

  async addCandidateToPool(talentPoolId, workerUserId, notes) {
    let saved = null;

    await prisma.$transaction(async (tx) => {
      saved = await talentRepository.addCandidateToPoolInTx(tx, talentPoolId, workerUserId, notes);
    });

    logger.info('Candidate saved to pool.', { talentPoolId, workerUserId });
    return saved;
  }

  async inviteCandidate(clientUserId, data) {
    let invitation = null;

    await prisma.$transaction(async (tx) => {
      invitation = await talentRepository.createInvitationInTx(tx, clientUserId, data);
    });

    logger.info('Candidate invitation sent and committed. Dispatching post-commit notification.', { invitationId: invitation.id });
    return invitation;
  }

  async compareCandidates(workerUserIds) {
    const workers = await talentRepository.getWorkersByIds(workerUserIds);

    const comparisonMatrix = await Promise.all(
      workers.map(async (w) => {
        const score = matchingEngineService.calculateMatchingScore(w, {});
        const skillGap = await recommendationService.getSkillGapAnalysis(
          w.skills?.map((s) => s.skill.name) || [],
          ['React', 'Node.js', 'PostgreSQL', 'TypeScript']
        );
        return {
          worker: w,
          matchingScore: score,
          skillGap,
        };
      })
    );

    return { comparisonMatrix };
  }

  async getAIRecommendations(jobDescription) {
    return recommendationService.getWorkerRecommendations(jobDescription);
  }
}

module.exports = new TalentService();
