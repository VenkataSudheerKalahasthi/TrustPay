'use strict';

const express = require('express');
const router = express.Router();
const escrowController = require('./escrow.controller');
const { authenticate } = require('../../middlewares/auth');
const { validateRequest } = require('../../middlewares/validate');
const {
  createDepositOrderSchema,
  verifyPaymentSchema,
  releaseFundsSchema,
  refundFundsSchema,
  transactionQuerySchema,
} = require('../../../../shared/src/validators/escrow.validator');

// Get Wallet Overview
router.get('/wallet', authenticate, escrowController.getWallet);

// Create Deposit Order
router.post(
  '/deposit/order',
  authenticate,
  validateRequest(createDepositOrderSchema, 'body'),
  escrowController.createDepositOrder
);

// Verify Payment
router.post(
  '/deposit/verify',
  authenticate,
  validateRequest(verifyPaymentSchema, 'body'),
  escrowController.verifyPayment
);

// Release Escrow Funds
router.post(
  '/release',
  authenticate,
  validateRequest(releaseFundsSchema, 'body'),
  escrowController.releaseFunds
);

// Refund Escrow Funds
router.post(
  '/refund',
  authenticate,
  validateRequest(refundFundsSchema, 'body'),
  escrowController.refundFunds
);

// Search Transactions
router.get(
  '/transactions',
  authenticate,
  validateRequest(transactionQuerySchema, 'query'),
  escrowController.searchTransactions
);

// Search Invoices
router.get('/invoices', authenticate, escrowController.searchInvoices);

// Download Invoice PDF
router.get('/invoices/:id/pdf', authenticate, escrowController.downloadInvoicePdf);

module.exports = router;
