/**
 * @file search.service.ts
 * @description Search aggregation logic.
 */

import { searchRepository } from './search.repository';
import { SearchAggregatedResponse } from './search.types';

export const searchService = {
  async searchAll(query: string, limit = 10): Promise<SearchAggregatedResponse> {
    const cleanQuery = query.trim();
    if (!cleanQuery) {
      return { users: [], circles: [], events: [], groups: [] };
    }

    const [users, circles, events, groups] = await Promise.all([
      searchRepository.searchUsers(cleanQuery, limit),
      searchRepository.searchCircles(cleanQuery, limit),
      searchRepository.searchEvents(cleanQuery, limit),
      searchRepository.searchGroups(cleanQuery, limit),
    ]);

    return { users, circles, events, groups };
  },

  async searchUsers(query: string, limit = 20) {
    return searchRepository.searchUsers(query.trim(), limit);
  },

  async searchCircles(query: string, limit = 20) {
    return searchRepository.searchCircles(query.trim(), limit);
  },

  async searchEvents(query: string, limit = 20) {
    return searchRepository.searchEvents(query.trim(), limit);
  },

  async searchGroups(query: string, limit = 20) {
    return searchRepository.searchGroups(query.trim(), limit);
  },
};
