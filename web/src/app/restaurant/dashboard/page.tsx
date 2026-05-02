'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Utensils, DollarSign, Clock } from 'lucide-react';

export default function RestaurantDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({ todayOrders: 0, pendingOrders: 0, totalRevenue: 0, totalMenuItems: 0 });
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.restaurantId) {
            Promise.all([
                api.get(`/orders/restaurant/${user.restaurantId}?limit=5`),
                // api.get(`/orders/restaurant/${user.restaurantId}?limit=5`, {
                //     headers: { 'Cache-Control': 'no-cache' }
                // }),
                api.get(`/analytics/dashboard/${user.restaurantId}`),
                api.get(`/menus/restaurant/${user.restaurantId}`)
            ]).then(([ordersRes, statsRes, menuRes]) => {
                setRecentOrders(ordersRes.data);
                setStats({ ...statsRes.data, totalMenuItems: menuRes.data.length });
                setLoading(false);
            }).catch(err => console.error(err));
        }
    }, [user]);

    if (loading) return <div className="p-6">Loading dashboard...</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Restaurant Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card><CardHeader className="flex flex-row items-center justify-between"><CardTitle>Today Orders</CardTitle><ShoppingCart size={20} /></CardHeader><CardContent className="text-3xl font-bold">{stats.todayOrders}</CardContent></Card>
                <Card><CardHeader className="flex flex-row items-center justify-between"><CardTitle>Pending</CardTitle><Clock size={20} /></CardHeader><CardContent className="text-3xl font-bold">{stats.pendingOrders}</CardContent></Card>
                <Card><CardHeader className="flex flex-row items-center justify-between"><CardTitle>Revenue (Today)</CardTitle><DollarSign size={20} /></CardHeader><CardContent className="text-3xl font-bold">${stats.totalRevenue}</CardContent></Card>
                <Card><CardHeader className="flex flex-row items-center justify-between"><CardTitle>Menu Items</CardTitle><Utensils size={20} /></CardHeader><CardContent className="text-3xl font-bold">{stats.totalMenuItems}</CardContent></Card>
            </div>
            <Card><CardHeader><CardTitle>Recent Orders</CardTitle></CardHeader><CardContent><ul className="space-y-2">{recentOrders.map((order: any) => (<li key={order.id} className="border-b pb-2">Order #{order.id} - {order.status} - ${order.totalAmount}</li>))}</ul></CardContent></Card>
        </div>
    );
}