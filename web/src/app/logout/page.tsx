import api from '@/lib/axios';

export async function logout() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
        await api.post('/auth/logout', { refreshToken }).catch(() => { });
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
}