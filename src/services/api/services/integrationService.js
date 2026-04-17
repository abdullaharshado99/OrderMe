import axiosInstance from '../client/axiosInstance';
import { EndPoints } from '../../EndPoints';

/**
 * Integration Service
 * Contains all third-party integration API calls (Gmail, Outlook, etc.)
 */
export const integrationService = {

  /**
   * Get Google Gmail OAuth auth URL
   * GET /api/integrations/google/auth-url
   * @returns {Promise} { authUrl: string } — redirect the user to this URL to connect Gmail
   */
  getGmailAuthUrl: async () => {
    console.log('🚀 ConnectGmailAccount API - GET', EndPoints.ConnectGmailAccount);
    const { data } = await axiosInstance.get(EndPoints.ConnectGmailAccount);
    console.log('✅ ConnectGmailAccount API - Response:', JSON.stringify(data, null, 2));
    return data;
  },
};
