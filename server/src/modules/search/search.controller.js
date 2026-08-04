'use strict';

const searchService = require('./search.service');
const ApiResponse = require('../../utils/ApiResponse');

class SearchController {
  async search(req, res, next) {
    try {
      const userId = req.user.id;
      const userRole = req.user.role;
      const result = await searchService.search(userId, userRole, req.query);
      return ApiResponse.success(res, result, 'Global search results retrieved');
    } catch (err) {
      next(err);
    }
  }

  async getSuggestions(req, res, next) {
    try {
      const userId = req.user.id;
      const userRole = req.user.role;
      const { q } = req.query;
      const result = await searchService.getSuggestions(userId, userRole, q);
      return ApiResponse.success(res, result, 'Search suggestions retrieved');
    } catch (err) {
      next(err);
    }
  }

  async getRecentSearches(req, res, next) {
    try {
      const userId = req.user.id;
      const searches = await searchService.getRecentSearches(userId);
      return ApiResponse.success(res, { searches }, 'Recent searches retrieved');
    } catch (err) {
      next(err);
    }
  }

  async saveSearch(req, res, next) {
    try {
      const userId = req.user.id;
      const saved = await searchService.saveSearch(userId, req.body);
      return ApiResponse.success(res, saved, 'Search query saved');
    } catch (err) {
      next(err);
    }
  }

  async getSavedSearches(req, res, next) {
    try {
      const userId = req.user.id;
      const searches = await searchService.getSavedSearches(userId);
      return ApiResponse.success(res, { searches }, 'Saved searches retrieved');
    } catch (err) {
      next(err);
    }
  }

  async logAnalytics(req, res, next) {
    try {
      const userId = req.user.id;
      await searchService.logClickAnalytics(userId, req.body);
      return ApiResponse.success(res, { success: true }, 'Search click analytics logged');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new SearchController();
