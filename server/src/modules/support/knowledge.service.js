'use strict';

const supportRepository = require('./support.repository');

class KnowledgeService {
  async createArticle(data, authorId) {
    return supportRepository.createKnowledgeArticle({
      ...data,
      authorId,
    });
  }

  async getArticles(filter = {}) {
    return supportRepository.findKnowledgeArticles(filter);
  }

  async getArticleBySlug(slug) {
    const article = await supportRepository.findKnowledgeArticleBySlug(slug);
    if (!article) {
      throw new Error('Knowledge Base Article not found.');
    }
    return article;
  }
}

module.exports = new KnowledgeService();
