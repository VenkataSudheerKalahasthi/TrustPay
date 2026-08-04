'use strict';

const workerService = require('./worker.service');
const ApiResponse = require('../../utils/ApiResponse');
const {
  updateWorkerProfileSchema,
  createPortfolioProjectSchema,
  uploadVerificationDocumentSchema,
  workerSearchQuerySchema,
} = require('../../../../shared/src/validators/worker.validator');

class WorkerController {
  async getMyProfile(req, res, next) {
    try {
      const profile = await workerService.getWorkerByUserId(req.user.id);
      return ApiResponse.success(res, profile, 'Worker profile retrieved');
    } catch (err) {
      next(err);
    }
  }

  async getPublicProfile(req, res, next) {
    try {
      const { slugOrId } = req.params;
      const data = await workerService.getPublicProfile(slugOrId);
      return ApiResponse.success(res, data, 'Public worker profile retrieved');
    } catch (err) {
      next(err);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const validated = updateWorkerProfileSchema.parse(req.body);
      const profile = await workerService.updateWorkerProfile(req.user.id, validated);
      return ApiResponse.success(res, profile, 'Worker profile updated successfully');
    } catch (err) {
      next(err);
    }
  }

  async searchWorkers(req, res, next) {
    try {
      const query = workerSearchQuerySchema.parse(req.query);
      const result = await workerService.searchWorkers(query);
      return ApiResponse.success(res, result, 'Workers retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  async addPortfolioProject(req, res, next) {
    try {
      const validated = createPortfolioProjectSchema.parse(req.body);
      const project = await workerService.addPortfolioProject(req.user.id, validated);
      return ApiResponse.created(res, project, 'Portfolio project created successfully');
    } catch (err) {
      next(err);
    }
  }

  async deletePortfolioProject(req, res, next) {
    try {
      const { id } = req.params;
      await workerService.deletePortfolioProject(req.user.id, id);
      return ApiResponse.success(res, null, 'Portfolio project deleted successfully');
    } catch (err) {
      next(err);
    }
  }

  async uploadFile(req, res, next) {
    try {
      if (!req.file) {
        return ApiResponse.error(res, 'No file provided', 400);
      }
      const category = req.query.category || 'profile-photos';
      const result = await workerService.uploadFile(req.user.id, req.file, category);
      return ApiResponse.success(res, result, 'File uploaded successfully');
    } catch (err) {
      next(err);
    }
  }

  async submitVerificationDocument(req, res, next) {
    try {
      const validated = uploadVerificationDocumentSchema.parse(req.body);
      const doc = await workerService.submitVerificationDocument(req.user.id, validated);
      return ApiResponse.created(res, doc, 'Verification document submitted successfully');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new WorkerController();
