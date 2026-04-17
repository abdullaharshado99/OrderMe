import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../../services/authService';
import { queryKeys } from '../../config/queryKeys';

/**
 * Login mutation
 * Supports both email and phone login.
 * @returns {Object} Mutation object
 * 
 * Usage:
 * const { mutate: login, isPending } = useLogin();
 * login({ type: 'email', email, password }, { onSuccess, onError });
 * login({ type: 'phone', phoneNo, password }, { onSuccess, onError });
 */
export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      // Cache user profile data after successful login
      queryClient.setQueryData(queryKeys.auth.profile, data);
    }, 
  });
};

/**
 * Signup mutation
 *
 * Builds the correct payload based on signup type:
 *  - email: { name, email, password }
 *  - phone: { name, phone, password }
 *
 * @returns {Object} Mutation object
 *
 * Usage:
 * const { mutate: signup, isPending } = useSignup();
 * signup(
 *   { type: 'email', name, email, password },
 *   { onSuccess: (data) => { ... }, onError: (error) => { ... } }
 * );
 */
export const useSignup = () => {
  return useMutation({
    mutationFn: authService.signup,
  });
};

/**
 * Google login mutation
 * @returns {Object} Mutation object
 */
export const useGoogleLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: authService.googleLogin,
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.auth.profile, data);
    },
  });
};

/**
 * Verify OTP for login flow mutation
 * @returns {Object} Mutation object
 */
export const useVerifyLoginOtp = () => {
  return useMutation({
    mutationFn: authService.verifyLoginOtp,
  });
};

/**
 * Verify OTP for signup flow (purpose: 'signup')
 */
export const useVerifySignupOtp = () => {
  return useMutation({
    mutationFn: authService.verifySignupOtp,
  });
};

/**
 * Unified forgot-password mutation — covers all 3 steps via one endpoint.
 *
 * Step 1 – Request OTP:  mutate({ step: 1, email })
 * Step 2 – Verify OTP:   mutate({ step: 2, email, otp })
 * Step 3 – Reset pwd:    mutate({ step: 3, email, password })
 *
 * @returns {Object} Mutation object
 */
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: authService.forgotPassword,
  });
};

/**
 * Logout mutation
 * @returns {Object} Mutation object
 */
export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      // Clear all cached data on logout
      queryClient.clear();
    },
  });
};

/**
 * Update personal profile (profile creation steps)
 * @returns {Object} Mutation object
 * (Edit profile screen: import useEditProfile from useProfileMutations — PUT /users/profile.)
 */
export const useUpdatePersonalProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: authService.updatePersonalProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.personalProfile });
    },
  });
};

/**
 * Store FCM token for push notifications
 * @returns {Object} Mutation object
 */
export const useStoreFCMToken = () => {
  return useMutation({
    mutationFn: authService.storeFCMToken,
  });
};
