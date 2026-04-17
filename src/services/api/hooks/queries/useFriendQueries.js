import { useQuery } from '@tanstack/react-query';
import { friendService } from '../../services/friendService';
import { queryKeys } from '../../config/queryKeys';

/**
 * Get all friends
 * @param {Object} params - Query parameters
 * @param {Object} options - React Query options
 * @returns {Object} Query result with friends list
 */
export const useFriends = (params = {}, options = {}) => {
  return useQuery({
    queryKey: [...queryKeys.friends.all, params],
    queryFn: () => friendService.getFriends(params),
    ...options,
  });
};

/**
 * Get all friend requests (sent + received)
 * @param {Object} options - React Query options
 * @returns {Object} Query result with friend requests
 */
export const useFriendRequests = (options = {}) => {
  return useQuery({
    queryKey: queryKeys.friends.requests,
    queryFn: () => friendService.getAllRequests(),
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
    ...options,
  });
};

/**
 * Search friends
 * @param {string} searchQuery - Search query string
 * @param {Object} options - React Query options
 * @returns {Object} Query result with search results
 */
export const useSearchFriends = (searchQuery, options = {}) => {
  return useQuery({
    queryKey: [...queryKeys.friends.all, 'search', searchQuery],
    queryFn: () => friendService.searchFriends({ query: searchQuery }),
    enabled: searchQuery && searchQuery.length > 2, // Only search if query > 2 chars
    ...options,
  });
};
