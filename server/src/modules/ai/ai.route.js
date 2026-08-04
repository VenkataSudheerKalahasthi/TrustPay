'use strict';

const express = require('express');
const aiController = require('./ai.controller');
const { authenticate } = require('../../middlewares/auth');
const { validate } = require('../../middlewares/validate');
const { aiPromptSchema, aiFeedbackSchema } = require('../../../../shared/src/validators/aiSearch.validator');

const router = express.Router();

router.use(authenticate);

// Generate AI Prompt / Chat
router.post(
  '/chat',
  validate({ body: aiPromptSchema }),
  aiController.processPrompt.bind(aiController)
);

// Summarize Document / Text
router.post(
  '/summarize',
  aiController.summarize.bind(aiController)
);

// Assist Writing (Rewrite, Expand, Shorten, Grammar)
router.post(
  '/assist-writing',
  aiController.assistWriting.bind(aiController)
);

// Get User Conversations
router.get(
  '/conversations',
  aiController.getConversations.bind(aiController)
);

// Get Single Conversation Detail
router.get(
  '/conversations/:id',
  aiController.getConversation.bind(aiController)
);

// Toggle Conversation Pin
router.patch(
  '/conversations/:id/pin',
  aiController.togglePin.bind(aiController)
);

// Toggle Conversation Archive
router.patch(
  '/conversations/:id/archive',
  aiController.toggleArchive.bind(aiController)
);

// Submit AI Message Feedback
router.post(
  '/messages/:messageId/feedback',
  validate({ body: aiFeedbackSchema }),
  aiController.submitFeedback.bind(aiController)
);

// Get Prompt Templates
router.get(
  '/templates',
  aiController.getPromptTemplates.bind(aiController)
);

module.exports = router;
