import { useQuery } from '@tanstack/react-query';
import { authService } from '../../services/authService';
import { queryKeys } from '../../config/queryKeys';

/**
 * Get current user profile
 * @param {Object} options - React Query options
 * @returns {Object} Query result with user profile data
 */
export const useProfile = (options = {}) => {
  return useQuery({
    queryKey: queryKeys.auth.profile,
    queryFn: authService.getProfile,
    staleTime: 10 * 60 * 1000, // 10 minutes - profile doesn't change often
    ...options,
  });
};

/**
 * Get personal information
 * @param {Object} options - React Query options
 * @returns {Object} Query result with personal info
 */
export const usePersonalInfo = (options = {}) => {
  return useQuery({
    queryKey: queryKeys.auth.personalInfo,
    queryFn: authService.getProfile, // Assuming same endpoint
    ...options,
  });
};

/**
 * Get user interests
 * @param {Object} options - React Query options
 * @returns {Object} Query result with interests data
 */
export const useInterests = (options = {}) => {
  return useQuery({
    queryKey: queryKeys.preferences.interests,
    queryFn: authService.getInterests,
    ...options,
  });
};

/**
 * Get friend overview (other user's profile)
 * @param {string} friendId - Friend's user ID
 * @param {Object} options - React Query options
 * @returns {Object} Query result with friend profile
 */
export const useFriendOverview = (friendId, options = {}) => {
  return useQuery({
    queryKey: queryKeys.auth.friendOverview(friendId),
    queryFn: () => authService.getFriendOverview(friendId),
    enabled: !!friendId, // Only fetch if friendId exists
    ...options,
  });
};
