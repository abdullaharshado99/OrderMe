import axiosInstance from '../client/axiosInstance'

/**
 * Circle Service
 * Contains all circle-related API calls
 */
export const circleService = {
  /**
   * Create new circle
   * @param {Object} circleData - Circle details
   * @returns {Promise} Created circle
   */
  createCircle: async (circleData) => {
    const { data } = await axiosInstance.post('/circle', circleData)
    return data
  },

  /**
   * Get all circles
   * @param {Object} params - Optional pagination params {page, limit}
   * @returns {Promise} Circles list
   */
  getCircles: async (params = {}) => {
    const { data } = await axiosInstance.get('/circle', { params })
    return data
  },

  /**
   * Get single circle by ID
   * @param {string} circleId - Circle ID
   * @returns {Promise} Circle details
   */
  getCircleById: async (circleId) => {
    const { data } = await axiosInstance.get(`/circle/${circleId}`)
    return data
  },

  /**
   * Update circle
   * @param {string} circleId - Circle ID
   * @param {Object} updateData - Updated circle details
   * @returns {Promise} Updated circle
   */
  updateCircle: async (circleId, updateData) => {
    const { data } = await axiosInstance.put(`/circle/${circleId}`, updateData)
    return data
  },

  /**
   * Delete circle
   * @param {string} circleId - Circle ID
   * @returns {Promise} Success message
   */
  deleteCircle: async (circleId) => {
    const { data } = await axiosInstance.delete(`/circle/${circleId}`)
    return data
  },

  /**
   * Leave circle
   * @param {string} circleId - Circle ID
   * @returns {Promise} Success message
   */
  leaveCircle: async (circleId) => {
    const { data } = await axiosInstance.delete(`/circle/${circleId}/leave`)
    return data
  },

  /**
   * Invite users to circle
   * @param {string} circleId - Circle ID
   * @param {Array} userIds - Array of user IDs to invite
   * @returns {Promise} Invitation result
   */
  inviteToCircle: async (circleId, userIds) => {
    const { data } = await axiosInstance.post(`/circle/${circleId}/invite`, { userIds })
    return data
  },

  /**
   * Respond to circle invitation
   * @param {string} circleId - Circle ID
   * @param {string} response - "accept" or "decline"
   * @returns {Promise} Response result
   */
  respondToInvitation: async (circleId, response) => {
    const { data } = await axiosInstance.post(`/circle/${circleId}/respond`, { response })
    return data
  },

  /**
   * Get circle members
   * @param {string} circleId - Circle ID
   * @returns {Promise} Members list
   */
  getCircleMembers: async (circleId) => {
    const { data } = await axiosInstance.get(`/circle/${circleId}/members`)
    return data
  },

  /**
   * Remove member from circle
   * @param {string} circleId - Circle ID
   * @param {string} userId - User ID to remove
   * @returns {Promise} Success message
   */
  removeMember: async (circleId, userId) => {
    const { data } = await axiosInstance.delete(`/circle/${circleId}/members/${userId}`)
    return data
  },

  /**
   * Update member role
   * @param {string} circleId - Circle ID
   * @param {string} userId - User ID
   * @param {string} role - "admin" or "member"
   * @returns {Promise} Updated member
   */
  updateMemberRole: async (circleId, userId, role) => {
    const { data } = await axiosInstance.put(`/circle/${circleId}/members/${userId}/role`, { role })
    return data
  },

  /**
   * Share item to circle
   * @param {string} circleId - Circle ID
   * @param {string} wantlystItemId - Item ID
   * @param {string} message - Optional message
   * @returns {Promise} Shared item
   */
  shareItemToCircle: async (circleId, wantlystItemId, message) => {
    const { data } = await axiosInstance.post(`/circle/${circleId}/share-item`, {
      wantlystItemId,
      message,
    })
    return data
  },

  /**
   * Get circle items
   * @param {string} circleId - Circle ID
   * @param {Object} params - Pagination params
   * @returns {Promise} Items list
   */
  getCircleItems: async (circleId, params = {}) => {
    const { data } = await axiosInstance.get(`/circle/${circleId}/items`, { params })
    return data
  },

  /**
   * Create poll
   * @param {string} circleId - Circle ID
   * @param {Object} pollData - Poll details
   * @returns {Promise} Created poll
   */
  createPoll: async (circleId, pollData) => {
    const { data } = await axiosInstance.post(`/circle/${circleId}/polls`, pollData)
    return data
  },

  /**
   * Get circle polls
   * @param {string} circleId - Circle ID
   * @param {Object} params - Query params
   * @returns {Promise} Polls list
   */
  getCirclePolls: async (circleId, params = {}) => {
    const { data } = await axiosInstance.get(`/circle/${circleId}/polls`, { params })
    return data
  },

  /**
   * Vote on poll
   * @param {string} pollId - Poll ID
   * @param {number} optionIndex - Selected option index
   * @returns {Promise} Vote result
   */
  voteOnPoll: async (pollId, optionIndex) => {
    const { data } = await axiosInstance.post(`/circle/polls/${pollId}/vote`, { optionIndex })
    return data
  },

  /**
   * Send message to circle
   * @param {string} circleId - Circle ID
   * @param {Object} messageData - Message details
   * @returns {Promise} Sent message
   */
  sendMessage: async (circleId, messageData) => {
    const { data } = await axiosInstance.post(`/circle/${circleId}/messages`, messageData)
    return data
  },

  /**
   * Get circle messages
   * @param {string} circleId - Circle ID
   * @param {Object} params - Pagination params
   * @returns {Promise} Messages list
   */
  getCircleMessages: async (circleId, params = {}) => {
    const { data } = await axiosInstance.get(`/circle/${circleId}/messages`, { params })
    return data
  },
}

export default circleService
