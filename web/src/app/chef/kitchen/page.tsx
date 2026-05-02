'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ChefKitchen() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const { data } = await api.get(`/orders/kitchen/${user?.restaurantId}`);
            setOrders(data);
            setLoading(false);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { if (user?.restaurantId) { fetchOrders(); const interval = setInterval(fetchOrders, 5000); return () => clearInterval(interval); } }, [user]);

    const updateStatus = async (orderId: number, newStatus: string) => {
        await api.patch(`/orders/${orderId}/status`, { status: newStatus });
        fetchOrders();
    };

    if (loading) return <div>Loading kitchen orders...</div>;

    return (<div className="p-6"><h1 className="text-2xl font-bold mb-6">Kitchen Display</h1><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{orders.map((order: any) => (<Card key={order.id} className="border-l-4 border-l-yellow-500"><CardHeader><CardTitle>Order #{order.id}</CardTitle></CardHeader><CardContent><p>Table: {order.tableId}</p><p>Items: {order.items.map((i: any) => `${i.name} x${i.quantity}`).join(', ')}</p><p>Status: {order.status}</p><div className="mt-4 flex gap-2">{order.status === 'pending' && <button onClick={() => updateStatus(order.id, 'cooking')} className="bg-blue-600 text-white px-3 py-1 rounded">Start Cooking</button>}{order.status === 'cooking' && <button onClick={() => updateStatus(order.id, 'ready')} className="bg-green-600 text-white px-3 py-1 rounded">Mark Ready</button>}</div></CardContent></Card>))}</div></div>);
}