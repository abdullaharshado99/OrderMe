'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Utensils, DollarSign, Clock } from 'lucide-react';
import styles from './restaurant.module.css';

export default function RestaurantDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({ todayOrders: 0, pendingOrders: 0, totalRevenue: 0, totalMenuItems: 0 });
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.restaurantId) {
            Promise.all([
                api.get(`/orders/restaurant/${user.restaurantId}?limit=5`),
                api.get(`/analytics/dashboard/${user.restaurantId}`),
                api.get(`/menus/restaurant/${user.restaurantId}`)
            ]).then(([ordersRes, statsRes, menuRes]) => {
                setRecentOrders(ordersRes.data);
                setStats({ ...statsRes.data, totalMenuItems: menuRes.data.length });
                setLoading(false);
            }).catch(err => console.error(err));
        }
    }, [user]);

    if (loading) return <div className={styles.loading}>Loading dashboard...</div>;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Restaurant Dashboard</h1>

            <div className={styles.statsGrid}>
                <Card className={styles.card}>
                    <CardHeader className={styles.cardHeaderRow}>
                        <CardTitle>Today Orders</CardTitle>
                        <ShoppingCart size={20} />
                    </CardHeader>
                    <CardContent className={styles.value}>{stats.todayOrders}</CardContent>
                </Card>

                <Card className={styles.card}>
                    <CardHeader className={styles.cardHeaderRow}>
                        <CardTitle>Pending</CardTitle>
                        <Clock size={20} />
                    </CardHeader>
                    <CardContent className={styles.value}>{stats.pendingOrders}</CardContent>
                </Card>

                <Card className={styles.card}>
                    <CardHeader className={styles.cardHeaderRow}>
                        <CardTitle>Revenue (Today)</CardTitle>
                        <DollarSign size={20} />
                    </CardHeader>
                    <CardContent className={styles.value}>${stats.totalRevenue}</CardContent>
                </Card>

                <Card className={styles.card}>
                    <CardHeader className={styles.cardHeaderRow}>
                        <CardTitle>Menu Items</CardTitle>
                        <Utensils size={20} />
                    </CardHeader>
                    <CardContent className={styles.value}>{stats.totalMenuItems}</CardContent>
                </Card>
            </div>

            <Card className={styles.card}>
                <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className={styles.orderList}>
                        {recentOrders.map((order: any) => (
                            <li key={order.id} className={styles.orderItem}>
                                Order #{order.id} - {order.status} - ${order.totalAmount}
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}