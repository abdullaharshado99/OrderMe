import { useQuery } from '@tanstack/react-query';
import { userService } from '../../services/userService';
import { useSelector } from 'react-redux';

/**
 * useGetUserProfile
 *
 * Fetches the authenticated user's profile including oauthConnections.
 * Use `data.user.connections` to check which providers are linked (e.g. google).
 *
 * Usage:
 *   const { data, isLoading, refetch } = useGetUserProfile();
 *   const isGmailConnected = data?.user?.connections?.some(c => c.provider === 'google');
 */
export const useGetUserProfile = () => {
  const user = useSelector((state) => state.userReducer?.user);
  const token = user?.token || user?.accessToken;
  const userId = user?.id;

  return useQuery({
    // Scope the cache key to this user — avoids serving a stale pre-login cache
    queryKey: ['user', 'profile', userId], 
    queryFn: userService.getUserProfile,
    // Only fetch when we actually have a token; prevents 401/500 on unauthenticated calls
    enabled: !!token,
    retry: 1,
    staleTime: 0, // Always fetch fresh — profile connections change after OAuth
  });
};
