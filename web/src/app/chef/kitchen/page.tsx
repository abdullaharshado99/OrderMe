'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ChefKitchen() {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const { data } = await api.get(`/orders/kitchen/queue/${user?.restaurantId}`);
            setOrders(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.restaurantId) {
            fetchOrders();
            const interval = setInterval(fetchOrders, 5000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const updateStatus = async (orderId: any, newStatus: any) => {
        await api.patch(`/orders/${orderId}/status`, { status: newStatus });
        fetchOrders();
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Kitchen Display</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {orders.map((order: any) => (
                    <Card key={order.id} className="border-l-4 border-l-yellow-500">
                        <CardHeader><CardTitle>Order #{order.id} – Table {order.tableId}</CardTitle></CardHeader>
                        <CardContent>
                            <ul className="list-disc list-inside">
                                {order.items.map((item: any, i: any) => <li key={i}>{item.name} x{item.quantity}</li>)}
                            </ul>
                            <div className="mt-4 flex gap-2">
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