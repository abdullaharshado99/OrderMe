import axiosInstance from '../client/axiosInstance'

/**
 * Wantlyst Service
 * Contains all wantlyst-related API calls (create, read, update, delete)
 */
export const wantlystService = {
  /**
   * Create new wantlyst
   * @param {Object} wantlystData - Wantlyst details (name, description, etc.)
   * @returns {Promise} Created wantlyst
   */
  createWantlyst: async (wantlystData) => {
    const { data } = await axiosInstance.post('/list', wantlystData)
    return data
  },

  /**
   * Get all wantlysts
   * @param {Object} params - Query parameters (page, limit, userId, etc.)
   * @returns {Promise} Wantlysts list with pagination
   */
  getWantlysts: async (params = {}) => {
    const { data } = await axiosInstance.get('/list', { params })
    return data
  },

  /**
   * Get single wantlyst by ID
   * @param {string} wantlystId - Wantlyst ID
   * @returns {Promise} Wantlyst details
   */
  getWantlystById: async (wantlystId) => {
    const { data } = await axiosInstance.get(`/list/${wantlystId}`)
    return data
  },

  /**
   * Update wantlyst
   * @param {string} wantlystId - Wantlyst ID
   * @param {Object} updateData - Fields to update
   * @returns {Promise} Updated wantlyst
   */
  updateWantlyst: async (wantlystId, updateData) => {
    const { data } = await axiosInstance.put(`/list/${wantlystId}`, updateData)
    return data
  },

  /**
   * Delete wantlyst
   * @param {string} wantlystId - Wantlyst ID
   * @returns {Promise} Result
   */
  deleteWantlyst: async (wantlystId) => {
    const { data } = await axiosInstance.delete(`/list/${wantlystId}`)
    return data
  },

  /**
   * Add item to wantlyst
   * @param {string} wantlystId - Wantlyst ID
   * @param {Object} itemData - Item details
   * @returns {Promise} Updated wantlyst
   */
  addItem: async (wantlystId, itemData) => {
    const { data } = await axiosInstance.post(`/list/${wantlystId}/items`, itemData)
    return data
  },

  /**
   * Remove item from wantlyst
   * @param {string} itemId - Item ID
   * @returns {Promise} Result
   */
  removeItem: async (itemId) => {
    const { data } = await axiosInstance.delete(`/item/${itemId}`)
    return data
  },

  /**
   * Get items in a wantlyst with pagination
   * @param {string} wantlystId - Wantlyst ID
   * @param {Object} params - Query parameters (page, limit)
   * @returns {Promise} Items list with pagination
   */
  getWantlystItems: async (wantlystId, params = {}) => {
    const { data } = await axiosInstance.get(`/list/${wantlystId}/items`, { params })
    return data
  },
}
