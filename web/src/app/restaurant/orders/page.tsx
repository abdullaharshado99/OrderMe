'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function OrdersPage() {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [filter, setFilter] = useState('all');

    const fetchOrders = async () => {
        const { data } = await api.get(`/orders/restaurant/${user?.restaurantId}`);
        setOrders(data);
    };

    useEffect(() => {
        if (user?.restaurantId) fetchOrders();
    }, [user]);

    const updateStatus = async (orderId: any, newStatus: any) => {
        await api.patch(`/orders/${orderId}/status`, { status: newStatus });
        fetchOrders();
    };

    const statusColors: any = {
        pending: 'bg-yellow-100 text-yellow-800',
        confirmed: 'bg-blue-100 text-blue-800',
        cooking: 'bg-purple-100 text-purple-800',
        ready: 'bg-green-100 text-green-800',
        delivered: 'bg-gray-100 text-gray-800',
        cancelled: 'bg-red-100 text-red-800',
    };

    const filteredOrders = filter === 'all' ? orders : orders.filter((o: any) => o.status === filter);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Orders</h1>
                <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-36"><SelectValue placeholder="Filter" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="cooking">Cooking</SelectItem>
                        <SelectItem value="ready">Ready</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="grid gap-4">
                {filteredOrders.map((order: any) => (
                    <Card key={order.id}>
                        <CardHeader className="flex flex-row justify-between items-center">
                            <CardTitle>Order #{order.id} – Table {order.tableId}</CardTitle>
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[order.status]}`}>
                                {order.status}
                            </span>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">{order.customerName || 'Guest'} · {order.customerPhone}</p>
                                    <ul className="list-disc list-inside mt-2">
                                        {order.items.map((item: any, idx: any) => (
                                            <li key={idx}>{item.name} x{item.quantity} – PKR {item.price * item.quantity}</li>
                                        ))}
                                    </ul>
                                    <p className="font-bold mt-2">Total: PKR {order.totalAmount}</p>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    {order.status === 'pending' && (
                                        <Button onClick={() => updateStatus(order.id, 'confirmed')}>Confirm Order</Button>
                                    )}
                                    {order.status === 'confirmed' && (
                                        <Button onClick={() => updateStatus(order.id, 'cooking')}>Start Cooking</Button>
                                    )}
                                    {order.status === 'cooking' && (
                                        <Button onClick={() => updateStatus(order.id, 'ready')}>Mark Ready</Button>
                                    )}
                                    {order.status === 'ready' && (
                                        <Button onClick={() => updateStatus(order.id, 'delivered')}>Delivered</Button>
                                    )}
                                    <Button variant="destructive" onClick={() => updateStatus(order.id, 'cancelled')}>Cancel</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}