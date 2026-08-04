'use strict';

const express = require('express');
const talentController = require('./talent.controller');
const { authenticate } = require('../../middlewares/auth');
const { validate } = require('../../middlewares/validate');
const {
  searchTalentSchema,
  createTalentPoolSchema,
  inviteCandidateSchema,
  compareCandidatesSchema,
} = require('../../../../shared/src/validators/talent.validator');

const router = express.Router();

router.use(authenticate);

router.get('/search', validate({ query: searchTalentSchema }), talentController.searchTalent.bind(talentController));
router.get('/pools', talentController.getTalentPools.bind(talentController));
router.post('/pools', validate({ body: createTalentPoolSchema }), talentController.createTalentPool.bind(talentController));
router.post('/pools/:poolId/candidates', talentController.addCandidateToPool.bind(talentController));
router.post('/invitations', validate({ body: inviteCandidateSchema }), talentController.inviteCandidate.bind(talentController));
router.post('/compare', validate({ body: compareCandidatesSchema }), talentController.compareCandidates.bind(talentController));
router.get('/recommendations', talentController.getRecommendations.bind(talentController));

module.exports = router;
