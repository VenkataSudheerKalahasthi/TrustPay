'use strict';

const prisma = require('../../config/database');

class SearchRepository {
  /**
   * Unified Cross-Module Search Query
   */
  async searchAll(query, { _userRole, userId, entityType = 'ALL', limit = 20, page = 1 }) {
    const skip = (page - 1) * limit;
    const lowerQuery = query.toLowerCase();

    // 1. Prepare parallel cross-table queries
    const searchPromises = [];

    // Projects
    if (entityType === 'ALL' || entityType === 'PROJECT') {
      searchPromises.push(
        prisma.project.findMany({
          where: {
            OR: [
              { title: { contains: lowerQuery, mode: 'insensitive' } },
              { description: { contains: lowerQuery, mode: 'insensitive' } },
              { projectNumber: { contains: lowerQuery, mode: 'insensitive' } },
            ],
          },
          take: limit,
          select: { id: true, projectNumber: true, title: true, description: true, status: true, createdAt: true },
        }).then((results) => results.map((r) => ({
          id: r.id,
          entityType: 'PROJECT',
          title: `[Project #${r.projectNumber}] ${r.title}`,
          content: r.description || '',
          subtitle: `Status: ${r.status}`,
          linkUrl: `/projects/${r.id}`,
          createdAt: r.createdAt,
        })))
      );
    } else {
      searchPromises.push(Promise.resolve([]));
    }

    // Contracts
    if (entityType === 'ALL' || entityType === 'CONTRACT') {
      searchPromises.push(
        prisma.contract.findMany({
          where: {
            OR: [
              { title: { contains: lowerQuery, mode: 'insensitive' } },
              { contractNumber: { contains: lowerQuery, mode: 'insensitive' } },
              { deliverables: { contains: lowerQuery, mode: 'insensitive' } },
            ],
          },
          take: limit,
          select: { id: true, contractNumber: true, title: true, deliverables: true, status: true, totalAmount: true, createdAt: true },
        }).then((results) => results.map((r) => ({
          id: r.id,
          entityType: 'CONTRACT',
          title: `[Contract #${r.contractNumber}] ${r.title}`,
          content: r.deliverables || '',
          subtitle: `Status: ${r.status} | ₹${r.totalAmount?.toLocaleString()}`,
          linkUrl: `/contracts/${r.id}`,
          createdAt: r.createdAt,
        })))
      );
    } else {
      searchPromises.push(Promise.resolve([]));
    }

    // Workers
    if (entityType === 'ALL' || entityType === 'WORKER') {
      searchPromises.push(
        prisma.workerProfile.findMany({
          where: {
            OR: [
              { title: { contains: lowerQuery, mode: 'insensitive' } },
              { bio: { contains: lowerQuery, mode: 'insensitive' } },
              { skillsJson: { contains: lowerQuery, mode: 'insensitive' } },
            ],
          },
          take: limit,
          select: { id: true, title: true, bio: true, hourlyRate: true, user: { select: { firstName: true, lastName: true } } },
        }).then((results) => results.map((r) => ({
          id: r.id,
          entityType: 'WORKER',
          title: `${r.user?.firstName || ''} ${r.user?.lastName || ''} - ${r.title}`,
          content: r.bio || '',
          subtitle: `Rate: ₹${r.hourlyRate}/hr`,
          linkUrl: `/workers/${r.id}`,
          createdAt: new Date(),
        })))
      );
    } else {
      searchPromises.push(Promise.resolve([]));
    }

    // Messages
    if (entityType === 'ALL' || entityType === 'MESSAGE') {
      searchPromises.push(
        prisma.message.findMany({
          where: {
            content: { contains: lowerQuery, mode: 'insensitive' },
            conversation: {
              participants: { some: { userId } },
            },
          },
          take: limit,
          select: { id: true, content: true, conversationId: true, createdAt: true, sender: { select: { firstName: true } } },
        }).then((results) => results.map((r) => ({
          id: r.id,
          entityType: 'MESSAGE',
          title: `Message from ${r.sender?.firstName || 'User'}`,
          content: r.content,
          subtitle: `Chat Conversation`,
          linkUrl: `/chat?conversationId=${r.conversationId}`,
          createdAt: r.createdAt,
        })))
      );
    } else {
      searchPromises.push(Promise.resolve([]));
    }

    // Execute queries in parallel
    const [projects, contracts, workers, messages] = await Promise.all(searchPromises);
    const combined = [...projects, ...contracts, ...workers, ...messages];

    // Compute facets count
    const facets = {
      PROJECT: projects.length,
      CONTRACT: contracts.length,
      WORKER: workers.length,
      MESSAGE: messages.length,
      ALL: combined.length,
    };

    // Sort by relevance (exact match in title first) and slice page
    combined.sort((a, b) => {
      const aTitleMatch = a.title.toLowerCase().includes(lowerQuery) ? 1 : 0;
      const bTitleMatch = b.title.toLowerCase().includes(lowerQuery) ? 1 : 0;
      return bTitleMatch - aTitleMatch;
    });

    const paginated = combined.slice(skip, skip + limit);

    return {
      results: paginated,
      total: combined.length,
      facets,
      page,
      limit,
    };
  }

  async saveRecentSearch(userId, query, resultCount) {
    return prisma.recentSearch.create({
      data: { userId, query, resultCount },
    });
  }

  async getRecentSearches(userId) {
    return prisma.recentSearch.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
  }

  async saveSearch(userId, data) {
    return prisma.savedSearch.create({
      data: { userId, ...data },
    });
  }

  async getSavedSearches(userId) {
    return prisma.savedSearch.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async logAnalytics(data) {
    return prisma.searchAnalytics.create({ data });
  }
}

module.exports = new SearchRepository();
