'use client';

import { useEffect } from 'react';
import api from '@/lib/axios';
import styles from './logout.module.css';

async function performLogout() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
        await api.post('/auth/logout', { refreshToken }).catch(() => { });
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
}

export default function LogoutPage() {
    useEffect(() => {
        void performLogout();
    }, []);
    return (
        <div className={styles.container}>
            <p className={styles.text}>Logging out…</p>
        </div>
    );
}
