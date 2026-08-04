'use strict';

const crypto = require('crypto');
const prisma = require('../../config/database');

class ApiKeyService {
  /**
   * Generate Public API Key & Save Hash
   */
  async generateApiKey(userId, { name, scopes = 'FULL_ACCESS', ipRestrictions = null, expiresInDays = 90 }) {
    const rawKey = `tp_live_${crypto.randomBytes(24).toString('hex')}`;
    const keyPrefix = rawKey.substring(0, 12);
    const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    const apiKeyRecord = await prisma.apiKey.create({
      data: {
        userId,
        name,
        keyPrefix,
        keyHash,
        scopes,
        ipRestrictions: ipRestrictions || null,
        expiresAt,
      },
    });

    // Return plain rawKey ONLY ONCE on creation
    return {
      apiKey: apiKeyRecord,
      rawKey,
    };
  }

  async getUserApiKeys(userId) {
    return prisma.apiKey.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, keyPrefix: true, scopes: true, ipRestrictions: true, lastUsedAt: true, expiresAt: true, createdAt: true },
    });
  }

  async revokeApiKey(id, userId) {
    return prisma.apiKey.deleteMany({
      where: { id, userId },
    });
  }

  /**
   * Verify API Key Hash
   */
  async verifyApiKey(rawKey) {
    const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');

    const apiKeyRecord = await prisma.apiKey.findUnique({
      where: { keyHash },
      include: { user: { select: { id: true, email: true, role: true } } },
    });

    if (!apiKeyRecord) {
      return null;
    }
    if (apiKeyRecord.expiresAt && new Date() > new Date(apiKeyRecord.expiresAt)) {
      return null;
    }

    // Update lastUsedAt asynchronously
    prisma.apiKey.update({
      where: { id: apiKeyRecord.id },
      data: { lastUsedAt: new Date() },
    }).catch(() => {});

    return apiKeyRecord;
  }
}

module.exports = new ApiKeyService();
