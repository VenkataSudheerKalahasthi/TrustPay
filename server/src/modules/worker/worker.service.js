'use strict';

const workerRepository = require('./worker.repository');
const { generateSlug } = require('../../utils/slug');
const { generateWorkerMetadata } = require('../../utils/seo');
const { calculateDistanceKm } = require('../../utils/geo');
const { uploadToStorage, STORAGE_PATHS } = require('../../utils/storage');

class WorkerService {
  calculateProfileCompletion(profile) {
    let score = 0;
    if (profile.title && profile.bio) { score += 20; }
    if (profile.hourlyRate !== null && profile.hourlyRate !== undefined && profile.hourlyRate > 0) { score += 15; }
    if (profile.city || profile.country) { score += 15; }
    if (profile.resumeUrl) { score += 15; }
    if (profile.skills && profile.skills.length > 0) { score += 15; }
    if (profile.portfolioProjects && profile.portfolioProjects.length > 0) { score += 20; }
    return Math.min(100, score);
  }

  async getWorkerByUserId(userId) {
    let profile = await workerRepository.findByUserId(userId);
    if (!profile) {
      const slug = generateSlug(`worker-${userId.substring(0, 6)}`);
      profile = await workerRepository.createWorkerProfile({
        userId,
        slug,
      });
      profile = await workerRepository.findByUserId(userId);
    }
    return profile;
  }

  async getPublicProfile(slugOrId) {
    const profile = await workerRepository.findBySlugOrId(slugOrId);
    if (!profile) {
      const err = new Error('Worker profile not found');
      err.statusCode = 404;
      throw err;
    }

    const metadata = generateWorkerMetadata(profile);
    return { profile, metadata };
  }

  async updateWorkerProfile(userId, updateData) {
    const profile = await this.getWorkerByUserId(userId);

    if (updateData.title && (!profile.slug || profile.slug.startsWith('worker-'))) {
      const name = `${profile.user?.firstName || ''} ${profile.user?.lastName || ''}`;
      updateData.slug = generateSlug(name, updateData.title);
    }

    await workerRepository.updateWorkerProfile(profile.id, updateData);
    const refreshed = await workerRepository.findByUserId(userId);
    const completion = this.calculateProfileCompletion(refreshed);

    await workerRepository.updateWorkerProfile(profile.id, { profileCompletion: completion });
    return workerRepository.findByUserId(userId);
  }

  async searchWorkers(query) {
    const result = await workerRepository.searchWorkers(query);

    if (query.lat !== null && query.lat !== undefined && query.lng !== null && query.lng !== undefined && result.workers.length > 0) {
      result.workers = result.workers.map((w) => {
        const distance = calculateDistanceKm(query.lat, query.lng, w.latitude, w.longitude);
        return { ...w, distanceKm: distance };
      });

      if (query.sort === 'distance') {
        result.workers.sort((a, b) => (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999));
      }
    }

    return result;
  }

  async addPortfolioProject(userId, projectData) {
    const profile = await this.getWorkerByUserId(userId);
    const project = await workerRepository.createPortfolioProject(
      profile.id,
      projectData,
      projectData.technologies || []
    );
    return project;
  }

  async deletePortfolioProject(userId, projectId) {
    const profile = await this.getWorkerByUserId(userId);
    return workerRepository.deletePortfolioProject(projectId, profile.id);
  }

  async uploadFile(userId, file, category = STORAGE_PATHS.PROFILE_PHOTOS) {
    return uploadToStorage({
      bucket: category,
      userId,
      originalName: file.originalname,
      buffer: file.buffer,
      mimeType: file.mimetype,
    });
  }

  async submitVerificationDocument(userId, docData) {
    const profile = await this.getWorkerByUserId(userId);
    return workerRepository.addVerificationDocument(profile.id, docData);
  }
}

module.exports = new WorkerService();
