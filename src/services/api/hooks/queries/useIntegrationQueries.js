import { useQuery } from '@tanstack/react-query';
import { integrationService } from '../../services/integrationService';

/**
 * Connect Gmail Account Query
 *
 * Uses `enabled: false` so the request only fires when `refetch()` is called manually.
 * This is the correct pattern for GET APIs triggered by a user action (button press).
 *
 * Usage in component:
 *   const { refetch, isFetching } = useConnectGmailAccount();
 *   // On button press:
 *   refetch();
 *
 * @returns {Object} React Query result — { refetch, isFetching, data, error }
 */
export const useConnectGmailAccount = () => {
  return useQuery({
    queryKey: ['integrations', 'google', 'auth-url'],
    queryFn: integrationService.getGmailAuthUrl,
    enabled: false,          // Never auto-fetch — only fires on refetch()
    retry: 1,
    staleTime: 0,            // Always fresh when manually triggered
  });
};
