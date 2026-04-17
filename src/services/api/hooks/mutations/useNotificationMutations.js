import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '../../services/notificationService';
import { queryKeys } from '../../config/queryKeys';

/**
 * Mark notification as read
 * @returns {Object} Mutation object
 * 
 * Usage:
 * const { mutate: markAsRead } = useMarkNotificationAsRead();
 * markAsRead(notificationId, {
 *   onSuccess: () => console.log('Marked as read')
 * });
 */
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: notificationService.markAsRead,
    onSuccess: (_, notificationId) => {
      // Optimistic update: Update specific notification in cache
      queryClient.setQueryData(queryKeys.notifications.all, (oldData) => {
        if (!oldData?.data?.items) return oldData;
        
        return {
          ...oldData,
          data: {
            ...oldData.data,
            items: oldData.data.items.map((notification) =>
              notification.id === notificationId
                ? { ...notification, read: true }
                : notification
            ),
          },
        };
      });
      
      // Invalidate unread count
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.unread });
    },
  });
};

/**
 * Mark all notifications as read
 * @returns {Object} Mutation object
 */
export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: notificationService.markAllAsRead,
    onSuccess: () => {
      // Refetch all notifications
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.unread });
    },
  });
};

/**
 * Delete notification
 * @returns {Object} Mutation object
 */
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: notificationService.deleteNotification,
    onSuccess: (_, notificationId) => {
      // Remove notification from cache
      queryClient.setQueryData(queryKeys.notifications.all, (oldData) => {
        if (!oldData?.data?.items) return oldData;
        
        return {
          ...oldData,
          data: {
            ...oldData.data,
            items: oldData.data.items.filter((n) => n.id !== notificationId),
          },
        };
      });
    },
  });
};
