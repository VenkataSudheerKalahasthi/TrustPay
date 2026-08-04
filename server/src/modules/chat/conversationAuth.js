'use strict';

const prisma = require('../../config/database');
const { AuthorizationError, NotFoundError } = require('../../utils/ApiError');

/**
 * Centralized Conversation Authorization Helper
 * Validates participant membership and role permissions.
 */
class ConversationAuth {
  /**
   * Check if user is a participant of the conversation and carries required role.
   * @param {string} conversationId 
   * @param {string} userId 
   * @param {string} role 
   * @param {Array<string>} [requiredRoles] 
   * @returns {Promise<object>} { conversation, participant }
   */
  static async verifyParticipant(conversationId, userId, role, requiredRoles = []) {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        participants: true,
      },
    });

    if (!conversation) {
      throw new NotFoundError('Conversation');
    }

    if (role === 'ADMIN') {
      const participant = conversation.participants.find((p) => p.userId === userId) || {
        userId,
        role: 'OWNER',
        conversationId,
      };
      return { conversation, participant };
    }

    const participant = conversation.participants.find((p) => p.userId === userId);
    if (!participant) {
      throw new AuthorizationError('You are not a participant in this conversation');
    }

    if (requiredRoles.length > 0 && !requiredRoles.includes(participant.role)) {
      throw new AuthorizationError(
        `Insufficient conversation permissions. Allowed roles: ${requiredRoles.join(', ')}`
      );
    }

    return { conversation, participant };
  }
}

module.exports = ConversationAuth;
