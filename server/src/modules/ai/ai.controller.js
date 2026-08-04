'use strict';

const aiService = require('./ai.service');
const ApiResponse = require('../../utils/ApiResponse');

class AiController {
  async processPrompt(req, res, next) {
    try {
      const userId = req.user.id;
      const result = await aiService.processPrompt(userId, req.body);
      return ApiResponse.success(res, result, 'AI completion generated');
    } catch (err) {
      next(err);
    }
  }

  async summarize(req, res, next) {
    try {
      const userId = req.user.id;
      const result = await aiService.summarize(userId, req.body);
      return ApiResponse.success(res, result, 'Document summarized by AI');
    } catch (err) {
      next(err);
    }
  }

  async assistWriting(req, res, next) {
    try {
      const userId = req.user.id;
      const result = await aiService.assistWriting(userId, req.body);
      return ApiResponse.success(res, result, 'Writing assisted by AI');
    } catch (err) {
      next(err);
    }
  }

  async getConversations(req, res, next) {
    try {
      const userId = req.user.id;
      const conversations = await aiService.getUserConversations(userId, req.query);
      return ApiResponse.success(res, { conversations }, 'AI conversations retrieved');
    } catch (err) {
      next(err);
    }
  }

  async getConversation(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const conversation = await aiService.getConversation(id, userId);
      return ApiResponse.success(res, { conversation }, 'AI conversation details retrieved');
    } catch (err) {
      next(err);
    }
  }

  async togglePin(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const { isPinned } = req.body;
      await aiService.togglePinConversation(id, userId, isPinned);
      return ApiResponse.success(res, { success: true }, 'Conversation pin status updated');
    } catch (err) {
      next(err);
    }
  }

  async toggleArchive(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const { isArchived } = req.body;
      await aiService.toggleArchiveConversation(id, userId, isArchived);
      return ApiResponse.success(res, { success: true }, 'Conversation archive status updated');
    } catch (err) {
      next(err);
    }
  }

  async submitFeedback(req, res, next) {
    try {
      const { messageId } = req.params;
      const result = await aiService.submitFeedback(messageId, req.body);
      return ApiResponse.success(res, result, 'AI message feedback recorded');
    } catch (err) {
      next(err);
    }
  }

  async getPromptTemplates(req, res, next) {
    try {
      const templates = await aiService.getPromptTemplates(req.query);
      return ApiResponse.success(res, { templates }, 'Prompt templates retrieved');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AiController();
