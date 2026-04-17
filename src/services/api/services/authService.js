import axiosInstance from '../client/axiosInstance';
import { EndPoints } from '../../EndPoints';

/**
 * Authentication Service
 * Contains all auth-related API calls (login, signup, profile, etc.)
 */
export const authService = {
  // ========== AUTH OPERATIONS ==========
  
  /**
   * User login
   * Supports both email and phone login:
   *  - Email:  { type: 'email', email, password }
   *  - Phone:  { type: 'phone', phoneNo, password }
   * @param {Object} credentials - { type, email?, phoneNo?, password }
   * @returns {Promise} User data with access token
   */
  login: async ({ type, email, phoneNo, password }) => {
    const payload = {
      identifier: type === 'email' ? email : phoneNo,
      password,
    };

    console.log('🚀 Login API - Payload:', JSON.stringify(payload, null, 2));
    const { data } = await axiosInstance.post(EndPoints.login, payload);
    return data;
  },

  /**
   * User signup/registration
   *
   * Email signup payload:  { name, email, password }
   * Phone signup payload:  { name, phone, password }
   *
   * @param {Object} userData - { name, email?, phone?, password, type }
   * @returns {Promise} User data
   */
  signup: async ({ type, name, email, phoneNo, password }) => {
    const payload =
      type === 'email'
        ? { name, email, password }
        : { name, phone: phoneNo, password };

    console.log('🚀 Signup API - Payload:', JSON.stringify(payload, null, 2));
    const { data } = await axiosInstance.post(EndPoints.signup, payload);
    return data;
  },

  /**
   * Google login (social auth)
   * @param {Object} googleData - Google auth response
   * @returns {Promise} User data with access token
   */
  googleLogin: async (googleData) => {
    const { data } = await axiosInstance.post('/auth/login', googleData);
    return data;
  },

  /**
   * Verify OTP for login flow
   * @param {Object} payload - { email, otp }
   * @returns {Promise} User data with token
   */
  verifyLoginOtp: async ({ userId, otp }) => {
    const payload = { userId, code: otp, purpose: 'login' };
    console.log('🚀 VerifyLoginOtp API - Payload:', JSON.stringify(payload, null, 2));
    const { data } = await axiosInstance.post(EndPoints.verifyLoginOtp, payload);
    return data;
  },

  /**
   * Verify OTP for signup / registration (same endpoint as login verify)
   */
  verifySignupOtp: async ({ userId, otp }) => {
    const payload = { userId, code: otp, purpose: 'signup' };
    console.log('🚀 VerifySignupOtp API - Payload:', JSON.stringify(payload, null, 2));
    const { data } = await axiosInstance.post(EndPoints.verifySignupOtp, payload);
    return data;
  },

  /**
   * Unified forgot-password flow — single endpoint, 3 steps:
   *  Step 1 (request OTP): { step: 1, email }
   *  Step 2 (verify OTP):  { step: 2, email, otp }
   *  Step 3 (reset pwd):   { step: 3, email, password }
   * @param {Object} payload - { step, email, otp?, password? }
   * @returns {Promise} Result
   */
  forgotPassword: async (payload) => {
    console.log('🚀 ForgotPassword API - Step', payload.step, '- Payload:', JSON.stringify(payload, null, 2));
    const { data } = await axiosInstance.post(EndPoints.forgotPassword, payload);
    return data;
  },

  /**
   * User logout
   * @returns {Promise} Result
   */
  logout: async () => {
    const { data } = await axiosInstance.post('/auth/logout');
    return data;
  },

  // ========== PROFILE OPERATIONS ==========

  /**
   * Get user profile
   * @returns {Promise} User profile data
   */
  getProfile: async () => {
    const { data } = await axiosInstance.get('/auth/profile');
    return data;
  },

  /**
   * Edit user profile
   * @param {Object} profileData - Updated profile fields
   * @returns {Promise} Updated profile
   */
  editProfile: async (profileData) => {
    const { data } = await axiosInstance.patch('/auth/edit-profile', profileData);
    return data;
  },

  /**
   * Update personal information
   * @param {Object} personalInfo - Personal info data
   * @returns {Promise} Updated info
   */
  updatePersonalInfo: async (personalInfo) => {
    const { data } = await axiosInstance.post('/auth/personal-information', personalInfo);
    return data;
  },

  /**
   * Update personal profile (profile creation steps)
   * @param {Object} profileData - Step data with stepNumber
   * @returns {Promise} Updated profile
   */
  updatePersonalProfile: async (profileData) => {
    const { data } = await axiosInstance.patch('/auth/personal-profile', profileData);
    return data;
  },

  // ========== PREFERENCES ==========

  /**
   * Update jewelry preferences
   * @param {Object} jewelryData - Jewelry preferences
   * @returns {Promise} Updated preferences
   */
  updateJewelry: async (jewelryData) => {
    const { data } = await axiosInstance.post('/auth/jewelry', jewelryData);
    return data;
  },

  /**
   * Update interests
   * @param {Object} interestsData - User interests
   * @returns {Promise} Updated interests
   */
  updateInterests: async (interestsData) => {
    const { data } = await axiosInstance.post('/auth/interests', interestsData);
    return data;
  },

  /**
   * Get interests
   * @returns {Promise} User interests
   */
  getInterests: async () => {
    const { data } = await axiosInstance.get('/auth/interests');
    return data;
  },

  /**
   * Update brand preferences
   * @param {Object} brandsData - Favorite brands
   * @returns {Promise} Updated brands
   */
  updateBrands: async (brandsData) => {
    const { data } = await axiosInstance.post('/auth/brands', brandsData);
    return data;
  },

  /**
   * Update size preferences
   * @param {Object} sizesData - Size information
   * @returns {Promise} Updated sizes
   */
  updateSizes: async (sizesData) => {
    const { data } = await axiosInstance.post('/auth/sizes', sizesData);
    return data;
  },

  /**
   * Get friend overview (for viewing other user's profile)
   * @param {string} friendId - Friend's user ID
   * @returns {Promise} Friend profile overview
   */
  getFriendOverview: async (friendId) => {
    const { data } = await axiosInstance.get(`/auth/friend-overview/${friendId}`);
    return data;
  },

  // ========== OTHER ==========

  /**
   * Store FCM token for push notifications
   * @param {Object} tokenData - { fcmToken }
   * @returns {Promise} Result
   */
  storeFCMToken: async (tokenData) => {
    const { data } = await axiosInstance.post('/auth/store-fcm-token', tokenData);
    return data;
  },

  /**
   * Refresh access token
   * @param {Object} refreshData - { refreshToken }
   * @returns {Promise} New access token
   */
  refreshToken: async (refreshData) => {
    const { data } = await axiosInstance.post('/auth/refresh-token', refreshData);
    return data;
  },
};
