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

    if (loading) return <div className="p-6">Loading orders...</div>;

    // 🎨 Soft status pills (light + readable)
    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800',
        confirmed: 'bg-blue-100 text-blue-800',
        cooking: 'bg-purple-100 text-purple-800',
        ready: 'bg-green-100 text-green-800',
        delivered: 'bg-gray-200 text-gray-800',
        cancelled: 'bg-red-100 text-red-700'
    };

    const nextStatus = {
        pending: 'Confirm',
        confirmed: 'Start Cooking',
        cooking: 'Mark Ready',
        ready: 'Deliver'
    };

    const nextStatusMap = {
        pending: 'confirmed',
        confirmed: 'cooking',
        cooking: 'ready',
        ready: 'delivered'
    };

    return (
        <div className="p-6 min-h-screen bg-gray-50 text-gray-900" style={{ fontFamily: 'var(--font-quicksand)' }}>

            {/* Header */}
            <h1 className="text-2xl font-bold mb-6 text-[var(--raspberry)]">
                Orders
            </h1>

            <div className="space-y-4">
                {orders.map((order: any) => (
                    <Card
                        key={order.id}
                        className="bg-white border border-gray-200 hover:border-[var(--brilliant-rose)] transition"
                    >
                        <CardHeader>
                            <CardTitle className="text-[var(--brilliant-rose)]">
                                Order #{order.id} | Table {order.tableId}
                            </CardTitle>
                        </CardHeader>

                        <CardContent>
                            <div className="flex justify-between gap-4">

                                {/* LEFT SIDE */}
                                <div className="text-gray-700">
                                    <p className="text-sm text-gray-500">
                                        {order.customerName || 'Guest'}
                                    </p>

                                    <ul className="list-disc list-inside mt-2 space-y-1">
                                        {order.items.map((item: any, i: number) => (
                                            <li key={i}>
                                                {item.name} x{item.quantity} — ${item.price * item.quantity}
                                            </li>
                                        ))}
                                    </ul>

                                    <p className="font-bold mt-3 text-[var(--raspberry)]">
                                        Total: ${order.totalAmount}
                                    </p>
                                </div>

                                {/* RIGHT SIDE */}
                                <div className="text-right flex flex-col items-end gap-2">

                                    {/* Status */}
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status as keyof typeof statusColors]}`}>
                                        {order.status}
                                    </span>

                                    {/* Action Button */}
                                    {nextStatus[order.status as keyof typeof nextStatus] && (
                                        <button
                                            onClick={() =>
                                                updateStatus(
                                                    order.id,
                                                    nextStatusMap[order.status as keyof typeof nextStatusMap]
                                                )
                                            }
                                            className="bg-[var(--raspberry)] hover:bg-[var(--brilliant-rose)] text-white px-3 py-1 rounded text-sm transition"
                                        >
                                            {nextStatus[order.status as keyof typeof nextStatus]}
                                        </button>
                                    )}

                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}