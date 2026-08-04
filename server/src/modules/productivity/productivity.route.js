'use strict';

const express = require('express');
const productivityController = require('./productivity.controller');
const { authenticate } = require('../../middlewares/auth');
const { validate } = require('../../middlewares/validate');
const { bookmarkSchema, pinnedItemSchema } = require('../../../../shared/src/validators/aiSearch.validator');

const router = express.Router();

router.use(authenticate);

// Bookmarks
router.get('/bookmarks', productivityController.getBookmarks.bind(productivityController));
router.post('/bookmarks', validate({ body: bookmarkSchema }), productivityController.addBookmark.bind(productivityController));
router.delete('/bookmarks/:id', productivityController.removeBookmark.bind(productivityController));

// Pinned Items
router.get('/pinned', productivityController.getPinnedItems.bind(productivityController));
router.post('/pinned', validate({ body: pinnedItemSchema }), productivityController.addPinnedItem.bind(productivityController));
router.put('/pinned/reorder', productivityController.reorderPinnedItems.bind(productivityController));
router.delete('/pinned/:id', productivityController.removePinnedItem.bind(productivityController));

// Recently Viewed
router.get('/recent-viewed', productivityController.getRecentlyViewed.bind(productivityController));
router.post('/recent-viewed', productivityController.recordRecentlyViewed.bind(productivityController));

module.exports = router;
