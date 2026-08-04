'use strict';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authRepository = require('./auth.repository');
const sessionRepository = require('./session.repository');
const { env } = require('../../config/env');
const { generateSecureToken, hashToken } = require('../../utils/crypto');
const { sendEmailVerification, sendPasswordReset } = require('../../utils/email');
const { authLogger } = require('../../utils/logger');
const { parseRequestInfo } = require('../../utils/requestInfo');
const { logAuthEvent, AUDIT_EVENTS } = require('../../utils/auditLogger');
const {
  ValidationError,
  AuthenticationError,
  ConflictError,
} = require('../../utils/ApiError');

/**
 * TrustPay – Authentication & Authorization Business Logic Service.
 * Enhanced with Session Management and Structured Audit Logging.
 */
class AuthService {
  /**
   * Sanitize user object to never leak sensitive hashes or tokens.
   * @param {import('@prisma/client').User} user
   */
  sanitizeUser(user) {
    if (!user) {
      return null;
    }
    const {
      passwordHash: _passwordHash,
      emailVerificationToken: _emailVerificationToken,
      emailVerificationExpires: _emailVerificationExpires,
      passwordResetToken: _passwordResetToken,
      passwordResetExpires: _passwordResetExpires,
      ...cleanUser
    } = user;
    return cleanUser;
  }

  /**
   * Generate JWT Access Token (15m expiration).
   * @param {object} user
   * @returns {string}
   */
  generateAccessToken(user) {
    return jwt.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
        type: 'access',
      },
      env.JWT_ACCESS_SECRET,
      {
        expiresIn: env.JWT_ACCESS_EXPIRES_IN || '15m',
        algorithm: 'HS256',
      }
    );
  }

  /**
   * Generate JWT Refresh Token (7d expiration) and store hash in DB.
   * @param {object} user
   * @returns {Promise<{ refreshToken: string, plainToken: string, tokenHash: string, expiresAt: Date, refreshTokenRecord: object }>}
   */
  async generateRefreshToken(user) {
    const plainToken = generateSecureToken(32);
    const tokenHash = hashToken(plainToken);

    // Compute expiry date (default 7 days)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Create JWT wrapper for refresh token
    const refreshToken = jwt.sign(
      {
        sub: user.id,
        token: plainToken,
        type: 'refresh',
      },
      env.JWT_REFRESH_SECRET,
      {
        expiresIn: env.JWT_REFRESH_EXPIRES_IN || '7d',
        algorithm: 'HS256',
      }
    );

    // Store in DB for revocation & token rotation
    const refreshTokenRecord = await authRepository.createRefreshToken({
      userId: user.id,
      tokenHash,
      expiresAt,
    });

    return { refreshToken, plainToken, tokenHash, expiresAt, refreshTokenRecord };
  }

  // ─── 1. Client & Worker Registration ─────────────────────────────────────

  /**
   * Register a new user (Client / Worker / Admin).
   * @param {object} data
   * @param {import('express').Request} [req]
   */
  async register(data, req = null) {
    const { firstName, lastName, email, password, phone, role } = data;

    // Check if user already exists
    const existingUser = await authRepository.findByEmail(email);
    if (existingUser) {
      logAuthEvent({
        req,
        eventType: AUDIT_EVENTS.USER_REGISTRATION,
        email,
        role,
        status: 'FAILED',
        errorMessage: 'An account with this email address already exists',
      });
      throw new ConflictError('An account with this email address already exists');
    }

    // Hash password (12 bcrypt salt rounds)
    const passwordHash = await bcrypt.hash(password, 12);

    // Generate email verification token
    const plainVerificationToken = generateSecureToken(32);
    const emailVerificationToken = hashToken(plainVerificationToken);
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user in DB
    const user = await authRepository.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      phone: phone || null,
      passwordHash,
      role,
      isEmailVerified: false,
      emailVerificationToken,
      emailVerificationExpires,
    });

    logAuthEvent({
      req,
      eventType: AUDIT_EVENTS.USER_REGISTRATION,
      userId: user.id,
      email: user.email,
      role: user.role,
      status: 'SUCCESS',
    });

    // Send email verification asynchronously
    sendEmailVerification({
      to: user.email,
      firstName: user.firstName,
      token: plainVerificationToken,
      baseUrl: env.CLIENT_ORIGIN,
    })
      .then(() => {
        logAuthEvent({
          req,
          eventType: AUDIT_EVENTS.EMAIL_VERIFICATION_SENT,
          userId: user.id,
          email: user.email,
          role: user.role,
          status: 'SUCCESS',
        });
      })
      .catch((err) => {
        authLogger.warn('Failed to send verification email during registration', { error: err.message });
      });

    // Generate token pair & create session
    const accessToken = this.generateAccessToken(user);
    const { refreshToken, expiresAt, refreshTokenRecord } = await this.generateRefreshToken(user);

    // Create session record
    const reqInfo = parseRequestInfo(req);
    await sessionRepository.createSession({
      userId: user.id,
      refreshTokenId: refreshTokenRecord.id,
      deviceName: reqInfo.deviceName,
      browser: reqInfo.browser,
      operatingSystem: reqInfo.operatingSystem,
      ipAddress: reqInfo.ipAddress,
      expiresAt,
    });

    logAuthEvent({
      req,
      eventType: AUDIT_EVENTS.REFRESH_TOKEN_ISSUED,
      userId: user.id,
      email: user.email,
      role: user.role,
      status: 'SUCCESS',
    });

    return {
      user: this.sanitizeUser(user),
      accessToken,
      refreshToken,
    };
  }

  // ─── 2. Login ─────────────────────────────────────────────────────────────

  /**
   * Authenticate user credentials and issue tokens.
   * @param {object} credentials
   * @param {import('express').Request} [req]
   */
  async login({ email, password }, req = null) {
    const user = await authRepository.findByEmail(email);
    if (!user) {
      logAuthEvent({
        req,
        eventType: AUDIT_EVENTS.LOGIN_FAILED,
        email,
        status: 'FAILED',
        errorMessage: 'Invalid email or password',
      });
      throw new AuthenticationError('Invalid email or password');
    }

    if (!user.isActive) {
      logAuthEvent({
        req,
        eventType: AUDIT_EVENTS.LOGIN_FAILED,
        userId: user.id,
        email: user.email,
        role: user.role,
        status: 'FAILED',
        errorMessage: 'Account disabled',
      });
      throw new AuthenticationError('Your account has been disabled. Please contact support.');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      logAuthEvent({
        req,
        eventType: AUDIT_EVENTS.LOGIN_FAILED,
        userId: user.id,
        email: user.email,
        role: user.role,
        status: 'FAILED',
        errorMessage: 'Invalid email or password',
      });
      throw new AuthenticationError('Invalid email or password');
    }

    // Update last login
    await authRepository.updateLastLogin(user.id);

    // Issue tokens
    const accessToken = this.generateAccessToken(user);
    const { refreshToken, expiresAt, refreshTokenRecord } = await this.generateRefreshToken(user);

    // Create User Session
    const reqInfo = parseRequestInfo(req);
    await sessionRepository.createSession({
      userId: user.id,
      refreshTokenId: refreshTokenRecord.id,
      deviceName: reqInfo.deviceName,
      browser: reqInfo.browser,
      operatingSystem: reqInfo.operatingSystem,
      ipAddress: reqInfo.ipAddress,
      expiresAt,
    });

    logAuthEvent({
      req,
      eventType: AUDIT_EVENTS.LOGIN_SUCCESS,
      userId: user.id,
      email: user.email,
      role: user.role,
      status: 'SUCCESS',
    });

    logAuthEvent({
      req,
      eventType: AUDIT_EVENTS.REFRESH_TOKEN_ISSUED,
      userId: user.id,
      email: user.email,
      role: user.role,
      status: 'SUCCESS',
    });

    return {
      user: this.sanitizeUser(user),
      accessToken,
      refreshToken,
    };
  }

  // ─── 3. Refresh Token Session Exchange ────────────────────────────────────

  /**
   * Refresh expired Access Token using Refresh Token with Token Rotation.
   * @param {string} rawRefreshToken
   * @param {import('express').Request} [req]
   */
  async refreshSession(rawRefreshToken, req = null) {
    if (!rawRefreshToken) {
      logAuthEvent({
        req,
        eventType: AUDIT_EVENTS.UNAUTHORIZED_ACCESS,
        status: 'FAILED',
        errorMessage: 'Refresh token required',
      });
      throw new AuthenticationError('Refresh token required');
    }

    let decoded;
    try {
      decoded = jwt.verify(rawRefreshToken, env.JWT_REFRESH_SECRET);
    } catch {
      logAuthEvent({
        req,
        eventType: AUDIT_EVENTS.UNAUTHORIZED_ACCESS,
        status: 'FAILED',
        errorMessage: 'Invalid or expired refresh token',
      });
      throw new AuthenticationError('Invalid or expired refresh token');
    }

    if (decoded.type !== 'refresh' || !decoded.token) {
      logAuthEvent({
        req,
        eventType: AUDIT_EVENTS.UNAUTHORIZED_ACCESS,
        status: 'FAILED',
        errorMessage: 'Invalid refresh token payload',
      });
      throw new AuthenticationError('Invalid refresh token payload');
    }

    const tokenHash = hashToken(decoded.token);
    const storedToken = await authRepository.findRefreshToken(tokenHash);

    if (!storedToken) {
      logAuthEvent({
        req,
        eventType: AUDIT_EVENTS.UNAUTHORIZED_ACCESS,
        status: 'FAILED',
        errorMessage: 'Refresh token not found',
      });
      throw new AuthenticationError('Refresh token not found or invalid');
    }

    // Security: Token Reuse Detection / Revocation Check
    if (storedToken.isRevoked) {
      // Revoke all tokens & sessions for user immediately
      await authRepository.revokeAllUserRefreshTokens(storedToken.userId);
      await sessionRepository.revokeAllUserSessions(storedToken.userId);

      logAuthEvent({
        req,
        eventType: AUDIT_EVENTS.UNAUTHORIZED_ACCESS,
        userId: storedToken.userId,
        email: storedToken.user?.email,
        role: storedToken.user?.role,
        status: 'FAILED',
        errorMessage: 'SECURITY ALERT: Refresh token reuse detected! All sessions revoked.',
      });

      logAuthEvent({
        req,
        eventType: AUDIT_EVENTS.LOGOUT_ALL_DEVICES,
        userId: storedToken.userId,
        email: storedToken.user?.email,
        role: storedToken.user?.role,
        status: 'SUCCESS',
      });

      throw new AuthenticationError('Security alert: Invalid session reuse detected. Please log in again.');
    }

    if (new Date() > storedToken.expiresAt) {
      if (storedToken.session) {
        await sessionRepository.markSessionExpired(storedToken.session.id);
      }
      logAuthEvent({
        req,
        eventType: AUDIT_EVENTS.UNAUTHORIZED_ACCESS,
        userId: storedToken.userId,
        email: storedToken.user?.email,
        role: storedToken.user?.role,
        status: 'FAILED',
        errorMessage: 'Refresh token expired',
      });
      throw new AuthenticationError('Refresh token expired. Please log in again.');
    }

    const user = storedToken.user;
    if (!user || !user.isActive) {
      logAuthEvent({
        req,
        eventType: AUDIT_EVENTS.UNAUTHORIZED_ACCESS,
        userId: storedToken.userId,
        status: 'FAILED',
        errorMessage: 'User account inactive or not found',
      });
      throw new AuthenticationError('User account inactive or not found');
    }

    // Issue new refresh token & access token (Token Rotation)
    const { refreshToken: newRefreshToken, tokenHash: newTokenHash, expiresAt: newExpiresAt, refreshTokenRecord: newRefreshTokenRecord } = await this.generateRefreshToken(user);

    // Mark current refresh token as revoked and linked to the replacement
    await authRepository.revokeRefreshToken(storedToken.id, newTokenHash);

    // Update Session with rotated refresh token reference
    const reqInfo = parseRequestInfo(req);
    const session = await sessionRepository.findByRefreshTokenId(storedToken.id);
    if (session) {
      await sessionRepository.updateSessionOnRotation(storedToken.id, newRefreshTokenRecord.id, newExpiresAt);
    } else {
      await sessionRepository.createSession({
        userId: user.id,
        refreshTokenId: newRefreshTokenRecord.id,
        deviceName: reqInfo.deviceName,
        browser: reqInfo.browser,
        operatingSystem: reqInfo.operatingSystem,
        ipAddress: reqInfo.ipAddress,
        expiresAt: newExpiresAt,
      });
    }

    // Issue new access token
    const accessToken = this.generateAccessToken(user);

    logAuthEvent({
      req,
      eventType: AUDIT_EVENTS.REFRESH_TOKEN_ROTATED,
      userId: user.id,
      email: user.email,
      role: user.role,
      status: 'SUCCESS',
    });

    return {
      user: this.sanitizeUser(user),
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  // ─── 4. Logout (Current Device) ───────────────────────────────────────────

  /**
   * Revoke current refresh token & session on logout.
   * @param {string} rawRefreshToken
   * @param {import('express').Request} [req]
   */
  async logout(rawRefreshToken, req = null) {
    if (!rawRefreshToken) {return;}

    try {
      const decoded = jwt.verify(rawRefreshToken, env.JWT_REFRESH_SECRET);
      if (decoded.token) {
        const tokenHash = hashToken(decoded.token);
        const storedToken = await authRepository.findRefreshToken(tokenHash);
        if (storedToken && !storedToken.isRevoked) {
          await authRepository.revokeRefreshToken(storedToken.id);
          await sessionRepository.revokeSessionByRefreshTokenId(storedToken.id);

          logAuthEvent({
            req,
            eventType: AUDIT_EVENTS.LOGOUT,
            userId: storedToken.userId,
            email: storedToken.user?.email,
            role: storedToken.user?.role,
            status: 'SUCCESS',
          });
        }
      }
    } catch {
      // Fail silently on invalid logout token
    }
  }

  // ─── 5. Logout All Devices ────────────────────────────────────────────────

  /**
   * Revoke all active refresh tokens & sessions for a user across all devices.
   * @param {string} userId
   * @param {import('express').Request} [req]
   */
  async logoutAll(userId, req = null) {
    await authRepository.revokeAllUserRefreshTokens(userId);
    await sessionRepository.revokeAllUserSessions(userId);

    logAuthEvent({
      req,
      eventType: AUDIT_EVENTS.LOGOUT_ALL_DEVICES,
      userId,
      status: 'SUCCESS',
    });
  }

  // ─── 6. Email Verification ────────────────────────────────────────────────

  /**
   * Verify email using plain token sent in email.
   * @param {string} plainToken
   * @param {import('express').Request} [req]
   */
  async verifyEmail(plainToken, req = null) {
    const tokenHash = hashToken(plainToken);
    const user = await authRepository.findByVerificationToken(tokenHash);

    if (!user) {
      logAuthEvent({
        req,
        eventType: AUDIT_EVENTS.UNAUTHORIZED_ACCESS,
        status: 'FAILED',
        errorMessage: 'Invalid or expired email verification token',
      });
      throw new ValidationError('Invalid or expired email verification token');
    }

    if (user.isEmailVerified) {
      return { message: 'Email address is already verified', user: this.sanitizeUser(user) };
    }

    const updatedUser = await authRepository.update(user.id, {
      isEmailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpires: null,
    });

    logAuthEvent({
      req,
      eventType: AUDIT_EVENTS.EMAIL_VERIFIED_SUCCESS,
      userId: user.id,
      email: user.email,
      role: user.role,
      status: 'SUCCESS',
    });

    return { message: 'Email address verified successfully', user: this.sanitizeUser(updatedUser) };
  }

  // ─── 7. Forgot Password ───────────────────────────────────────────────────

  /**
   * Initiate forgot password flow and email reset link.
   * @param {string} email
   * @param {import('express').Request} [req]
   */
  async forgotPassword(email, req = null) {
    const user = await authRepository.findByEmail(email);

    logAuthEvent({
      req,
      eventType: AUDIT_EVENTS.PASSWORD_RESET_REQUESTED,
      email,
      userId: user ? user.id : null,
      status: 'SUCCESS',
    });

    // Prevent account enumeration: return success even if user not found
    if (!user) {
      return { message: 'If an account exists with this email, a password reset link has been sent.' };
    }

    const plainResetToken = generateSecureToken(32);
    const passwordResetToken = hashToken(plainResetToken);
    const passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await authRepository.update(user.id, {
      passwordResetToken,
      passwordResetExpires,
    });

    sendPasswordReset({
      to: user.email,
      firstName: user.firstName,
      token: plainResetToken,
      baseUrl: env.CLIENT_ORIGIN,
    }).catch((err) => {
      authLogger.warn('Failed to send password reset email', { error: err.message });
    });

    return { message: 'If an account exists with this email, a password reset link has been sent.' };
  }

  // ─── 8. Reset Password ────────────────────────────────────────────────────

  /**
   * Reset user password using token from reset email.
   * @param {object} params
   * @param {string} params.token
   * @param {string} params.password
   * @param {import('express').Request} [req]
   */
  async resetPassword({ token, password }, req = null) {
    const tokenHash = hashToken(token);
    const user = await authRepository.findByResetToken(tokenHash);

    if (!user) {
      logAuthEvent({
        req,
        eventType: AUDIT_EVENTS.UNAUTHORIZED_ACCESS,
        status: 'FAILED',
        errorMessage: 'Invalid or expired password reset token',
      });
      throw new ValidationError('Invalid or expired password reset token');
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await authRepository.update(user.id, {
      passwordHash,
      passwordResetToken: null,
      passwordResetExpires: null,
    });

    // Revoke all tokens & sessions for security
    await authRepository.revokeAllUserRefreshTokens(user.id);
    await sessionRepository.revokeAllUserSessions(user.id);

    logAuthEvent({
      req,
      eventType: AUDIT_EVENTS.PASSWORD_RESET_SUCCESS,
      userId: user.id,
      email: user.email,
      role: user.role,
      status: 'SUCCESS',
    });

    return { message: 'Password reset successful. Please log in with your new password.' };
  }

  // ─── 9. Change Password (Authenticated) ───────────────────────────────────

  /**
   * Change password for logged in user.
   * @param {string} userId
   * @param {object} params
   * @param {string} params.currentPassword
   * @param {string} params.newPassword
   * @param {import('express').Request} [req]
   */
  async changePassword(userId, { currentPassword, newPassword }, req = null) {
    const user = await authRepository.findById(userId, {}, true);

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      logAuthEvent({
        req,
        eventType: AUDIT_EVENTS.PASSWORD_CHANGED,
        userId: user.id,
        email: user.email,
        role: user.role,
        status: 'FAILED',
        errorMessage: 'Current password is incorrect',
      });
      throw new ValidationError('Current password is incorrect');
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await authRepository.update(user.id, { passwordHash });
    await authRepository.revokeAllUserRefreshTokens(user.id);
    await sessionRepository.revokeAllUserSessions(user.id);

    logAuthEvent({
      req,
      eventType: AUDIT_EVENTS.PASSWORD_CHANGED,
      userId: user.id,
      email: user.email,
      role: user.role,
      status: 'SUCCESS',
    });

    return { message: 'Password updated successfully. Please log in again.' };
  }

  // ─── 10. Get Current User ─────────────────────────────────────────────────

  /**
   * Retrieve current authenticated user profile.
   * @param {string} userId
   */
  async getCurrentUser(userId) {
    const user = await authRepository.findById(userId, {}, true);
    return this.sanitizeUser(user);
  }

  // ─── 11. Update Profile ───────────────────────────────────────────────────

  /**
   * Update profile fields (firstName, lastName, phone, avatar).
   * @param {string} userId
   * @param {object} updateData
   */
  async updateProfile(userId, updateData) {
    const user = await authRepository.findById(userId, {}, true);
    const updatedUser = await authRepository.update(user.id, updateData);
    return this.sanitizeUser(updatedUser);
  }
}

module.exports = new AuthService();
