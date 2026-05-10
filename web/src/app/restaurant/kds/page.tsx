'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function KdsPage() {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [selectedStation, setSelectedStation] = useState('all');
    const [stats, setStats] = useState({ activeOrders: 0, averageTicketTimeSeconds: 0 });
    const stations = ['all', 'grill', 'pasta', 'cold', 'bakery'];

    const fetchOrders = async () => {
        const url = selectedStation === 'all'
            ? `/orders/kitchen/queue/${user?.restaurantId}`
            : `/orders/kitchen/queue/${user?.restaurantId}?station=${selectedStation}`;
        const { data } = await api.get(url);
        setOrders(data);
        const { data: statsData } = await api.get(`/orders/kds/stats/${user?.restaurantId}`);
        setStats(statsData);
    };

    useEffect(() => {
        if (user?.restaurantId) {
            fetchOrders();
            const interval = setInterval(fetchOrders, 5000);
            return () => clearInterval(interval);
        }
    }, [user, selectedStation]);

    const bumpOrder = async (orderId: any) => {
        await api.post(`/orders/${orderId}/bump`);
        fetchOrders();
    };

    const assignStation = async (orderId: any, station: any) => {
        await api.patch(`/orders/${orderId}/station`, { station });
        fetchOrders();
    };

    const getPriorityColor = (priority: any) => {
        if (priority === 'rush') return 'border-red-500 bg-red-50';
        if (priority === 'vip') return 'border-purple-500 bg-purple-50';
        return 'border-gray-300';
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Kitchen Display System</h1>
                <div className="text-sm">Avg Ticket Time: {Math.floor(stats.averageTicketTimeSeconds / 60)}:{stats.averageTicketTimeSeconds % 60} min</div>
            </div>
            <div className="flex gap-2 mb-6">
                {stations.map(s => (
                    <Button key={s} variant={selectedStation === s ? 'default' : 'outline'} onClick={() => setSelectedStation(s)}>
                        {s === 'all' ? 'All Stations' : s.charAt(0).toUpperCase() + s.slice(1)}
                    </Button>
                ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {orders.map((order: any) => (
                    <Card key={order.id} className={`border-l-4 ${getPriorityColor(order.priority)}`}>
                        <CardHeader>
                            <CardTitle className="flex justify-between">
                                <span>Order #{order.id}</span>
                                <span className="text-sm font-normal">Table {order.tableId}</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm text-gray-500 mb-2">{order.orderType} · {new Date(order.createdAt).toLocaleTimeString()}</div>
                            <ul className="list-disc list-inside mb-4">
                                {order.items.map((item: any, idx: any) => <li key={idx}>{item.quantity} x {item.name}</li>)}
                            </ul>
                            <div className="flex flex-wrap gap-2 mt-2">
                                <select value={order.station || ''} onChange={(e) => assignStation(order.id, e.target.value)} className="border rounded p-1 text-sm">
                                    <option value="">Assign Station</option>
                                    {stations.filter(s => s !== 'all').map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                                <Button size="sm" onClick={() => bumpOrder(order.id)}>✓ Bump (Ready)</Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}