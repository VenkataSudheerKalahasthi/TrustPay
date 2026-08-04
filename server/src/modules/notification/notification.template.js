'use strict';

/**
 * Reusable HTML & Plain Text Notification Email Templates
 */
const NOTIFICATION_EMAIL_TEMPLATES = {
  PROJECT_CREATED: (params) => ({
    subject: `New Project Created: ${params.title}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
        <h2 style="color: #0ea5e9;">🚀 Project Initialized: ${params.title}</h2>
        <p>A new project <strong>${params.projectNumber}</strong> has been created on TrustPay.</p>
        <p><strong>Category:</strong> ${params.category || 'General'}</p>
        <a href="${params.linkUrl}" style="display:inline-block;padding:10px 20px;background:#0ea5e9;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;">
          View Project Workspace
        </a>
      </div>
    `,
  }),

  CONTRACT_SIGNED: (params) => ({
    subject: `Contract Signed: #${params.contractNumber}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
        <h2 style="color: #10b981;">🛡️ Digital Contract Fully Signed</h2>
        <p>Digital Contract <strong>#${params.contractNumber}</strong> has been signed by all parties with SHA-256 cryptographic verification.</p>
        <a href="${params.linkUrl}" style="display:inline-block;padding:10px 20px;background:#10b981;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;">
          View Contract & Signatures
        </a>
      </div>
    `,
  }),

  ESCROW_FUNDED: (params) => ({
    subject: `Escrow Funded: ₹${params.amount.toLocaleString()}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
        <h2 style="color: #6366f1;">💳 Escrow Wallet Funded</h2>
        <p>An amount of <strong>₹${params.amount.toLocaleString()}</strong> has been securely deposited into escrow wallet.</p>
        <a href="${params.linkUrl}" style="display:inline-block;padding:10px 20px;background:#6366f1;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;">
          View Wallet Balance
        </a>
      </div>
    `,
  }),

  MESSAGE_RECEIVED: (params) => ({
    subject: `New Message from ${params.senderName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
        <h2 style="color: #0ea5e9;">💬 New Chat Message</h2>
        <p><strong>${params.senderName}:</strong> "${params.content}"</p>
        <a href="${params.linkUrl}" style="display:inline-block;padding:10px 20px;background:#0ea5e9;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;">
          Open Chat
        </a>
      </div>
    `,
  }),

  GENERIC: (params) => ({
    subject: params.title || 'TrustPay Notification',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
        <h2 style="color: #0ea5e9;">${params.title}</h2>
        <p>${params.message}</p>
        ${
          params.linkUrl
            ? `<a href="${params.linkUrl}" style="display:inline-block;padding:10px 20px;background:#0ea5e9;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;">View Details</a>`
            : ''
        }
      </div>
    `,
  }),
};

module.exports = { NOTIFICATION_EMAIL_TEMPLATES };
