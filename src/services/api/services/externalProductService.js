import axiosInstance from '../client/axiosInstance';

/**
 * External Product Service
 * Handles product scraping and external URL parsing
 */
export const externalProductService = {
  /**
   * Scrape product data from external URL
   * @param {Object} scrapeData - { url }
   * @returns {Promise} Scraped product data
   */
  scrapeProduct: async (scrapeData) => {
    const { data } = await axiosInstance.post('/external-product/scrape', scrapeData);
    return data;
  },

  /**
   * Store external product in wantlyst
   * @param {Object} productData - Product details to store
   * @returns {Promise} Stored product
   */
  storeProduct: async (productData) => {
    const { data } = await axiosInstance.post('/external-product/store', productData);
    return data;
  },

  /**
   * Get external product details
   * @param {string} productId - Product ID
   * @returns {Promise} Product details
   */
  getProduct: async (productId) => {
    const { data } = await axiosInstance.get(`/external-product/${productId}`);
    return data;
  },

  /**
   * Get all external products
   * @param {Object} params - Query parameters
   * @returns {Promise} Products list
   */
  getAllProducts: async (params = {}) => {
    const { data } = await axiosInstance.get('/external-product', { params });
    return data;
  },
};
