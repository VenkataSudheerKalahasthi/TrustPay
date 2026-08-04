'use strict';

const productivityService = require('./productivity.service');
const ApiResponse = require('../../utils/ApiResponse');

class ProductivityController {
  // Bookmarks
  async getBookmarks(req, res, next) {
    try {
      const userId = req.user.id;
      const bookmarks = await productivityService.getBookmarks(userId);
      return ApiResponse.success(res, { bookmarks }, 'Bookmarks retrieved');
    } catch (err) {
      next(err);
    }
  }

  async addBookmark(req, res, next) {
    try {
      const userId = req.user.id;
      const bookmark = await productivityService.addBookmark(userId, req.body);
      return ApiResponse.success(res, bookmark, 'Bookmark added');
    } catch (err) {
      next(err);
    }
  }

  async removeBookmark(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      await productivityService.removeBookmark(id, userId);
      return ApiResponse.success(res, { success: true }, 'Bookmark removed');
    } catch (err) {
      next(err);
    }
  }

  // Pinned Items
  async getPinnedItems(req, res, next) {
    try {
      const userId = req.user.id;
      const pinnedItems = await productivityService.getPinnedItems(userId);
      return ApiResponse.success(res, { pinnedItems }, 'Pinned items retrieved');
    } catch (err) {
      next(err);
    }
  }

  async addPinnedItem(req, res, next) {
    try {
      const userId = req.user.id;
      const pinned = await productivityService.addPinnedItem(userId, req.body);
      return ApiResponse.success(res, pinned, 'Item pinned');
    } catch (err) {
      next(err);
    }
  }

  async reorderPinnedItems(req, res, next) {
    try {
      const userId = req.user.id;
      await productivityService.reorderPinnedItems(userId, req.body.itemsOrder || []);
      return ApiResponse.success(res, { success: true }, 'Pinned items reordered');
    } catch (err) {
      next(err);
    }
  }

  async removePinnedItem(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      await productivityService.removePinnedItem(id, userId);
      return ApiResponse.success(res, { success: true }, 'Pinned item removed');
    } catch (err) {
      next(err);
    }
  }

  // Recently Viewed
  async getRecentlyViewed(req, res, next) {
    try {
      const userId = req.user.id;
      const recentlyViewed = await productivityService.getRecentlyViewed(userId);
      return ApiResponse.success(res, { recentlyViewed }, 'Recently viewed history retrieved');
    } catch (err) {
      next(err);
    }
  }

  async recordRecentlyViewed(req, res, next) {
    try {
      const userId = req.user.id;
      const record = await productivityService.recordRecentlyViewed(userId, req.body);
      return ApiResponse.success(res, record, 'Recently viewed recorded');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ProductivityController();
