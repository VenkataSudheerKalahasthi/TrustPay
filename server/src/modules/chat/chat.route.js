'use strict';

const express = require('express');
const chatController = require('./chat.controller');
const { authenticate } = require('../../middlewares/auth');
const { validate } = require('../../middlewares/validate');
const {
  createConversationSchema,
  sendMessageSchema,
  editMessageSchema,
  deleteMessageSchema,
  addReactionSchema,
  chatSearchQuerySchema,
} = require('../../../../shared/src/validators/chat.validator');

const router = express.Router();

router.use(authenticate);

// List User Conversations
router.get(
  '/conversations',
  validate({ query: chatSearchQuerySchema }),
  chatController.getUserConversations.bind(chatController)
);

// Create Conversation (Direct, Project, Group)
router.post(
  '/conversations',
  validate({ body: createConversationSchema }),
  chatController.createConversation.bind(chatController)
);

// Get Conversation Messages by ID
router.get(
  '/conversations/:id',
  chatController.getConversationById.bind(chatController)
);

// Mark Conversation as Read
router.post(
  '/conversations/:id/read',
  chatController.markAsRead.bind(chatController)
);

// Send Message
router.post(
  '/messages',
  validate({ body: sendMessageSchema }),
  chatController.sendMessage.bind(chatController)
);

// Edit Message (Immutable Versioning)
router.put(
  '/messages/:messageId',
  validate({ body: editMessageSchema }),
  chatController.editMessage.bind(chatController)
);

// Delete Message (Soft Delete)
router.delete(
  '/messages/:messageId',
  validate({ body: deleteMessageSchema }),
  chatController.deleteMessage.bind(chatController)
);

// Toggle Emoji Reaction
router.post(
  '/messages/:messageId/reactions',
  validate({ body: addReactionSchema }),
  chatController.toggleReaction.bind(chatController)
);

module.exports = router;
