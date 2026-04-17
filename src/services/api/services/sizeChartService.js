import axiosInstance from '../client/axiosInstance';

/**
 * Size Chart Service
 * Handles size chart data for clothing, shoes, jewelry, etc.
 */
export const sizeChartService = {
  /**
   * Get size chart data
   * @param {Object} params - Query parameters (type, region, etc.)
   * @returns {Promise} Size chart data
   */
  getSizeChart: async (params = {}) => {
    const { data } = await axiosInstance.get('/size-chart', { params });
    return data;
  },

  /**
   * Get clothing size chart
   * @param {string} region - Region code (US, UK, EU, etc.)
   * @returns {Promise} Clothing size chart
   */
  getClothingSizes: async (region = 'US') => {
    const { data } = await axiosInstance.get('/size-chart', { 
      params: { type: 'clothing', region } 
    });
    return data;
  },

  /**
   * Get shoe size chart
   * @param {string} region - Region code (US, UK, EU, etc.)
   * @returns {Promise} Shoe size chart
   */
  getShoeSizes: async (region = 'US') => {
    const { data } = await axiosInstance.get('/size-chart', { 
      params: { type: 'shoes', region } 
    });
    return data;
  },

  /**
   * Get waist size chart
   * @param {string} region - Region code
   * @returns {Promise} Waist size chart
   */
  getWaistSizes: async (region = 'US') => {
    const { data } = await axiosInstance.get('/size-chart', { 
      params: { type: 'waist', region } 
    });
    return data;
  },

  /**
   * Get jewelry size chart
   * @param {string} type - Jewelry type (ring, bracelet, necklace, earring)
   * @returns {Promise} Jewelry size chart
   */
  getJewelrySizes: async (type) => {
    const { data } = await axiosInstance.get('/size-chart', { 
      params: { type: 'jewelry', subType: type } 
    });
    return data;
  },
};
