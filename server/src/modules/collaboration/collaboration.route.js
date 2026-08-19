'use strict';

const express = require('express');
const router = express.Router();
const collaborationController = require('./collaboration.controller');
const { authenticate } = require('../../middlewares/auth');

// All endpoints require authentication
router.use(authenticate);

// Collaboration Requests
router.post('/requests', (req, res, next) => collaborationController.requestCollaboration(req, res, next));
router.get('/requests', (req, res, next) => collaborationController.getRequests(req, res, next));
router.get('/requests/:id', (req, res, next) => collaborationController.getRequestById(req, res, next));
router.post('/requests/:id/respond', (req, res, next) => collaborationController.respondToRequest(req, res, next));

// Workspaces
router.get('/workspaces', (req, res, next) => collaborationController.getWorkspaces(req, res, next));
router.get('/workspaces/:id', (req, res, next) => collaborationController.getWorkspaceById(req, res, next));
router.put('/workspaces/:id/planning-board', (req, res, next) => collaborationController.updatePlanningBoard(req, res, next));
router.post('/workspaces/:id/sign-contract', (req, res, next) => collaborationController.signContract(req, res, next));
router.post('/workspaces/:id/fund-escrow', (req, res, next) => collaborationController.fundEscrow(req, res, next));
router.post('/workspaces/:id/execution-progress', (req, res, next) => collaborationController.updateExecutionProgress(req, res, next));
router.post('/workspaces/:id/approve-completion', (req, res, next) => collaborationController.approveFinalDelivery(req, res, next));
router.get('/workspaces/:id/certificate', (req, res, next) => collaborationController.getCertificate(req, res, next));

module.exports = router;
