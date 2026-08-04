'use strict';

const { BaseRepository } = require('../../repositories/base.repository');

/**
 * Authentication & User Repository.
 * Extends BaseRepository for the User model and handles RefreshToken queries.
 */
class AuthRepository extends BaseRepository {
  constructor() {
    super('user');
  }

  /**
   * Find user by email (case-insensitive).
   * @param {string} email
   * @returns {Promise<import('@prisma/client').User|null>}
   */
  async findByEmail(email) {
    return this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
  }

  /**
   * Find user by email verification token hash.
   * @param {string} tokenHash
   * @returns {Promise<import('@prisma/client').User|null>}
   */
  async findByVerificationToken(tokenHash) {
    return this.prisma.user.findFirst({
      where: {
        emailVerificationToken: tokenHash,
        emailVerificationExpires: { gt: new Date() },
      },
    });
  }

  /**
   * Find user by password reset token hash.
   * @param {string} tokenHash
   * @returns {Promise<import('@prisma/client').User|null>}
   */
  async findByResetToken(tokenHash) {
    return this.prisma.user.findFirst({
      where: {
        passwordResetToken: tokenHash,
        passwordResetExpires: { gt: new Date() },
      },
    });
  }

  /**
   * Update last login timestamp.
   * @param {string} userId
   * @returns {Promise<import('@prisma/client').User>}
   */
  async updateLastLogin(userId) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { lastLogin: new Date() },
    });
  }

  // ─── Refresh Token Database Operations ────────────────────────────────────

  /**
   * Store a hashed refresh token in DB.
   * @param {object} params
   * @param {string} params.userId
   * @param {string} params.tokenHash
   * @param {Date}   params.expiresAt
   * @returns {Promise<import('@prisma/client').RefreshToken>}
   */
  async createRefreshToken({ userId, tokenHash, expiresAt }) {
    return this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt,
      },
    });
  }

  /**
   * Find refresh token by hash, including the user and session.
   * @param {string} tokenHash
   * @returns {Promise<(import('@prisma/client').RefreshToken & { user: import('@prisma/client').User, session: import('@prisma/client').Session })|null>}
   */
  async findRefreshToken(tokenHash) {
    return this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true, session: true },
    });
  }

  /**
   * Revoke a refresh token.
   * @param {string} id
   * @param {string} [replacedByToken]
   * @returns {Promise<import('@prisma/client').RefreshToken>}
   */
  async revokeRefreshToken(id, replacedByToken = null) {
    return this.prisma.refreshToken.update({
      where: { id },
      data: {
        isRevoked: true,
        replacedByToken,
      },
    });
  }

  /**
   * Revoke all refresh tokens for a user (logout all devices / security event).
   * @param {string} userId
   * @returns {Promise<{ count: number }>}
   */
  async revokeAllUserRefreshTokens(userId) {
    return this.prisma.refreshToken.updateMany({
      where: { userId, isRevoked: false },
      data: { isRevoked: true },
    });
  }
}

module.exports = new AuthRepository();
