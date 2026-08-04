'use strict';

const prisma = require('../../config/database');

class ProductivityService {
  // Bookmarks
  async getBookmarks(userId) {
    return prisma.bookmark.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async addBookmark(userId, data) {
    return prisma.bookmark.create({
      data: { userId, ...data },
    });
  }

  async removeBookmark(id, userId) {
    return prisma.bookmark.deleteMany({
      where: { id, userId },
    });
  }

  // Pinned Items
  async getPinnedItems(userId) {
    return prisma.pinnedItem.findMany({
      where: { userId },
      orderBy: { orderIndex: 'asc' },
    });
  }

  async addPinnedItem(userId, data) {
    return prisma.pinnedItem.create({
      data: { userId, ...data },
    });
  }

  async reorderPinnedItems(userId, itemsOrder) {
    // Reorder array [{ id, orderIndex }]
    const updates = itemsOrder.map(({ id, orderIndex }) =>
      prisma.pinnedItem.updateMany({
        where: { id, userId },
        data: { orderIndex },
      })
    );
    return Promise.all(updates);
  }

  async removePinnedItem(id, userId) {
    return prisma.pinnedItem.deleteMany({
      where: { id, userId },
    });
  }

  // Recently Viewed History
  async getRecentlyViewed(userId) {
    return prisma.recentlyViewed.findMany({
      where: { userId },
      orderBy: { viewedAt: 'desc' },
      take: 15,
    });
  }

  async recordRecentlyViewed(userId, data) {
    // Upsert or create
    const existing = await prisma.recentlyViewed.findFirst({
      where: { userId, entityType: data.entityType, entityId: data.entityId },
    });

    if (existing) {
      return prisma.recentlyViewed.update({
        where: { id: existing.id },
        data: { viewedAt: new Date(), title: data.title, linkUrl: data.linkUrl },
      });
    }

    return prisma.recentlyViewed.create({
      data: { userId, ...data },
    });
  }
}

module.exports = new ProductivityService();
