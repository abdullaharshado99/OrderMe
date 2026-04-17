import axiosInstance from '../client/axiosInstance';

/**
 * Discovery Service
 * Contains discovery feed related API calls
 */
export const discoveryService = {
  /**
   * Get discovery products feed
   * @param {Object} params - Query parameters (page, limit, search, etc.)
   * @returns {Promise} Discovery products list with pagination
   */
  getDiscoveryProducts: async (params = {}) => {
    const { data } = await axiosInstance.get('/discovery', { params });
    return data;
  },
};
