/**
 * Centralized Query Keys for React Query
 * 
 * Benefits:
 * - Easy cache invalidation
 * - Type-safe query keys
 * - Better debugging
 * - Consistent naming across the app
 * 
 * Usage:
 * - Use in useQuery: queryKey: queryKeys.auth.profile
 * - Invalidate: queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile })
 */

export const  queryKeys = {
  // ========== AUTH ==========
  auth: {
    all: ['auth'],
    profile: ['auth', 'profile'],
    personalInfo: ['auth', 'personal-info'],
    personalProfile: ['auth', 'personal-profile'],
    friendOverview: (friendId) => ['auth', 'friend-overview', friendId],
  },

  // ========== FRIENDS ==========
  friends: {
    all: ['friends'],
    requests: ['friends', 'requests'],
    byId: (friendId) => ['friends', friendId],
    pending: ['friends', 'pending'],
    sent: ['friends', 'sent'],
  },

  // ========== NOTIFICATIONS ==========
  notifications: {
    all: ['notifications'],
    unread: ['notifications', 'unread'],
    byId: (id) => ['notifications', id],
  },

  // ========== WANTLYST ==========
  wantlyst: {
    all: ['wantlyst'],
    byId: (id) => ['wantlyst', id],
    byUser: (userId) => ['wantlyst', 'user', userId],
    shared: ['wantlyst', 'shared'],
    items: (wantlystId) => ['wantlyst', wantlystId, 'items'],
  },

  // ========== EVENTS ==========
  events: {
    all: ['events'],
    byId: (id) => ['events', id],
    upcoming: ['events', 'upcoming'],
    past: ['events', 'past'],
  },

  // ========== SIZE CHARTS ==========
  sizeChart: {
    all: ['size-chart'],
    clothing: (region) => ['size-chart', 'clothing', region || 'all'],
    shoes: (region) => ['size-chart', 'shoes', region || 'all'],
    waist: (region) => ['size-chart', 'waist', region || 'all'],
    jewelry: {
      ring: ['size-chart', 'jewelry', 'ring'],
      bracelet: ['size-chart', 'jewelry', 'bracelet'],
      necklace: ['size-chart', 'jewelry', 'necklace'],
      earring: ['size-chart', 'jewelry', 'earring'],
    },
  },

  // ========== EXTERNAL PRODUCTS ==========
  externalProduct: {
    all: ['external-product'],
    byId: (id) => ['external-product', id],
    scrape: (url) => ['external-product', 'scrape', url],
  },

  // ========== TASKS ==========
  tasks: {
    all: ['tasks'],
    list: ['tasks', 'list'],
    aiSuggestions: ['tasks', 'ai-suggestions'],
  },

  // ========== MESSAGES ==========
  messages: {
    all: ['messages'],
    list: ['messages', 'list'],
  },
  threads: {
    all: ['threads'],
    byId: (threadId) => ['threads', threadId],
  },
  insights: {
    all: ['insights'],
  },

  // ========== DISCOVERY ==========
  discovery: {
    all: ['discovery'],
    feed: (filters) => ['discovery', 'feed', filters],
  },

  // ========== PREFERENCES ==========
  preferences: {
    jewelry: ['preferences', 'jewelry'],
    interests: ['preferences', 'interests'],
    brands: ['preferences', 'brands'],
    sizes: ['preferences', 'sizes'],
  },
}

/**
 * Helper function to invalidate related queries
 * 
 * Usage:
 * import { invalidateRelatedQueries } from './queryKeys';
 * invalidateRelatedQueries(queryClient, 'auth');
 */
export const invalidateRelatedQueries = (queryClient, category) => {
  if (queryKeys[category]?.all) {
    queryClient.invalidateQueries({ queryKey: queryKeys[category].all })
  }
}
