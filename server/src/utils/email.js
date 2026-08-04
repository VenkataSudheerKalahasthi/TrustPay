'use strict';

const nodemailer = require('nodemailer');
const { env } = require('../config/env');
const { logger } = require('./logger');

/**
 * TrustPay – Email Service
 *
 * Centralized email sending via Nodemailer (SMTP).
 * Supports development preview (Ethereal) and production SMTP.
 *
 * In development: logs email content to console if SMTP is not configured.
 * In production: sends via configured SMTP provider (Gmail, SendGrid, etc.).
 */

/** @type {import('nodemailer').Transporter | null} */
let transporter = null;

/**
 * Initialize the Nodemailer transporter.
 * Called lazily on first use — not at module load — so SMTP config is optional
 * in Phase 1 and only required when auth is activated.
 *
 * @returns {Promise<import('nodemailer').Transporter>}
 */
async function getTransporter() {
  if (transporter) {return transporter;}

  if (env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS) {
    // Production / staging SMTP
    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT || 587,
      secure: env.SMTP_PORT === 465,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
    logger.info('Email transporter initialized (SMTP)', { host: env.SMTP_HOST });
  } else {
    // Development: use Ethereal fake SMTP for preview
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    logger.warn('Email transporter using Ethereal (dev preview). Set SMTP_* env vars for real email.', {
      previewInbox: `https://ethereal.email/messages`,
    });
  }

  return transporter;
}

/**
 * @typedef {object} SendEmailOptions
 * @property {string}   to        Recipient email address
 * @property {string}   subject   Email subject line
 * @property {string}   html      HTML body
 * @property {string}   [text]    Plain-text fallback
 * @property {string}   [from]    Sender (defaults to EMAIL_FROM env var)
 */

/**
 * Send a transactional email.
 *
 * @param {SendEmailOptions} options
 * @returns {Promise<{ messageId: string, previewUrl?: string }>}
 *
 * @example
 * await sendEmail({
 *   to: user.email,
 *   subject: 'Verify your TrustPay account',
 *   html: '<p>Click <a href="...">here</a> to verify</p>',
 * });
 */
async function sendEmail({ to, subject, html, text, from }) {
  const t = await getTransporter();

  const info = await t.sendMail({
    from: from || env.EMAIL_FROM || `"TrustPay" <noreply@trustpay.app>`,
    to,
    subject,
    html,
    text: text || stripHtml(html),
  });

  const previewUrl = nodemailer.getTestMessageUrl(info);

  logger.info('Email sent', {
    to,
    subject,
    messageId: info.messageId,
    ...(previewUrl && { previewUrl }),
  });

  return { messageId: info.messageId, previewUrl: previewUrl || undefined };
}

// ─── Email Templates ──────────────────────────────────────────────────────────

/**
 * Send an email verification email.
 *
 * @param {object} params
 * @param {string} params.to        Recipient email
 * @param {string} params.firstName User's first name
 * @param {string} params.token     Email verification token (plain, not hash)
 * @param {string} params.baseUrl   Frontend base URL (e.g., http://localhost:5173)
 */
async function sendEmailVerification({ to, firstName, token, baseUrl }) {
  const verifyUrl = `${baseUrl}/verify-email?token=${token}`;
  return sendEmail({
    to,
    subject: 'Verify your TrustPay account',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6366f1;">Welcome to TrustPay, ${firstName}! 🎉</h2>
        <p>Thanks for signing up. Please verify your email address to activate your account.</p>
        <a href="${verifyUrl}"
           style="display:inline-block;padding:12px 24px;background:#6366f1;color:#fff;
                  border-radius:8px;text-decoration:none;font-weight:600;">
          Verify Email Address
        </a>
        <p style="color:#888;margin-top:24px;font-size:13px;">
          This link expires in 24 hours. If you didn't create an account, you can safely ignore this email.
        </p>
        <p style="color:#888;font-size:12px;">
          Or copy this link: <a href="${verifyUrl}">${verifyUrl}</a>
        </p>
      </div>
    `,
  });
}

/**
 * Send a password reset email.
 *
 * @param {object} params
 * @param {string} params.to        Recipient email
 * @param {string} params.firstName User's first name
 * @param {string} params.token     Password reset token (plain, not hash)
 * @param {string} params.baseUrl   Frontend base URL
 */
async function sendPasswordReset({ to, firstName, token, baseUrl }) {
  const resetUrl = `${baseUrl}/reset-password?token=${token}`;
  return sendEmail({
    to,
    subject: 'Reset your TrustPay password',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6366f1;">Password Reset Request</h2>
        <p>Hi ${firstName},</p>
        <p>We received a request to reset your TrustPay password. Click the button below to set a new password.</p>
        <a href="${resetUrl}"
           style="display:inline-block;padding:12px 24px;background:#6366f1;color:#fff;
                  border-radius:8px;text-decoration:none;font-weight:600;">
          Reset Password
        </a>
        <p style="color:#888;margin-top:24px;font-size:13px;">
          This link expires in 1 hour. If you didn't request a password reset, please ignore this email — 
          your password will remain unchanged.
        </p>
        <p style="color:#888;font-size:12px;">
          Or copy this link: <a href="${resetUrl}">${resetUrl}</a>
        </p>
      </div>
    `,
  });
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Very naive HTML stripper for plain-text fallback.
 * @param {string} html
 * @returns {string}
 */
function stripHtml(html) {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

module.exports = {
  sendEmail,
  sendEmailVerification,
  sendPasswordReset,
};
