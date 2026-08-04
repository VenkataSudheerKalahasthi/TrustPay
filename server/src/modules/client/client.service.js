'use strict';

const clientRepository = require('./client.repository');

class ClientService {
  calculateProfileCompletion(profile) {
    let score = 0;
    if (profile.companyName) { score += 30; }
    if (profile.companyWebsite || profile.companyLogo) { score += 20; }
    if (profile.businessDescription) { score += 30; }
    if (profile.city || profile.country) { score += 20; }
    return Math.min(100, score);
  }

  async getClientByUserId(userId) {
    let profile = await clientRepository.findByUserId(userId);
    if (!profile) {
      profile = await clientRepository.createClientProfile({ userId });
      profile = await clientRepository.findByUserId(userId);
    }
    return profile;
  }

  async updateClientProfile(userId, updateData) {
    const profile = await this.getClientByUserId(userId);
    await clientRepository.updateClientProfile(profile.id, updateData);
    const refreshed = await clientRepository.findByUserId(userId);
    const completion = this.calculateProfileCompletion(refreshed);

    await clientRepository.updateClientProfile(profile.id, { profileCompletion: completion });
    return clientRepository.findByUserId(userId);
  }

  async addFavoriteWorker(userId, workerProfileId) {
    const profile = await this.getClientByUserId(userId);
    return clientRepository.addFavoriteWorker(profile.id, workerProfileId);
  }

  async removeFavoriteWorker(userId, workerProfileId) {
    const profile = await this.getClientByUserId(userId);
    return clientRepository.removeFavoriteWorker(profile.id, workerProfileId);
  }

  async getFavoriteWorkers(userId) {
    const profile = await this.getClientByUserId(userId);
    return clientRepository.getFavoriteWorkers(profile.id);
  }
}

module.exports = new ClientService();
