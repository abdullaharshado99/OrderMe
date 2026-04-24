import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = 'https://api.livewithquran.com';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
});

api.interceptors.request.use(async (config) => {
    const token = await SecureStore.getItemAsync('accessToken');
    if (token) {
        config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`,
        };
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;
            const refreshToken = await SecureStore.getItemAsync('refreshToken');
            if (refreshToken) {
                const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                    refreshToken,
                });
                await SecureStore.setItemAsync('accessToken', data.accessToken);
                await SecureStore.setItemAsync('refreshToken', data.refreshToken);
                originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                return api(originalRequest);
            }
        }
        return Promise.reject(error);
    }
);

export default api;