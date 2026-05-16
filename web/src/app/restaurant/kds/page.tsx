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

    const [stats, setStats] = useState({
        activeOrders: 0,
        averageTicketTimeSeconds: 0
    });

    const stations = ['all', 'grill', 'pasta', 'cold', 'bakery'];

    const fetchOrders = async () => {
        const url =
            selectedStation === 'all'
                ? `/orders/kitchen/queue/${user?.restaurantId}`
                : `/orders/kitchen/queue/${user?.restaurantId}?station=${selectedStation}`;

        const { data } = await api.get(url);

        setOrders(data);

        const { data: statsData } = await api.get(
            `/orders/kds/stats/${user?.restaurantId}`
        );

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
        if (priority === 'rush') {
            return 'border-[var(--raspberry)] bg-pink-50';
        }

        if (priority === 'vip') {
            return 'border-[var(--brilliant-rose)] bg-rose-50';
        }

        return 'border-gray-300 bg-white';
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">

                <div>
                    <h1 className="text-3xl font-bold text-[var(--raspberry)]">
                        Kitchen Display System
                    </h1>

                    <p className="text-gray-500 text-sm mt-1">
                        Active Orders: {stats.activeOrders}
                    </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Avg Ticket Time
                    </p>

                    <p className="font-bold text-[var(--raspberry)]">
                        {Math.floor(stats.averageTicketTimeSeconds / 60)}:
                        {stats.averageTicketTimeSeconds % 60} min
                    </p>
                </div>
            </div>

            {/* Station Filters */}
            <div className="flex flex-wrap gap-2 mb-6">

                {stations.map((s) => (
                    <Button
                        key={s}
                        onClick={() => setSelectedStation(s)}
                        className={`transition
                        ${selectedStation === s
                                ? 'bg-[var(--raspberry)] hover:bg-[var(--brilliant-rose)] text-white'
                                : 'bg-white border border-gray-300 text-[var(--black)] hover:bg-[var(--brilliant-rose)] hover:text-white'
                            }`}
                    >
                        {s === 'all'
                            ? 'All Stations'
                            : s.charAt(0).toUpperCase() + s.slice(1)}
                    </Button>
                ))}
            </div>

            {/* Orders */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                {orders.map((order: any) => (

                    <Card
                        key={order.id}
                        className={`border-l-4 shadow-sm hover:shadow-lg transition ${getPriorityColor(order.priority)}`}
                    >

                        <CardHeader className="border-b border-gray-200">

                            <CardTitle className="flex justify-between items-center">

                                <span className="text-[var(--raspberry)]">
                                    Order #{order.id}
                                </span>

                                <span className="text-sm font-normal text-gray-500">
                                    Table {order.tableId}
                                </span>

                            </CardTitle>
                        </CardHeader>

                        <CardContent className="pt-4">

                            {/* Order Info */}
                            <div className="text-sm text-gray-500 mb-3">
                                {order.orderType} ·{' '}
                                {new Date(order.createdAt).toLocaleTimeString()}
                            </div>

                            {/* Items */}
                            <ul className="list-disc list-inside mb-4 text-[var(--black)] space-y-1">

                                {order.items.map((item: any, idx: any) => (
                                    <li key={idx}>
                                        {item.quantity} × {item.name}
                                    </li>
                                ))}

                            </ul>

                            {/* Controls */}
                            <div className="flex flex-wrap gap-2 mt-3">

                                <select
                                    value={order.station || ''}
                                    onChange={(e) =>
                                        assignStation(order.id, e.target.value)
                                    }
                                    className="border border-gray-300 rounded-lg p-2 text-sm bg-white text-[var(--black)] focus:outline-none focus:border-[var(--raspberry)]"
                                >
                                    <option value="">
                                        Assign Station
                                    </option>

                                    {stations
                                        .filter((s) => s !== 'all')
                                        .map((s) => (
                                            <option key={s} value={s}>
                                                {s}
                                            </option>
                                        ))}
                                </select>

                                <Button
                                    size="sm"
                                    onClick={() => bumpOrder(order.id)}
                                    className="bg-[var(--raspberry)] hover:bg-[var(--brilliant-rose)] text-white"
                                >
                                    ✓ Bump (Ready)
                                </Button>

                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}