'use strict';

const { z } = require('zod');

const conversationTypeEnum = z.enum(['DIRECT', 'PROJECT', 'GROUP']);
const messageTypeEnum = z.enum(['TEXT', 'IMAGE', 'FILE', 'AUDIO', 'VIDEO', 'SYSTEM']);
const deliveryStatusEnum = z.enum(['SENDING', 'SENT', 'DELIVERED', 'READ', 'FAILED']);
const presenceStatusEnum = z.enum(['ONLINE', 'AWAY', 'BUSY', 'OFFLINE', 'INVISIBLE']);

const createConversationSchema = z.object({
  type: conversationTypeEnum.default('DIRECT'),
  title: z.string().max(150).optional().nullable(),
  description: z.string().max(1000).optional().nullable(),
  participantUserIds: z.array(z.string()).min(1, 'At least one recipient user ID is required'),
  projectId: z.string().optional().nullable(),
  contractId: z.string().optional().nullable(),
});

const sendMessageSchema = z.object({
  conversationId: z.string().min(1, 'Conversation ID required'),
  content: z.string().min(1, 'Message content cannot be empty').max(10000),
  messageType: messageTypeEnum.default('TEXT').optional(),
  parentMessageId: z.string().optional().nullable(),
  forwardedFromMessageId: z.string().optional().nullable(),
  attachments: z
    .array(
      z.object({
        fileName: z.string().min(1),
        fileUrl: z.string().url(),
        fileType: z.string().optional().nullable(),
        fileSize: z.coerce.number().optional().nullable(),
        mimeType: z.string().optional().nullable(),
        sha256Hash: z.string().optional().nullable(),
      })
    )
    .default([])
    .optional(),
});

const editMessageSchema = z.object({
  content: z.string().min(1, 'Edited content cannot be empty').max(10000),
  editReason: z.string().max(500).optional().nullable(),
});

const deleteMessageSchema = z.object({
  deleteReason: z.string().max(500).optional().nullable(),
});

const addReactionSchema = z.object({
  emoji: z.string().min(1, 'Emoji required').max(10),
});

const updatePresenceSchema = z.object({
  status: presenceStatusEnum,
});

const chatSearchQuerySchema = z.object({
  q: z.string().optional(),
  conversationId: z.string().optional(),
  type: conversationTypeEnum.optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.coerce.number().min(1).default(1).optional(),
  limit: z.coerce.number().min(1).max(100).default(20).optional(),
});

module.exports = {
  createConversationSchema,
  sendMessageSchema,
  editMessageSchema,
  deleteMessageSchema,
  addReactionSchema,
  updatePresenceSchema,
  chatSearchQuerySchema,
};
