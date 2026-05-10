'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ChefKitchenPage() {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const { data } = await api.get(`/orders/kitchen/queue/${user?.restaurantId}`);
            setOrders(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (user?.restaurantId) {
            fetchOrders();
            const interval = setInterval(fetchOrders, 10000); // auto-refresh every 10s
            return () => clearInterval(interval);
        }
    }, [user]);

    const updateStatus = async (orderId: any, newStatus: any) => {
        await api.patch(`/orders/${orderId}/status`, { status: newStatus });
        fetchOrders();
    };

    if (loading) return <div className="p-6">Loading kitchen orders...</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Kitchen Display</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {orders.map((order: any) => (
                    <Card key={order.id} className="border-l-4 border-l-yellow-500">
                        <CardHeader>
                            <CardTitle className="flex justify-between">
                                <span>Order #{order.id}</span>
                                <span className="text-sm font-normal">Table {order.tableId}</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-500 mb-2">Ordered: {new Date(order.createdAt).toLocaleTimeString()}</p>
                            <ul className="list-disc list-inside mb-4">
                                {order.items.map((item: any, idx: any) => (
                                    <li key={idx}>{item.quantity} x {item.name}</li>
                                ))}
                            </ul>
                            <div className="flex gap-2">
                                {order.status === 'pending' && (
                                    <Button onClick={() => updateStatus(order.id, 'cooking')}>Start Cooking</Button>
                                )}
                                {order.status === 'cooking' && (
                                    <Button onClick={() => updateStatus(order.id, 'ready')}>Mark Ready</Button>
                                )}
                                <span className="ml-auto text-sm">Status: {order.status}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}