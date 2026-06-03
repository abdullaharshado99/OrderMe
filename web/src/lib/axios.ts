import axios from 'axios';
import { toast } from '@/components/ui/use-toast';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => {
        try {
            const method = response.config.method?.toLowerCase();
            const url = response.config.url || '';
            if (method && ['post', 'put', 'patch', 'delete'].includes(method)) {
                let message = 'Operation successful';
                if (url.includes('/restaurants') && method === 'post') message = 'Restaurant created successfully';
                else if (url.includes('/users') && method === 'post') message = 'User created successfully';
                toast({ title: 'Success', description: message, variant: 'success' });
            }
        } catch (e) {
            console.error('Toast error', e);
        }
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                try {
                    const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
                        refreshToken,
                    });
                    localStorage.setItem('accessToken', data.accessToken);
                    if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
                    originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            }
        }
        try {
            const msg = error.response?.data?.message || error.message || 'Request failed';
            toast({ title: 'Error', description: msg, variant: 'destructive' });
        } catch (e) {
            console.error(e);
        }
        return Promise.reject(error);
    }
);

export default api;