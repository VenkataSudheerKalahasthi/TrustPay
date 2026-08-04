'use strict';

const fileService = require('./file.service');
const storageService = require('./storage.service');
const ApiResponse = require('../../utils/ApiResponse');

class FileController {
  async createFile(req, res, next) {
    try {
      const userId = req.user.id;
      const fileAsset = await fileService.createFileAsset(userId, req.body);
      return ApiResponse.success(res, fileAsset, 'File asset registered successfully');
    } catch (err) {
      next(err);
    }
  }

  async getFiles(req, res, next) {
    try {
      const userId = req.user.id;
      const files = await fileService.getUserFiles(userId, req.query);
      return ApiResponse.success(res, { files }, 'User files retrieved');
    } catch (err) {
      next(err);
    }
  }

  async getFileDetails(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const file = await fileService.getFileDetails(id, userId);
      return ApiResponse.success(res, { file }, 'File details retrieved');
    } catch (err) {
      next(err);
    }
  }

  async addFileVersion(req, res, next) {
    try {
      const { id } = req.params;
      const version = await fileService.addFileVersion(id, req.body);
      return ApiResponse.success(res, version, 'New file version uploaded');
    } catch (err) {
      next(err);
    }
  }

  async createShareLink(req, res, next) {
    try {
      const { id } = req.params;
      const shareResult = await fileService.createShareLink(id, req.body);
      return ApiResponse.success(res, shareResult, 'File share link generated');
    } catch (err) {
      next(err);
    }
  }

  async toggleFavorite(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const { isFavorite } = req.body;
      await fileService.toggleFavorite(id, userId, isFavorite);
      return ApiResponse.success(res, { success: true }, 'Favorite status updated');
    } catch (err) {
      next(err);
    }
  }

  async deleteFile(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      await fileService.softDeleteFile(id, userId);
      return ApiResponse.success(res, { success: true }, 'File soft-deleted');
    } catch (err) {
      next(err);
    }
  }

  async getStorageStats(req, res, next) {
    try {
      const stats = await storageService.getStorageStats();
      return ApiResponse.success(res, { storageStats: stats }, 'Storage stats retrieved');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new FileController();
