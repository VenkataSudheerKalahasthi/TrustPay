'use strict';

const crypto = require('crypto');
const fileRepository = require('./file.repository');
const storageService = require('./storage.service');

class FileService {
  async createFileAsset(userId, data) {
    return fileRepository.createFileAsset(userId, data);
  }

  async getUserFiles(userId, filters) {
    const files = await fileRepository.getUserFiles(userId, filters);

    // Attach Supabase signed download URLs
    return Promise.all(
      files.map(async (f) => {
        const signedUrl = await storageService.generateSignedUrl(f.storagePath);
        return { ...f, signedUrl };
      })
    );
  }

  async getFileDetails(id, userId) {
    const file = await fileRepository.findFileById(id, userId);
    if (!file) {
      return null;
    }

    const signedUrl = await storageService.generateSignedUrl(file.storagePath);
    return { ...file, signedUrl };
  }

  async addFileVersion(fileAssetId, data) {
    return fileRepository.createFileVersion(fileAssetId, data);
  }

  async createShareLink(fileAssetId, data) {
    const shareToken = `share_${crypto.randomBytes(16).toString('hex')}`;
    let passwordHash = null;
    if (data.password) {
      passwordHash = crypto.createHash('sha256').update(data.password).digest('hex');
    }

    const share = await fileRepository.createShareLink(fileAssetId, {
      ...data,
      shareToken,
      passwordHash,
    });

    const shareUrl = `https://app.trustpay.com/shared/files/${shareToken}`;
    return { share, shareUrl };
  }

  async toggleFavorite(id, userId, isFavorite) {
    return fileRepository.toggleFavorite(id, userId, isFavorite);
  }

  async softDeleteFile(id, userId) {
    return fileRepository.softDeleteFile(id, userId);
  }
}

module.exports = new FileService();
