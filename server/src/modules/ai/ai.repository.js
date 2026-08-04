'use strict';

const prisma = require('../../config/database');

class AiRepository {
  async createConversation(data) {
    return prisma.aiConversation.create({ data });
  }

  async findUserConversations(userId, { isArchived = false, isPinned } = {}) {
    const where = { userId, isArchived };
    if (typeof isPinned === 'boolean') {
      where.isPinned = isPinned;
    }

    return prisma.aiConversation.findMany({
      where,
      orderBy: [{ isPinned: 'desc' }, { updatedAt: 'desc' }],
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  async findConversationById(id, userId) {
    return prisma.aiConversation.findFirst({
      where: { id, userId },
      include: {
        messages: { orderBy: { createdAt: 'asc' } },
      },
    });
  }

  async updateConversation(id, userId, data) {
    return prisma.aiConversation.updateMany({
      where: { id, userId },
      data,
    });
  }

  async deleteConversation(id, userId) {
    return prisma.aiConversation.deleteMany({
      where: { id, userId },
    });
  }

  async createMessage(data) {
    return prisma.aiMessage.create({ data });
  }

  async updateMessageFeedback(messageId, { feedbackScore, feedbackText }) {
    return prisma.aiMessage.update({
      where: { id: messageId },
      data: { feedbackScore, feedbackText },
    });
  }

  async logUsage(data) {
    return prisma.aiUsage.create({ data });
  }
}

module.exports = new AiRepository();
