'use strict';

const clientService = require('./client.service');
const ApiResponse = require('../../utils/ApiResponse');
const { updateClientProfileSchema } = require('../../../../shared/src/validators/client.validator');

class ClientController {
  async getMyProfile(req, res, next) {
    try {
      const profile = await clientService.getClientByUserId(req.user.id);
      return ApiResponse.success(res, profile, 'Client profile retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const validated = updateClientProfileSchema.parse(req.body);
      const profile = await clientService.updateClientProfile(req.user.id, validated);
      return ApiResponse.success(res, profile, 'Client profile updated successfully');
    } catch (err) {
      next(err);
    }
  }

  async addFavoriteWorker(req, res, next) {
    try {
      const { workerProfileId } = req.params;
      const fav = await clientService.addFavoriteWorker(req.user.id, workerProfileId);
      return ApiResponse.created(res, fav, 'Worker added to favorites');
    } catch (err) {
      next(err);
    }
  }

  async removeFavoriteWorker(req, res, next) {
    try {
      const { workerProfileId } = req.params;
      await clientService.removeFavoriteWorker(req.user.id, workerProfileId);
      return ApiResponse.success(res, null, 'Worker removed from favorites');
    } catch (err) {
      next(err);
    }
  }

  async getFavoriteWorkers(req, res, next) {
    try {
      const favorites = await clientService.getFavoriteWorkers(req.user.id);
      return ApiResponse.success(res, favorites, 'Favorite workers retrieved');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ClientController();
