'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import styles from './dashboard.module.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
            <h1 className={styles.title}>Admin Dashboard</h1>
            <div className={styles.statsGrid}>
                <Card>
                    <CardHeader><CardTitle>Total Restaurants</CardTitle></CardHeader>
                    <CardContent className="text-3xl font-bold">{stats.totalRestaurants}</CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Total Orders</CardTitle></CardHeader>
                    <CardContent className="text-3xl font-bold">{stats.totalOrders}</CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Revenue</CardTitle></CardHeader>
                    <CardContent className="text-3xl font-bold">${stats.revenue}</CardContent>
                </Card>
            </div>
        </div>
    );
}