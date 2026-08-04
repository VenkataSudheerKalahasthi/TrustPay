'use strict';

const express = require('express');
const marketplaceController = require('./marketplace.controller');
const { authenticate } = require('../../middlewares/auth');
const { validate } = require('../../middlewares/validate');
const { createJobSchema, submitProposalSchema } = require('../../../../shared/src/validators/marketplace.validator');

const router = express.Router();

router.get('/jobs', marketplaceController.searchJobs.bind(marketplaceController));
router.get('/jobs/:slug', marketplaceController.getJobDetails.bind(marketplaceController));

router.use(authenticate);

router.post('/jobs', validate({ body: createJobSchema }), marketplaceController.createJob.bind(marketplaceController));
router.post('/proposals', validate({ body: submitProposalSchema }), marketplaceController.submitProposal.bind(marketplaceController));
router.get('/jobs/:jobId/proposals', marketplaceController.getJobProposals.bind(marketplaceController));
router.patch('/proposals/:id/status', marketplaceController.updateProposalStatus.bind(marketplaceController));
router.post('/offers/:offerId/accept', marketplaceController.acceptOffer.bind(marketplaceController));

module.exports = router;
