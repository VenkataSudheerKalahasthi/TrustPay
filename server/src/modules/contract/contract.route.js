'use strict';

const express = require('express');
const router = express.Router();
const contractController = require('./contract.controller');
const { authenticate } = require('../../middlewares/auth');
const { validateRequest } = require('../../middlewares/validate');
const {
  createContractSchema,
  updateContractSchema,
  signContractSchema,
  contractSearchQuerySchema,
} = require('../../../../shared/src/validators/contract.validator');

// Templates endpoint (Public/Authenticated)
router.get('/templates', authenticate, contractController.getTemplates);

// Search Contracts
router.get(
  '/',
  authenticate,
  validateRequest(contractSearchQuerySchema, 'query'),
  contractController.searchContracts
);

// Create Contract
router.post(
  '/',
  authenticate,
  validateRequest(createContractSchema, 'body'),
  contractController.createContract
);

// Get Contract by ID
router.get('/:id', authenticate, contractController.getContractById);

// Update Contract (Creates New Version)
router.put(
  '/:id',
  authenticate,
  validateRequest(updateContractSchema, 'body'),
  contractController.updateContract
);

// Digitally Sign Contract
router.post(
  '/:id/sign',
  authenticate,
  validateRequest(signContractSchema, 'body'),
  contractController.signContract
);

// Update Status (Accept / Reject / Cancel)
router.patch('/:id/status', authenticate, contractController.updateStatus);

// Download PDF
router.get('/:id/pdf', authenticate, contractController.downloadPdf);

module.exports = router;
