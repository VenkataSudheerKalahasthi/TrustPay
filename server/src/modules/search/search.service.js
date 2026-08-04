'use strict';

const searchRepository = require('./search.repository');

class SearchService {
  /**
   * Execute Global Search with Text Highlight Matching
   */
  async search(userId, userRole, queryParams) {
    const { query, entityType = 'ALL', limit = 20, page = 1 } = queryParams;

    const searchResult = await searchRepository.searchAll(query, {
      userId,
      userRole,
      entityType,
      limit,
      page,
    });

    // Save search to user recent searches asynchronously
    if (query && query.trim().length > 1) {
      searchRepository.saveRecentSearch(userId, query, searchResult.total).catch(() => {});
      searchRepository.logAnalytics({ userId, query, resultsCount: searchResult.total }).catch(() => {});
    }

    // Highlight text matches in content
    const highlightedResults = searchResult.results.map((item) => ({
      ...item,
      highlightedTitle: this.highlightText(item.title, query),
      highlightedContent: this.highlightText(item.content, query),
    }));

    return {
      ...searchResult,
      results: highlightedResults,
    };
  }

  /**
   * Instant Search Suggestions for Navbar
   */
  async getSuggestions(userId, userRole, query) {
    if (!query || query.trim().length === 0) {
      return { suggestions: [] };
    }

    const searchResult = await searchRepository.searchAll(query, {
      userId,
      userRole,
      entityType: 'ALL',
      limit: 6,
      page: 1,
    });

    return { suggestions: searchResult.results };
  }

  /**
   * Helper to highlight matched query string with <mark> tag
   */
  highlightText(text, query) {
    if (!text || !query) {
      return text || '';
    }
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark class="bg-primary-500/30 text-primary-300 rounded px-1">$1</mark>');
  }

  async getRecentSearches(userId) {
    return searchRepository.getRecentSearches(userId);
  }

  async saveSearch(userId, data) {
    return searchRepository.saveSearch(userId, data);
  }

  async getSavedSearches(userId) {
    return searchRepository.getSavedSearches(userId);
  }

  async logClickAnalytics(userId, { query, clickedEntityId }) {
    return searchRepository.logAnalytics({ userId, query, clickedEntityId });
  }
}

module.exports = new SearchService();
