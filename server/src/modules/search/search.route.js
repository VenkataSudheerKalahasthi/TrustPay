'use strict';

const express = require('express');
const searchController = require('./search.controller');
const { authenticate } = require('../../middlewares/auth');
const { validate } = require('../../middlewares/validate');
const { globalSearchSchema, savedSearchSchema } = require('../../../../shared/src/validators/aiSearch.validator');

const router = express.Router();

router.use(authenticate);

// Global Search
router.get(
  '/',
  validate({ query: globalSearchSchema }),
  searchController.search.bind(searchController)
);

// Instant Suggestions
router.get(
  '/suggestions',
  searchController.getSuggestions.bind(searchController)
);

// Recent Searches
router.get(
  '/recent',
  searchController.getRecentSearches.bind(searchController)
);

// Saved Searches List
router.get(
  '/saved',
  searchController.getSavedSearches.bind(searchController)
);

// Save Search Query
router.post(
  '/saved',
  validate({ body: savedSearchSchema }),
  searchController.saveSearch.bind(searchController)
);

// Search Click Analytics Log
router.post(
  '/analytics/click',
  searchController.logAnalytics.bind(searchController)
);

module.exports = router;
