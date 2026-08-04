'use strict';

const express = require('express');
const supportController = require('./support.controller');
const { authenticate } = require('../../middlewares/auth');
const { validate } = require('../../middlewares/validate');
const {
  createTicketSchema,
  updateTicketStatusSchema,
  createTicketMessageSchema,
  assignTicketSchema,
  createSLAPolicySchema,
  createKnowledgeArticleSchema,
  createFeedbackSchema,
  submitCSATSchema,
  createDisputeSchema,
  resolveDisputeSchema,
} = require('../../../../shared/src/validators/support.validator');

const router = express.Router();

router.use(authenticate);

// Support Tickets
router.get('/tickets', supportController.getTickets.bind(supportController));
router.post('/tickets', validate({ body: createTicketSchema }), supportController.createTicket.bind(supportController));
router.get('/tickets/:id', supportController.getTicketById.bind(supportController));
router.post('/tickets/:id/messages', validate({ body: createTicketMessageSchema }), supportController.addMessage.bind(supportController));
router.post('/tickets/:id/assign', validate({ body: assignTicketSchema }), supportController.assignAgent.bind(supportController));
router.patch('/tickets/:id/status', validate({ body: updateTicketStatusSchema }), supportController.updateStatus.bind(supportController));

// SLA
router.get('/sla/policies', supportController.getSLAPolicies.bind(supportController));
router.post('/sla/policies', validate({ body: createSLAPolicySchema }), supportController.createSLAPolicy.bind(supportController));
router.get('/sla/evaluate/:id', supportController.evaluateTicketSLA.bind(supportController));

// Knowledge Base
router.get('/knowledge/articles', supportController.getKnowledgeArticles.bind(supportController));
router.post('/knowledge/articles', validate({ body: createKnowledgeArticleSchema }), supportController.createKnowledgeArticle.bind(supportController));
router.get('/knowledge/articles/:slug', supportController.getKnowledgeArticleBySlug.bind(supportController));

// Customer Success & Feedback
router.post('/feedback', validate({ body: createFeedbackSchema }), supportController.submitFeedback.bind(supportController));
router.get('/feedback', supportController.getFeedbacks.bind(supportController));
router.post('/csat', validate({ body: submitCSATSchema }), supportController.submitCSAT.bind(supportController));
router.get('/health', supportController.getCustomerHealth.bind(supportController));
router.get('/health/:userId', supportController.getCustomerHealth.bind(supportController));

// Disputes
router.get('/disputes', supportController.getDisputes.bind(supportController));
router.post('/disputes', validate({ body: createDisputeSchema }), supportController.createDispute.bind(supportController));
router.post('/disputes/:id/resolve', validate({ body: resolveDisputeSchema }), supportController.resolveDispute.bind(supportController));

// AI Advisory Insights
router.get('/ai-insights', supportController.getAIInsights.bind(supportController));

module.exports = router;
