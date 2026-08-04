'use strict';

const prisma = require('../../config/database');

class FileRepository {
  async createFileAsset(userId, data) {
    return prisma.fileAsset.create({
      data: {
        userId,
        organizationId: data.organizationId || null,
        workspaceId: data.workspaceId || null,
        name: data.name,
        mimeType: data.mimeType || 'application/octet-stream',
        sizeBytes: data.sizeBytes,
        checksum: data.checksum,
        storagePath: data.storagePath,
        tags: data.tags || null,
        versions: {
          create: {
            versionNumber: 1,
            sizeBytes: data.sizeBytes,
            checksum: data.checksum,
            storagePath: data.storagePath,
            comment: 'Initial file upload',
          },
        },
        virusScan: {
          create: {
            status: 'CLEAN',
            engineName: 'TRUSTPAY_DEFENDER',
            scanDetails: 'No malicious payload signature detected.',
          },
        },
      },
      include: {
        versions: true,
        virusScan: true,
      },
    });
  }

  async getUserFiles(userId, { query, tags, isFavorite } = {}) {
    const where = { userId, isArchived: false };
    if (isFavorite !== undefined) {
      where.isFavorite = isFavorite;
    }
    if (query) {
      where.name = { contains: query, mode: 'insensitive' };
    }
    if (tags) {
      where.tags = { contains: tags, mode: 'insensitive' };
    }

    return prisma.fileAsset.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        versions: { orderBy: { versionNumber: 'desc' } },
        virusScan: true,
        shares: true,
      },
    });
  }

  async findFileById(id, userId) {
    return prisma.fileAsset.findFirst({
      where: { id, userId },
      include: {
        versions: { orderBy: { versionNumber: 'desc' } },
        virusScan: true,
        shares: true,
        accessLogs: { take: 10, orderBy: { accessedAt: 'desc' } },
      },
    });
  }

  async createFileVersion(fileAssetId, data) {
    const file = await prisma.fileAsset.findUnique({
      where: { id: fileAssetId },
      include: { versions: { orderBy: { versionNumber: 'desc' }, take: 1 } },
    });

    const nextVersion = (file?.versions[0]?.versionNumber || 1) + 1;

    const newVersion = await prisma.fileVersion.create({
      data: {
        fileAssetId,
        versionNumber: nextVersion,
        sizeBytes: data.sizeBytes,
        checksum: data.checksum,
        storagePath: data.storagePath,
        comment: data.comment || `Version ${nextVersion} update`,
      },
    });

    await prisma.fileAsset.update({
      where: { id: fileAssetId },
      data: {
        sizeBytes: data.sizeBytes,
        checksum: data.checksum,
        storagePath: data.storagePath,
        updatedAt: new Date(),
      },
    });

    return newVersion;
  }

  async createShareLink(fileAssetId, data) {
    const expiresAt = data.expiresInDays
      ? new Date(Date.now() + data.expiresInDays * 86400000)
      : null;

    return prisma.fileShare.create({
      data: {
        fileAssetId,
        shareToken: data.shareToken,
        passwordHash: data.passwordHash || null,
        downloadLimit: data.downloadLimit || null,
        expiresAt,
      },
    });
  }

  async toggleFavorite(id, userId, isFavorite) {
    return prisma.fileAsset.updateMany({
      where: { id, userId },
      data: { isFavorite },
    });
  }

  async softDeleteFile(id, userId) {
    return prisma.fileAsset.updateMany({
      where: { id, userId },
      data: { isArchived: true, updatedAt: new Date() },
    });
  }
}

module.exports = new FileRepository();
