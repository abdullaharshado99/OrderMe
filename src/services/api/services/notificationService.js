import axiosInstance from '../client/axiosInstance';

/**
 * Notification Service
 * Contains all notification-related API calls
 */
export const notificationService = {
  /**
   * Get all notifications
   * @param {Object} params - Query parameters (page, limit, unread, etc.)
   * @returns {Promise} Notifications list with pagination
   */
  getNotifications: async (params = {}) => {
    const { data } = await axiosInstance.get('/notifications', { params });
    return data;
  },

  /**
   * Mark a notification as read
   * @param {string} notificationId - Notification ID
   * @returns {Promise} Updated notification
   */
  markAsRead: async (notificationId) => {
    const { data } = await axiosInstance.patch(`/notifications/${notificationId}/read`);
    return data;
  },

  /**
   * Get unread notifications count
   * @returns {Promise} Count of unread notifications
   */
  getUnreadCount: async () => {
    const { data } = await axiosInstance.get('/notifications', { 
      params: { unread: true } 
    });
    return data;
  },

  /**
   * Mark all notifications as read
   * @returns {Promise} Result
   */
  markAllAsRead: async () => {
    const { data } = await axiosInstance.patch('/notifications/read-all');
    return data;
  },

  /**
   * Delete a notification
   * @param {string} notificationId - Notification ID
   * @returns {Promise} Result
   */
  deleteNotification: async (notificationId) => {
    const { data } = await axiosInstance.delete(`/notifications/${notificationId}`);
    return data;
  },
};
