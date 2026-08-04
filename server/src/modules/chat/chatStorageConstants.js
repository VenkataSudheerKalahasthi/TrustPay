'use strict';

/**
 * Centralized Storage Path Constants for Communication & Collaboration Module
 */
const CHAT_STORAGE_PATHS = Object.freeze({
  ATTACHMENTS: 'communication/attachments/',
  MEDIA: 'communication/media/',
  VOICE: 'communication/voice/',
});

/**
 * Returns organized bucket path for a given file category/type.
 * @param {string} fileType 
 * @param {string} fileName 
 * @returns {string}
 */
function getCommunicationStoragePath(fileType = 'attachment', fileName = '') {
  const sanitizeName = fileName ? fileName.replace(/[^a-zA-Z0-9.-]/g, '_') : `file_${Date.now()}`;
  const timestamp = Date.now();

  if (fileType.startsWith('image/') || fileType.startsWith('video/')) {
    return `${CHAT_STORAGE_PATHS.MEDIA}${timestamp}_${sanitizeName}`;
  }
  if (fileType.startsWith('audio/')) {
    return `${CHAT_STORAGE_PATHS.VOICE}${timestamp}_${sanitizeName}`;
  }
  return `${CHAT_STORAGE_PATHS.ATTACHMENTS}${timestamp}_${sanitizeName}`;
}

module.exports = {
  CHAT_STORAGE_PATHS,
  getCommunicationStoragePath,
};
