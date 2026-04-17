import axiosInstance from '../client/axiosInstance';
import { EndPoints } from '../../EndPoints';

/**
 * User Service
 * Contains all user-related API calls (profile, settings, etc.)
 */
export const userService = {

  /**
   * Get authenticated user's profile
   * GET /api/users/profile
   * @returns {Promise} { success: boolean, user: UserProfile }
   * user.oauthConnections — array of connected providers (google, etc.)
   * user.connections      — simplified list of connected providers
   */
  getUserProfile: async () => {
    const { store } = require('../../../redux/store');
    const userState = store.getState()?.userReducer?.user;
    const token = userState?.token || userState?.accessToken;
    console.log('🚀 getUserProfile API - GET', EndPoints.getUserProfile);
    console.log('🔑 getUserProfile - token present:', !!token, '| userId:', userState?.id);
    const { data } = await axiosInstance.get(EndPoints.getUserProfile);
    console.log('✅ getUserProfile API - Response:', JSON.stringify(data, null, 2));
    return data;
  },
};
