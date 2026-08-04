'use strict';

const ticketService = require('./ticket.service');
const slaService = require('./sla.service');
const knowledgeService = require('./knowledge.service');
const disputeService = require('./dispute.service');
const customerSuccessService = require('./customerSuccess.service');

class SupportController {
  // Tickets
  async createTicket(req, res) {
    const ticket = await ticketService.createTicket(req.body, req.user.id);
    res.status(201).json({ success: true, message: 'Support ticket created successfully', data: ticket });
  }

  async getTickets(req, res) {
    const filter = { ...req.query };
    if (req.user.role === 'CLIENT' || req.user.role === 'WORKER') {
      filter.requesterUserId = req.user.id;
    }
    const tickets = await ticketService.getTickets(filter);
    res.status(200).json({ success: true, data: tickets });
  }

  async getTicketById(req, res) {
    const ticket = await ticketService.getTicketDetails(req.params.id);
    res.status(200).json({ success: true, data: ticket });
  }

  async addMessage(req, res) {
    const message = await ticketService.addMessage(req.params.id, req.user.id, req.body.body, req.body.isInternal);
    res.status(201).json({ success: true, message: 'Reply posted successfully', data: message });
  }

  async assignAgent(req, res) {
    const ticket = await ticketService.assignAgent(req.params.id, req.body.assigneeUserId, req.user.id);
    res.status(200).json({ success: true, message: 'Ticket assigned successfully', data: ticket });
  }

  async updateStatus(req, res) {
    const ticket = await ticketService.updateStatus(req.params.id, req.body.status, req.user.id);
    res.status(200).json({ success: true, message: `Ticket status updated to ${req.body.status}`, data: ticket });
  }

  // SLA Policies
  async createSLAPolicy(req, res) {
    const policy = await slaService.createSLAPolicy(req.body);
    res.status(201).json({ success: true, message: 'SLA policy created successfully', data: policy });
  }

  async getSLAPolicies(req, res) {
    const policies = await slaService.getSLAPolicies();
    res.status(200).json({ success: true, data: policies });
  }

  async evaluateTicketSLA(req, res) {
    const sla = await slaService.evaluateTicketSLA(req.params.id);
    res.status(200).json({ success: true, data: sla });
  }

  // Knowledge Base
  async createKnowledgeArticle(req, res) {
    const article = await knowledgeService.createArticle(req.body, req.user.id);
    res.status(201).json({ success: true, message: 'Knowledge article created', data: article });
  }

  async getKnowledgeArticles(req, res) {
    const articles = await knowledgeService.getArticles(req.query);
    res.status(200).json({ success: true, data: articles });
  }

  async getKnowledgeArticleBySlug(req, res) {
    const article = await knowledgeService.getArticleBySlug(req.params.slug);
    res.status(200).json({ success: true, data: article });
  }

  // Feedback & CSAT
  async submitFeedback(req, res) {
    const feedback = await customerSuccessService.submitFeedback(req.body, req.user.id);
    res.status(201).json({ success: true, message: 'Feedback submitted successfully', data: feedback });
  }

  async getFeedbacks(req, res) {
    const feedbacks = await customerSuccessService.getFeedbacks();
    res.status(200).json({ success: true, data: feedbacks });
  }

  async submitCSAT(req, res) {
    const csat = await customerSuccessService.submitCSAT(req.body, req.user.id);
    res.status(201).json({ success: true, message: 'CSAT rating recorded', data: csat });
  }

  async getCustomerHealth(req, res) {
    const health = await customerSuccessService.getCustomerHealthScore(req.params.userId || req.user.id);
    res.status(200).json({ success: true, data: health });
  }

  // Disputes
  async createDispute(req, res) {
    const dispute = await disputeService.createDispute(req.body, req.user.id);
    res.status(201).json({ success: true, message: 'Dispute case opened successfully', data: dispute });
  }

  async getDisputes(req, res) {
    const filter = { ...req.query };
    if (req.user.role === 'CLIENT' || req.user.role === 'WORKER') {
      filter.raiserUserId = req.user.id;
    }
    const disputes = await disputeService.getDisputes(filter);
    res.status(200).json({ success: true, data: disputes });
  }

  async resolveDispute(req, res) {
    const resolution = await disputeService.resolveDispute(req.params.id, req.user.id, req.body);
    res.status(200).json({ success: true, message: 'Dispute settled successfully', data: resolution });
  }

  // AI Advisory Support Insights
  async getAIInsights(req, res) {
    const insights = await customerSuccessService.getAIAdvisorySupportInsights(req.user.id);
    res.status(200).json({ success: true, data: insights });
  }
}

module.exports = new SupportController();
