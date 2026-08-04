'use strict';

const prisma = require('../../config/database');

/**
 * Conversation Number Generator
 * Generates sequential business conversation numbers formatted as CONV-YYYY-XXXXXX.
 */
async function generateConversationNumber() {
  const currentYear = new Date().getFullYear();
  const prefix = `CONV-${currentYear}-`;

  const lastConversation = await prisma.conversation.findFirst({
    where: {
      conversationNumber: {
        startsWith: prefix,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      conversationNumber: true,
    },
  });

  let nextSequence = 1;
  if (lastConversation && lastConversation.conversationNumber) {
    const parts = lastConversation.conversationNumber.split('-');
    if (parts.length === 3) {
      const lastSeq = parseInt(parts[2], 10);
      if (!isNaN(lastSeq)) {
        nextSequence = lastSeq + 1;
      }
    }
  }

  const paddedSequence = String(nextSequence).padStart(6, '0');
  return `${prefix}${paddedSequence}`;
}

module.exports = {
  generateConversationNumber,
};
