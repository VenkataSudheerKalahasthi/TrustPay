'use strict';

const { prisma } = require('../../config/database');

const inMemoryClients = new Map();
const inMemoryFavorites = new Map();

class ClientRepository {
  async findByUserId(userId) {
    try {
      return await prisma.clientProfile.findUnique({
        where: { userId },
        include: {
          user: { select: { id: true, firstName: true, lastName: true, email: true, avatar: true } },
          favoriteWorkers: {
            include: {
              workerProfile: {
                include: {
                  user: { select: { firstName: true, lastName: true, avatar: true } },
                  skills: { include: { skill: true } },
                },
              },
            },
          },
        },
      });
    } catch {
      return inMemoryClients.get(userId) || null;
    }
  }

  async createClientProfile(data) {
    try {
      return await prisma.clientProfile.create({ data });
    } catch {
      const mockProfile = {
        id: `cli_${Date.now()}`,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
        favoriteWorkers: [],
        user: { id: data.userId, firstName: 'Sarah', lastName: 'Hiring', avatar: null },
      };
      inMemoryClients.set(data.userId, mockProfile);
      return mockProfile;
    }
  }

  async updateClientProfile(id, updateData) {
    try {
      return await prisma.clientProfile.update({ where: { id }, data: updateData });
    } catch {
      for (const [uid, c] of inMemoryClients.entries()) {
        if (c.id === id || c.userId === uid) {
          const updated = { ...c, ...updateData, updatedAt: new Date() };
          inMemoryClients.set(uid, updated);
          return updated;
        }
      }
      return updateData;
    }
  }

  async addFavoriteWorker(clientProfileId, workerProfileId) {
    try {
      return await prisma.favoriteWorker.create({
        data: { clientProfileId, workerProfileId },
      });
    } catch {
      const fav = { id: `fav_${Date.now()}`, clientProfileId, workerProfileId, createdAt: new Date() };
      const current = inMemoryFavorites.get(clientProfileId) || [];
      current.push(fav);
      inMemoryFavorites.set(clientProfileId, current);
      return fav;
    }
  }

  async removeFavoriteWorker(clientProfileId, workerProfileId) {
    try {
      return await prisma.favoriteWorker.deleteMany({
        where: { clientProfileId, workerProfileId },
      });
    } catch {
      const current = inMemoryFavorites.get(clientProfileId) || [];
      const updated = current.filter((f) => f.workerProfileId !== workerProfileId);
      inMemoryFavorites.set(clientProfileId, updated);
      return { count: 1 };
    }
  }

  async getFavoriteWorkers(clientProfileId) {
    try {
      return await prisma.favoriteWorker.findMany({
        where: { clientProfileId },
        include: {
          workerProfile: {
            include: {
              user: { select: { firstName: true, lastName: true, avatar: true } },
              skills: { include: { skill: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch {
      return inMemoryFavorites.get(clientProfileId) || [];
    }
  }
}

module.exports = new ClientRepository();
