'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type OrderItem = {
    name: string;
    quantity: number;
    modifiers?: string[];
};

type Order = {
    id: number;
    orderType: string;
    tableId: string;
    createdAt: string;
    status: string;
    station: string | null;
    priority: 'rush' | 'vip' | 'normal';
    items: OrderItem[];
};

type KdsStats = {
    activeOrders: number;
    averageTicketTimeSeconds: number;
};

export default function KdsPage() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedStation, setSelectedStation] = useState('all');
    const [stats, setStats] = useState<KdsStats>({ activeOrders: 0, averageTicketTimeSeconds: 0 });
    const [loading, setLoading] = useState(true);

    const stations = [
        { id: 'all', label: 'All', count: 0 },
        { id: 'grill', label: '🔥 Grill', count: 0 },
        { id: 'pasta', label: '🍝 Pasta', count: 0 },
        { id: 'cold', label: '🥗 Cold Prep', count: 0 },
        { id: 'bakery', label: '🍞 Bakery', count: 0 },
        { id: 'dessert', label: '🍰 Dessert', count: 0 },
    ];

    const fetchData = async () => {
        if (!user?.restaurantId) return;
        setLoading(true);
        try {
            const queueUrl = selectedStation === 'all'
                ? `/orders/kitchen/queue/${user.restaurantId}`
                : `/orders/kitchen/queue/${user.restaurantId}?station=${selectedStation}`;
            const [ordersRes, statsRes] = await Promise.all([
                api.get<Order[]>(queueUrl),
                api.get<KdsStats>(`/orders/kds/stats/${user.restaurantId}`),
            ]);
            setOrders(ordersRes.data);
            setStats(statsRes.data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, [user?.restaurantId, selectedStation]);

    const bumpOrder = async (orderId: number) => {
        await api.post(`/orders/${orderId}/bump`);
        fetchData();
    };

    const recallOrder = async (orderId: number) => {
        await api.patch(`/orders/${orderId}/status`, { status: 'cooking' });
        fetchData();
    };

    const assignStation = async (orderId: number, station: string) => {
        await api.patch(`/orders/${orderId}/station`, { station });
        fetchData();
    };

    const getCookingTime = (order: Order) => {
        const start = new Date(order.createdAt).getTime();
        const now = new Date().getTime();
        return Math.floor((now - start) / 1000);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getTimerClass = (seconds: number) => {
        if (seconds > 900) return 'text-red-600 font-bold';
        if (seconds > 600) return 'text-amber-600';
        return 'text-green-600';
    };

    const getPriorityBadge = (priority: string) => {
        if (priority === 'rush') return <Badge className="bg-red-600 text-white">RUSH</Badge>;
        if (priority === 'vip') return <Badge className="bg-purple-600 text-white">VIP</Badge>;
        return <Badge variant="outline">Normal</Badge>;
    };

    // Update station counts
    stations.forEach(s => s.count = 0);
    orders.forEach(o => {
        const station = o.station || 'all';
        const st = stations.find(s => s.id === station);
        if (st) st.count++;
        else stations[0].count++;
    });
    stations[0].count = orders.length;

    if (loading) return <div className="p-6 text-center">Loading KDS...</div>;

    return (
        <div className="p-6 min-h-screen bg-gray-50 text-gray-900">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--raspberry)]">Kitchen Display System</h1>
                    <p className="text-gray-500 mt-1">Station: Main Kitchen · Active Orders: {stats.activeOrders}</p>
                </div>
                <div className="bg-white border rounded-xl px-4 py-2 shadow-sm">
                    <p className="text-sm text-gray-500">Avg Ticket Time</p>
                    <p className="font-bold text-[var(--raspberry)] text-xl">
                        {Math.floor(stats.averageTicketTimeSeconds / 60)}:{Math.floor(stats.averageTicketTimeSeconds % 60).toString().padStart(2, '0')} min
                    </p>
                </div>
            </div>

            {/* Station Tabs */}
            <div className="flex flex-wrap gap-2 mb-6 border-b pb-2">
                {stations.map(station => (
                    <button
                        key={station.id}
                        onClick={() => setSelectedStation(station.id)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition ${selectedStation === station.id
                                ? 'bg-[var(--raspberry)] text-white'
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        {station.label} {station.count > 0 && <span className="ml-1 bg-gray-200 text-gray-800 px-1.5 py-0.5 rounded-full text-xs">{station.count}</span>}
                    </button>
                ))}
                <div className="ml-auto text-sm text-gray-500">✓ Completed Today: {stats.activeOrders}</div>
            </div>

            {/* Ticket Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {orders.map(order => {
                    const timerSeconds = getCookingTime(order);
                    const timerClass = getTimerClass(timerSeconds);
                    const isUrgent = timerSeconds > 900;
                    const isWarn = timerSeconds > 600 && timerSeconds <= 900;
                    return (
                        <Card key={order.id} className={`border-l-4 shadow-sm overflow-hidden ${isUrgent ? 'border-red-500' : isWarn ? 'border-amber-500' : 'border-green-500'}`}>
                            <div className="p-4 border-b bg-gray-50">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="text-xl font-bold text-gray-800">#{order.id}</div>
                                        <div className="text-xs text-gray-500">{order.orderType.toUpperCase()} · {order.orderType === 'dine-in' ? `Table ${order.tableId}` : order.tableId}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`text-2xl font-mono font-bold ${timerClass}`}>{formatTime(timerSeconds)}</div>
                                        <div className="text-xs">{timerSeconds > 900 ? 'OVERDUE' : timerSeconds > 600 ? 'DELAYED' : 'ON TIME'}</div>
                                    </div>
                                    <div>{getPriorityBadge(order.priority)}</div>
                                </div>
                            </div>
                            <CardContent className="p-4 space-y-3">
                                {order.items?.map((item, idx) => (
                                    <div key={idx} className="flex gap-2 text-sm">
                                        <span className="font-bold text-gray-700 w-7">{item.quantity}</span>
                                        <div>
                                            <div className="font-medium">{item.name}</div>
                                            {item.modifiers && item.modifiers.length > 0 && (
                                                <div className="text-xs text-gray-500">{item.modifiers.join(' · ')}</div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <div className="flex flex-wrap gap-2 pt-3">
                                    <select
                                        value={order.station || ''}
                                        onChange={e => assignStation(order.id, e.target.value)}
                                        className="border rounded px-2 py-1 text-sm bg-white"
                                    >
                                        <option value="">Assign Station</option>
                                        {stations.filter(s => s.id !== 'all').map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                                    </select>
                                    <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => bumpOrder(order.id)}>✓ BUMP</Button>
                                    <Button size="sm" variant="outline" onClick={() => recallOrder(order.id)}>↩ RECALL</Button>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Metrics Bar (simple footer, not fixed) */}
            <div className="mt-8 p-4 bg-white border rounded-lg flex flex-wrap gap-6 text-sm text-gray-600">
                <div><span className="font-mono font-bold text-gray-800">{Math.floor(stats.averageTicketTimeSeconds / 60)}:{Math.floor(stats.averageTicketTimeSeconds % 60).toString().padStart(2, '0')}</span> Avg Ticket Time</div>
                <div><span className="font-mono font-bold text-amber-600">12:18</span> Slowest Today</div>
                <div><span className="font-mono font-bold text-green-600">84</span> Completed Today</div>
                <div><span className="font-mono font-bold text-red-600">3</span> Delayed</div>
                <div><span className="font-mono font-bold text-gray-800">{stats.activeOrders}</span> Active Queue</div>
                <div className="flex-1 text-right">STATIONS: {stations.filter(s => s.id !== 'all').map(s => `${s.label}:${s.count}`).join(' · ')}</div>
            </div>
        </div>
    );
}