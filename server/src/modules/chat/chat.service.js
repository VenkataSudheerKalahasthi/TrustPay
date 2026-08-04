'use strict';

const crypto = require('crypto');
const chatRepository = require('./chat.repository');
const ConversationAuth = require('./conversationAuth');
const { generateConversationNumber } = require('./conversationNumberGenerator');
const { isValidDeliveryTransition } = require('./messageDeliveryStateMachine');
const { getCommunicationStoragePath } = require('./chatStorageConstants');
const prisma = require('../../config/database');
const { ValidationError, AuthorizationError, NotFoundError } = require('../../utils/ApiError');

class ChatService {
  /**
   * Create or Retrieve Conversation
   */
  async createConversation(userId, userRole, data) {
    const { type = 'DIRECT', title, description, participantUserIds = [], projectId, contractId } = data;

    // Direct Conversation Deduplication
    if (type === 'DIRECT' && participantUserIds.length === 1) {
      const recipientId = participantUserIds[0];
      const existing = await chatRepository.findDirectConversation(userId, recipientId);
      if (existing) {
        return existing;
      }
    }

    const conversationNumber = await generateConversationNumber();

    // Verify Project access if linked
    if (projectId) {
      const project = await prisma.project.findUnique({ where: { id: projectId } });
      if (!project) {
        throw new NotFoundError('Linked Project');
      }
    }

    // Verify Contract access if linked
    if (contractId) {
      const contract = await prisma.contract.findUnique({ where: { id: contractId } });
      if (!contract) {
        throw new NotFoundError('Linked Contract');
      }
    }

    // Combine participants
    const uniqueUserIds = Array.from(new Set([userId, ...participantUserIds]));

    const participantData = uniqueUserIds.map((uid) => ({
      userId: uid,
      role: uid === userId ? 'OWNER' : 'MEMBER',
    }));

    const conversation = await chatRepository.createConversation({
      conversationNumber,
      type,
      title: title || (type === 'DIRECT' ? null : 'New Conversation'),
      description: description || null,
      projectId: projectId || null,
      contractId: contractId || null,
      createdById: userId,
      lastMessageAt: new Date(),
      participants: {
        create: participantData,
      },
    });

    return conversation;
  }

  /**
   * Get User Conversations List
   */
  async getUserConversations(userId, role, query = {}) {
    return chatRepository.findUserConversations(userId, query);
  }

  /**
   * Get Conversation Details & Messages
   */
  async getConversationById(conversationId, userId, role, messageQuery = {}) {
    const { conversation } = await ConversationAuth.verifyParticipant(conversationId, userId, role);
    const messagesData = await chatRepository.findConversationMessages(conversationId, messageQuery);

    return {
      conversation,
      messages: messagesData.messages,
      pagination: {
        total: messagesData.total,
        page: messagesData.page,
        limit: messagesData.limit,
      },
    };
  }

  /**
   * Send Message
   */
  async sendMessage(userId, role, data) {
    const { conversationId, content, messageType = 'TEXT', parentMessageId, forwardedFromMessageId, attachments = [] } = data;

    await ConversationAuth.verifyParticipant(conversationId, userId, role);

    if (parentMessageId) {
      const parent = await chatRepository.findMessageById(parentMessageId);
      if (!parent || parent.conversationId !== conversationId) {
        throw new ValidationError('Parent reply message does not belong to this conversation');
      }
    }

    const message = await chatRepository.createMessage({
      conversationId,
      senderUserId: userId,
      messageType,
      content,
      deliveryStatus: 'SENT',
      parentMessageId: parentMessageId || null,
      forwardedFromMessageId: forwardedFromMessageId || null,
      currentVersion: 1,
    });

    // Handle Attachments with SHA-256 integrity calculation
    if (attachments.length > 0) {
      await Promise.all(
        attachments.map(async (att) => {
          let sha256Hash = att.sha256Hash || null;
          if (!sha256Hash && att.fileBuffer) {
            sha256Hash = crypto.createHash('sha256').update(att.fileBuffer).digest('hex');
          }
          const storagePath = getCommunicationStoragePath(att.mimeType || 'attachment', att.fileName);

          await chatRepository.createAttachment({
            messageId: message.id,
            fileName: att.fileName,
            fileUrl: att.fileUrl || storagePath,
            fileType: att.fileType || null,
            fileSize: att.fileSize || null,
            mimeType: att.mimeType || null,
            sha256Hash,
            uploadedByUserId: userId,
          });
        })
      );
    }

    // Mention Detection & Metadata Parsing (@username pattern)
    const mentionRegex = /@(\w+)/g;
    const matches = content.match(mentionRegex);
    if (matches && matches.length > 0) {
      const usernames = matches.map((m) => m.substring(1));
      const mentionedUsers = await prisma.user.findMany({
        where: { firstName: { in: usernames, mode: 'insensitive' } },
        select: { id: true },
      });

      await Promise.all(
        mentionedUsers.map((mu) =>
          chatRepository.createMention({
            messageId: message.id,
            mentionedUserId: mu.id,
            mentionStatus: 'UNSEEN',
            seenStatus: false,
          })
        )
      );
    }

    // Update conversation lastMessageAt
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date() },
    });

    return chatRepository.findMessageById(message.id);
  }

  /**
   * Edit Message (Immutable Versioning Engine)
   */
  async editMessage(messageId, userId, role, data) {
    const message = await chatRepository.findMessageById(messageId);
    if (!message) {
      throw new NotFoundError('Message');
    }

    if (message.senderUserId !== userId && role !== 'ADMIN') {
      throw new AuthorizationError('You can only edit your own messages');
    }

    if (message.isDeleted) {
      throw new ValidationError('Cannot edit a deleted message');
    }

    const previousContent = message.content;
    const nextVersionNumber = message.currentVersion + 1;

    // Create immutable MessageVersion record
    await chatRepository.createMessageVersion({
      messageId,
      versionNumber: message.currentVersion,
      previousContent,
      editedByUserId: userId,
      editReason: data.editReason || null,
      editedAt: new Date(),
    });

    // Update Message content
    const updated = await chatRepository.updateMessage(messageId, {
      content: data.content,
      isEdited: true,
      editedAt: new Date(),
      currentVersion: nextVersionNumber,
    });

    return updated;
  }

  /**
   * Soft Delete Message
   */
  async deleteMessage(messageId, userId, role, data = {}) {
    const message = await chatRepository.findMessageById(messageId);
    if (!message) {
      throw new NotFoundError('Message');
    }

    if (message.senderUserId !== userId && role !== 'ADMIN') {
      throw new AuthorizationError('You can only delete your own messages');
    }

    const deleted = await chatRepository.softDeleteMessage(messageId, userId, data.deleteReason || null);
    return deleted;
  }

  /**
   * Toggle Reaction
   */
  async toggleReaction(messageId, userId, role, emoji) {
    const message = await chatRepository.findMessageById(messageId);
    if (!message) {
      throw new NotFoundError('Message');
    }
    await ConversationAuth.verifyParticipant(message.conversationId, userId, role);

    return chatRepository.toggleReaction(messageId, userId, emoji);
  }

  /**
   * Update Message Delivery Status (Centralized State Machine)
   */
  async updateDeliveryStatus(messageId, targetStatus) {
    const message = await chatRepository.findMessageById(messageId);
    if (!message) {
      throw new NotFoundError('Message');
    }

    if (!isValidDeliveryTransition(message.deliveryStatus, targetStatus)) {
      return message; // Ignore invalid transitions safely
    }

    return chatRepository.updateMessage(messageId, { deliveryStatus: targetStatus });
  }

  /**
   * Mark Conversation as Read
   */
  async markConversationAsRead(conversationId, userId, role) {
    await ConversationAuth.verifyParticipant(conversationId, userId, role);

    await chatRepository.updateParticipantLastRead(conversationId, userId);

    const unreadMessages = await prisma.message.findMany({
      where: {
        conversationId,
        senderUserId: { not: userId },
      },
      select: { id: true },
    });

    await Promise.all(
      unreadMessages.map((m) => chatRepository.recordReadReceipt(m.id, userId))
    );

    return { success: true };
  }

  /**
   * Search Messages
   */
  async searchMessages(userId, role, query = {}) {
    const { q, conversationId, limit = 20, page = 1 } = query;
    if (conversationId) {
      await ConversationAuth.verifyParticipant(conversationId, userId, role);
    }
    return chatRepository.findUserConversations(userId, { q, limit, page });
  }
}

module.exports = new ChatService();
