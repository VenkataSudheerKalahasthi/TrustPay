'use strict';

const chatService = require('./chat.service');
const ApiResponse = require('../../utils/ApiResponse');

class ChatController {
  _getAuditMeta(req) {
    return {
      requestId: req.id || req.headers['x-request-id'] || null,
      ipAddress: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    };
  }

  async createConversation(req, res, next) {
    try {
      const userId = req.user.id;
      const role = req.user.role;
      const conversation = await chatService.createConversation(userId, role, req.body);
      return ApiResponse.created(res, conversation, 'Conversation initialized successfully');
    } catch (err) {
      next(err);
    }
  }

  async getUserConversations(req, res, next) {
    try {
      const userId = req.user.id;
      const role = req.user.role;
      const result = await chatService.getUserConversations(userId, role, req.query);
      return ApiResponse.success(res, result, 'User conversations retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  async getConversationById(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const role = req.user.role;
      const result = await chatService.getConversationById(id, userId, role, req.query);
      return ApiResponse.success(res, result, 'Conversation details retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  async sendMessage(req, res, next) {
    try {
      const userId = req.user.id;
      const role = req.user.role;
      const message = await chatService.sendMessage(userId, role, req.body);
      return ApiResponse.created(res, message, 'Message sent successfully');
    } catch (err) {
      next(err);
    }
  }

  async editMessage(req, res, next) {
    try {
      const { messageId } = req.params;
      const userId = req.user.id;
      const role = req.user.role;
      const message = await chatService.editMessage(messageId, userId, role, req.body);
      return ApiResponse.success(res, message, 'Message edited and new version recorded');
    } catch (err) {
      next(err);
    }
  }

  async deleteMessage(req, res, next) {
    try {
      const { messageId } = req.params;
      const userId = req.user.id;
      const role = req.user.role;
      const result = await chatService.deleteMessage(messageId, userId, role, req.body);
      return ApiResponse.success(res, result, 'Message soft-deleted successfully');
    } catch (err) {
      next(err);
    }
  }

  async toggleReaction(req, res, next) {
    try {
      const { messageId } = req.params;
      const { emoji } = req.body;
      const userId = req.user.id;
      const role = req.user.role;
      const result = await chatService.toggleReaction(messageId, userId, role, emoji);
      return ApiResponse.success(res, result, 'Reaction updated');
    } catch (err) {
      next(err);
    }
  }

  async markAsRead(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const role = req.user.role;
      const result = await chatService.markConversationAsRead(id, userId, role);
      return ApiResponse.success(res, result, 'Conversation marked as read');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ChatController();
