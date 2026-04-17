import axiosInstance from '../client/axiosInstance';

/**
 * Event Service
 * Contains all event-related API calls
 */
export const eventService = {
  /**
   * Create new event
   * @param {Object} eventData - Event details
   * @returns {Promise} Created event
   */
  createEvent: async (eventData) => {
    const { data } = await axiosInstance.post('/events', eventData);
    return data;
  },

  /**
   * Get all events
   * @param {Object} params - Query parameters (page, limit, upcoming, etc.)
   * @returns {Promise} Events list
   */
  getEvents: async (params = {}) => {
    const { data } = await axiosInstance.get('/events', { params });
    return data;
  },

  /**
   * Get single event by ID
   * @param {string} eventId - Event ID
   * @returns {Promise} Event details
   */
  getEventById: async (eventId) => {
    const { data } = await axiosInstance.get(`/events/${eventId}`);
    return data;
  },

  /**
   * Update event
   * @param {string} eventId - Event ID
   * @param {Object} updateData - Fields to update
   * @returns {Promise} Updated event
   */
  updateEvent: async (eventId, updateData) => {
    const { data } = await axiosInstance.patch(`/events/${eventId}`, updateData);
    return data;
  },

  /**
   * Delete event
   * @param {string} eventId - Event ID
   * @returns {Promise} Result
   */
  deleteEvent: async (eventId) => {
    const { data } = await axiosInstance.delete(`/events/${eventId}`);
    return data;
  },
};
