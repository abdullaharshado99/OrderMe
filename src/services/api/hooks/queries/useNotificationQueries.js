import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { notificationService } from '../../services/notificationService';
import { queryKeys } from '../../config/queryKeys';

/**
 * Get all notifications with pagination support
 * @param {Object} options - React Query options
 * @returns {Object} Query result with notifications
 */
export const useNotifications = (options = {}) => {
  return useQuery({
    queryKey: queryKeys.notifications.all,
    queryFn: () => notificationService.getNotifications(),
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
    ...options,
  });
};

/**
 * Get notifications with infinite scroll/pagination
 * @param {Object} options - React Query options
 * @returns {Object} Infinite query result
 */
export const useInfiniteNotifications = (options = {}) => {
  return useInfiniteQuery({
    queryKey: queryKeys.notifications.all,
    queryFn: ({ pageParam = 1 }) => 
      notificationService.getNotifications({ page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const hasMore = 
        lastPage?.pagination?.currentPage < lastPage?.pagination?.totalPages;
      return hasMore ? lastPage.pagination.currentPage + 1 : undefined;
    },
    refetchInterval: 30000,
    ...options,
  });
};

/**
 * Get unread notifications count
 * @param {Object} options - React Query options
 * @returns {Object} Query result with unread count
 */
export const useUnreadNotifications = (options = {}) => {
  return useQuery({
    queryKey: queryKeys.notifications.unread,
    queryFn: () => notificationService.getUnreadCount(),
    refetchInterval: 60000, // Refetch every minute
    ...options,
  });
};

/**
 * Get single notification by ID
 * @param {string} notificationId - Notification ID
 * @param {Object} options - React Query options
 * @returns {Object} Query result with notification details
 */
export const useNotification = (notificationId, options = {}) => {
  return useQuery({
    queryKey: queryKeys.notifications.byId(notificationId),
    queryFn: () => notificationService.getNotifications({ id: notificationId }),
    enabled: !!notificationId,
    ...options,
  });
};
