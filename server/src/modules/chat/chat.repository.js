'use strict';

const prisma = require('../../config/database');

class ChatRepository {
  /**
   * Create Conversation
   */
  async createConversation(data) {
    return prisma.conversation.create({
      data,
      include: {
        participants: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, email: true, avatar: true, role: true },
            },
          },
        },
        project: { select: { id: true, projectNumber: true, title: true } },
        contract: { select: { id: true, contractNumber: true, title: true } },
      },
    });
  }

  /**
   * Find Conversation by ID with full details
   */
  async findConversationById(id) {
    return prisma.conversation.findUnique({
      where: { id },
      include: {
        participants: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, email: true, avatar: true, role: true },
            },
          },
        },
        project: { select: { id: true, projectNumber: true, title: true } },
        contract: { select: { id: true, contractNumber: true, title: true } },
        createdBy: { select: { id: true, firstName: true, lastName: true } },
      },
    });
  }

  /**
   * Find Direct Conversation between 2 users if it exists
   */
  async findDirectConversation(userAId, userBId) {
    return prisma.conversation.findFirst({
      where: {
        type: 'DIRECT',
        AND: [
          { participants: { some: { userId: userAId } } },
          { participants: { some: { userId: userBId } } },
        ],
      },
      include: {
        participants: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, email: true, avatar: true, role: true },
            },
          },
        },
      },
    });
  }

  /**
   * Find User Conversations List
   */
  async findUserConversations(userId, { limit = 20, page = 1, q } = {}) {
    const skip = (page - 1) * limit;

    const where = {
      participants: { some: { userId } },
      isArchived: false,
    };

    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { conversationNumber: { contains: q, mode: 'insensitive' } },
        { messages: { some: { content: { contains: q, mode: 'insensitive' } } } },
      ];
    }

    const [total, conversations] = await Promise.all([
      prisma.conversation.count({ where }),
      prisma.conversation.findMany({
        where,
        skip,
        take: limit,
        orderBy: { lastMessageAt: 'desc' },
        include: {
          participants: {
            include: {
              user: {
                select: { id: true, firstName: true, lastName: true, email: true, avatar: true, role: true },
              },
            },
          },
          messages: {
            take: 1,
            orderBy: { createdAt: 'desc' },
            include: {
              senderUser: { select: { id: true, firstName: true, lastName: true } },
              attachments: true,
            },
          },
          project: { select: { id: true, projectNumber: true, title: true } },
          contract: { select: { id: true, contractNumber: true, title: true } },
        },
      }),
    ]);

    return { conversations, total, page, limit };
  }

  /**
   * Create Message
   */
  async createMessage(data) {
    return prisma.message.create({
      data,
      include: {
        senderUser: {
          select: { id: true, firstName: true, lastName: true, email: true, avatar: true, role: true },
        },
        parentMessage: {
          select: {
            id: true,
            content: true,
            senderUser: { select: { id: true, firstName: true, lastName: true } },
          },
        },
        attachments: true,
        versions: true,
        reactions: {
          include: {
            user: { select: { id: true, firstName: true, lastName: true } },
          },
        },
        reads: {
          include: {
            user: { select: { id: true, firstName: true, lastName: true } },
          },
        },
      },
    });
  }

  /**
   * Find Message by ID
   */
  async findMessageById(id) {
    return prisma.message.findUnique({
      where: { id },
      include: {
        senderUser: { select: { id: true, firstName: true, lastName: true } },
        conversation: true,
        versions: {
          orderBy: { versionNumber: 'desc' },
          include: {
            editedByUser: { select: { id: true, firstName: true, lastName: true } },
          },
        },
        attachments: true,
        reactions: true,
        reads: true,
      },
    });
  }

  /**
   * Find Messages for a Conversation (Paginated)
   */
  async findConversationMessages(conversationId, { limit = 50, page = 1 } = {}) {
    const skip = (page - 1) * limit;

    const [total, messages] = await Promise.all([
      prisma.message.count({ where: { conversationId } }),
      prisma.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: 'asc' },
        skip,
        take: limit,
        include: {
          senderUser: {
            select: { id: true, firstName: true, lastName: true, email: true, avatar: true, role: true },
          },
          parentMessage: {
            select: {
              id: true,
              content: true,
              senderUser: { select: { id: true, firstName: true, lastName: true } },
            },
          },
          versions: {
            orderBy: { versionNumber: 'desc' },
            include: {
              editedByUser: { select: { id: true, firstName: true, lastName: true } },
            },
          },
          attachments: true,
          reactions: {
            include: {
              user: { select: { id: true, firstName: true, lastName: true } },
            },
          },
          reads: {
            include: {
              user: { select: { id: true, firstName: true, lastName: true } },
            },
          },
        },
      }),
    ]);

    return { messages, total, page, limit };
  }

  /**
   * Create Immutable Message Version
   */
  async createMessageVersion(data) {
    return prisma.messageVersion.create({ data });
  }

  /**
   * Update Message
   */
  async updateMessage(id, data) {
    return prisma.message.update({
      where: { id },
      data,
      include: {
        senderUser: { select: { id: true, firstName: true, lastName: true, avatar: true } },
        attachments: true,
        versions: {
          orderBy: { versionNumber: 'desc' },
        },
      },
    });
  }

  /**
   * Soft Delete Message
   */
  async softDeleteMessage(id, deletedByUserId, deleteReason = null) {
    return prisma.message.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedByUserId,
        deletedAt: new Date(),
        deleteReason,
        content: 'This message was deleted.',
      },
    });
  }

  /**
   * Create Attachment
   */
  async createAttachment(data) {
    return prisma.messageAttachment.create({ data });
  }

  /**
   * Add or Toggle Reaction
   */
  async toggleReaction(messageId, userId, emoji) {
    const existing = await prisma.messageReaction.findUnique({
      where: {
        messageId_userId_emoji: { messageId, userId, emoji },
      },
    });

    if (existing) {
      await prisma.messageReaction.delete({ where: { id: existing.id } });
      return { action: 'removed', emoji };
    }

    const created = await prisma.messageReaction.create({
      data: { messageId, userId, emoji },
      include: { user: { select: { id: true, firstName: true, lastName: true } } },
    });

    return { action: 'added', reaction: created };
  }

  /**
   * Record Message Read Receipt
   */
  async recordReadReceipt(messageId, userId) {
    return prisma.messageRead.upsert({
      where: {
        messageId_userId: { messageId, userId },
      },
      update: { readAt: new Date() },
      create: { messageId, userId, readAt: new Date() },
    });
  }

  /**
   * Update Participant Last Read Timestamp
   */
  async updateParticipantLastRead(conversationId, userId) {
    return prisma.conversationParticipant.update({
      where: {
        conversationId_userId: { conversationId, userId },
      },
      data: { lastReadAt: new Date() },
    }).catch(() => null);
  }

  /**
   * Add Mention Metadata
   */
  async createMention(data) {
    return prisma.mention.create({ data });
  }
}

module.exports = new ChatRepository();
