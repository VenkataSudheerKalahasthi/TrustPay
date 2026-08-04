'use strict';

const { STORAGE_PATHS } = require('../../../shared/src/constants');
const { getSupabaseClient } = require('../config/supabase');
const { logger } = require('./logger');

/**
 * Upload file buffer to Supabase Storage with strict bucket pathing.
 *
 * @param {object} params
 * @param {string} params.bucket - Storage bucket / path category (e.g. STORAGE_PATHS.PROFILE_PHOTOS)
 * @param {string} params.userId - User CUID
 * @param {string} params.originalName - Original filename
 * @param {Buffer} params.buffer - File buffer
 * @param {string} params.mimeType - File MIME type
 * @returns {Promise<{ url: string, path: string, sizeBytes: number }>}
 */
async function uploadToStorage({ bucket, userId, originalName, buffer, mimeType }) {
  const supabase = getSupabaseClient();
  const ext = originalName.split('.').pop().toLowerCase();
  const uniqueName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
  const filePath = `${userId}/${uniqueName}`;

  const targetBucket = bucket || STORAGE_PATHS.PROFILE_PHOTOS;

  if (!supabase) {
    logger.warn(`Supabase storage client not initialized. Falling back to mock URL for ${filePath}`);
    return {
      url: `https://storage.trustpay.dev/${targetBucket}/${filePath}`,
      path: filePath,
      sizeBytes: buffer ? buffer.length : 0,
    };
  }

  const { data, error } = await supabase.storage
    .from(targetBucket)
    .upload(filePath, buffer, {
      contentType: mimeType,
      upsert: true,
    });

  if (error) {
    logger.error(`Supabase Storage upload error: ${error.message}`);
    throw new Error(`Storage Upload Failed: ${error.message}`);
  }

  const { data: publicUrlData } = supabase.storage.from(targetBucket).getPublicUrl(data.path);

  return {
    url: publicUrlData.publicUrl,
    path: data.path,
    sizeBytes: buffer.length,
  };
}

module.exports = {
  uploadToStorage,
  STORAGE_PATHS,
};
