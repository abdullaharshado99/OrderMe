import axiosInstance from '../client/axiosInstance';

/**
 * Friend Service
 * Contains all friend-related API calls (requests, connections, etc.)
 */
export const friendService = {
  // ========== FRIEND REQUESTS ==========

  /**
   * Send friend request
   * @param {Object} requestData - { receiverId }
   * @returns {Promise} Request result
   */
  sendRequest: async (requestData) => {
    const { data } = await axiosInstance.post('/friends/requests/send', requestData);
    return data;
  },

  /**
   * Cancel friend request
   * @param {Object} cancelData - { requestId }
   * @returns {Promise} Result
   */
  cancelRequest: async (cancelData) => {
    const { data } = await axiosInstance.post('/friends/requests/cancel', cancelData);
    return data;
  },

  /**
   * Accept friend request
   * @param {Object} acceptData - { requestId }
   * @returns {Promise} Result
   */
  acceptRequest: async (acceptData) => {
    const { data } = await axiosInstance.post('/friends/requests/accept', acceptData);
    return data;
  },

  /**
   * Decline friend request
   * @param {Object} declineData - { requestId }
   * @returns {Promise} Result
   */
  declineRequest: async (declineData) => {
    const { data } = await axiosInstance.post('/friends/requests/decline', declineData);
    return data;
  },

  /**
   * Get all friend requests
   * @param {Object} params - Query parameters
   * @returns {Promise} Friend requests list
   */
  getAllRequests: async (params = {}) => {
    const { data } = await axiosInstance.get('/friends/requests', { params });
    return data;
  },

  // ========== FRIENDS LIST ==========

  /**
   * Get all friends
   * @param {Object} params - Query parameters (page, limit, etc.)
   * @returns {Promise} Friends list
   */
  getFriends: async (params = {}) => {
    const { data } = await axiosInstance.get('/friends', { params });
    return data;
  },

  /**
   * Delete/Remove friend
   * @param {string} friendId - Friend's user ID
   * @returns {Promise} Result
   */
  deleteFriend: async (friendId) => {
    const { data } = await axiosInstance.delete(`/friends/${friendId}`);
    return data;
  },

  /**
   * Search friends
   * @param {Object} searchParams - { query, page, limit }
   * @returns {Promise} Search results
   */
  searchFriends: async (searchParams) => {
    const { data } = await axiosInstance.get('/friends/search', { params: searchParams });
    return data;
  },
};
