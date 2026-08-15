'use client';

import api from '@/lib/axios';
import styles from './dashboard.module.css';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function AdminDashboard() {
    const [stats, setStats] = useState({ totalRestaurants: 0, totalOrders: 0, revenue: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/analytics/admin-stats');
                setStats(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.topBar}>
                <h1 className={styles.title}>Admin Dashboard</h1>

                <Input
                    type="text"
                    placeholder="Search..."
                    className={styles.searchInput}
                />
            </div>
            <div className={styles.statsGrid}>
                <Card>
                    <CardHeader><CardTitle>Total Restaurants</CardTitle></CardHeader>
                    <CardContent className={styles.statValue}>{stats.totalRestaurants}</CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Total Orders</CardTitle></CardHeader>
                    <CardContent className={styles.statValue}>{stats.totalOrders}</CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Revenue</CardTitle></CardHeader>
                    <CardContent className={styles.statValue}>${stats.revenue}</CardContent>
                </Card>
            </div>
        </div>
    );
}