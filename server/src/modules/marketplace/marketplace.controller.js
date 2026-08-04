'use strict';

const marketplaceService = require('./marketplace.service');
const ApiResponse = require('../../utils/ApiResponse');

class MarketplaceController {
  async searchJobs(req, res, next) {
    try {
      const result = await marketplaceService.searchJobs(req.query);
      return ApiResponse.success(res, result, 'Marketplace jobs retrieved');
    } catch (err) {
      next(err);
    }
  }

  async getJobDetails(req, res, next) {
    try {
      const { slug } = req.params;
      const job = await marketplaceService.getJobBySlug(slug);
      if (!job) {
        return ApiResponse.error(res, 'Job opportunity not found', 404);
      }
      return ApiResponse.success(res, { job }, 'Job details retrieved');
    } catch (err) {
      next(err);
    }
  }

  async createJob(req, res, next) {
    try {
      const clientUserId = req.user.id;
      const result = await marketplaceService.createJob(clientUserId, req.body);
      if (result.warning) {
        return ApiResponse.success(res, result, 'Duplicate job posting warning');
      }
      return ApiResponse.success(res, result.job, 'Job opportunity published successfully');
    } catch (err) {
      next(err);
    }
  }

  async submitProposal(req, res, next) {
    try {
      const workerUserId = req.user.id;
      const proposal = await marketplaceService.submitProposal(workerUserId, req.body);
      return ApiResponse.success(res, proposal, 'Proposal submitted successfully');
    } catch (err) {
      next(err);
    }
  }

  async getJobProposals(req, res, next) {
    try {
      const { jobId } = req.params;
      const clientUserId = req.user.id;
      const proposals = await marketplaceService.getJobProposals(jobId, clientUserId);
      return ApiResponse.success(res, { proposals }, 'Job proposals retrieved');
    } catch (err) {
      next(err);
    }
  }

  async updateProposalStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status, currentVersion } = req.body;
      const updated = await marketplaceService.updateProposalStatus(id, status, currentVersion);
      return ApiResponse.success(res, updated, 'Proposal status updated');
    } catch (err) {
      next(err);
    }
  }

  async acceptOffer(req, res, next) {
    try {
      const { offerId } = req.params;
      const workerUserId = req.user.id;
      const result = await marketplaceService.acceptOfferAndCreateContract(offerId, workerUserId);
      return ApiResponse.success(res, result, 'Offer accepted and contract created');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new MarketplaceController();
