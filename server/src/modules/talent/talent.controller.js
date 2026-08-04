'use strict';

const talentService = require('./talent.service');
const ApiResponse = require('../../utils/ApiResponse');

class TalentController {
  async searchTalent(req, res, next) {
    try {
      const result = await talentService.searchTalent(req.query);
      return ApiResponse.success(res, result, 'Talent discovery search results retrieved');
    } catch (err) {
      next(err);
    }
  }

  async getTalentPools(req, res, next) {
    try {
      const clientUserId = req.user.id;
      const pools = await talentService.getTalentPools(clientUserId);
      return ApiResponse.success(res, { pools }, 'Talent pools retrieved');
    } catch (err) {
      next(err);
    }
  }

  async createTalentPool(req, res, next) {
    try {
      const clientUserId = req.user.id;
      const pool = await talentService.createTalentPool(clientUserId, req.body);
      return ApiResponse.success(res, pool, 'Talent pool created successfully');
    } catch (err) {
      next(err);
    }
  }

  async addCandidateToPool(req, res, next) {
    try {
      const { poolId } = req.params;
      const { workerUserId, notes } = req.body;
      const saved = await talentService.addCandidateToPool(poolId, workerUserId, notes);
      return ApiResponse.success(res, saved, 'Candidate added to talent pool');
    } catch (err) {
      next(err);
    }
  }

  async inviteCandidate(req, res, next) {
    try {
      const clientUserId = req.user.id;
      const invitation = await talentService.inviteCandidate(clientUserId, req.body);
      return ApiResponse.success(res, invitation, 'Candidate invitation sent successfully');
    } catch (err) {
      next(err);
    }
  }

  async compareCandidates(req, res, next) {
    try {
      const { workerUserIds } = req.body;
      const result = await talentService.compareCandidates(workerUserIds);
      return ApiResponse.success(res, result, 'Candidate comparison generated');
    } catch (err) {
      next(err);
    }
  }

  async getRecommendations(req, res, next) {
    try {
      const { jobDescription } = req.query;
      const result = await talentService.getAIRecommendations(jobDescription || 'Full Stack Node and React Developer');
      return ApiResponse.success(res, result, 'AI talent recommendations generated');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new TalentController();
