'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function OrdersPage() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const { data } = await api.get(`/orders/restaurant/${user?.restaurantId}`);
            setOrders(data);
            setLoading(false);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { if (user?.restaurantId) fetchOrders(); }, [user]);

    const updateStatus = async (orderId: number, newStatus: string) => {
        await api.patch(`/orders/${orderId}/status`, { status: newStatus });
        fetchOrders();
    };

    if (loading) return <div>Loading orders...</div>;

    const statusColors = { pending: 'bg-yellow-100 text-yellow-800', confirmed: 'bg-blue-100 text-blue-800', cooking: 'bg-purple-100 text-purple-800', ready: 'bg-green-100 text-green-800', delivered: 'bg-gray-100 text-gray-800', cancelled: 'bg-red-100 text-red-800' };
    const nextStatus = { pending: 'confirm', confirmed: 'start cooking', cooking: 'mark ready', ready: 'deliver' };

    return (<div className="p-6"><h1 className="text-2xl font-bold mb-6">Orders</h1><div className="space-y-4">{orders.map((order: any) => (<Card key={order.id}><CardHeader><CardTitle>Order #{order.id} | Table {order.tableId}</CardTitle></CardHeader><CardContent><div className="flex justify-between"><div><p className="text-sm text-gray-500">{order.customerName || 'Guest'}</p><ul className="list-disc list-inside">{order.items.map((item: any, i: number) => <li key={i}>{item.name} x{item.quantity} - ${item.price * item.quantity}</li>)}</ul><p className="font-bold mt-2">Total: ${order.totalAmount}</p></div><div className="text-right"><span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${statusColors[order.status as keyof typeof statusColors]}`}>{order.status}</span><div className="mt-2">{nextStatus[order.status as keyof typeof nextStatus] && <button onClick={() => updateStatus(order.id, { pending: 'confirmed', confirmed: 'cooking', cooking: 'ready', ready: 'delivered' }[order.status as keyof typeof nextStatus])} className="bg-blue-600 text-white px-3 py-1 rounded text-sm">{nextStatus[order.status as keyof typeof nextStatus]}</button>}</div></div></div></CardContent></Card>))}</div></div>);
}