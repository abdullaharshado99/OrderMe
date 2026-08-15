'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import styles from './kds.module.css';

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
      const queueUrl =
        selectedStation === 'all'
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
    if (seconds > 900) return styles.timerUrgent;
    if (seconds > 600) return styles.timerWarn;
    return styles.timerOk;
  };

  const getPriorityBadge = (priority: string) => {
    if (priority === 'rush') return <Badge className={styles.rushBadge}>RUSH</Badge>;
    if (priority === 'vip') return <Badge className={styles.vipBadge}>VIP</Badge>;
    return <Badge variant="outline">Normal</Badge>;
  };

  stations.forEach((s) => (s.count = 0));
  orders.forEach((o) => {
    const station = o.station || 'all';
    const st = stations.find((s) => s.id === station);
    if (st) st.count++;
    else stations[0].count++;
  });
  stations[0].count = orders.length;

  if (loading) return <div className={styles.loading}>Loading KDS...</div>;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Kitchen Display System</h1>
          <p className={styles.subtitle}>
            Station: Main Kitchen · Active Orders: {stats.activeOrders}
          </p>
        </div>
        <div className={styles.statsBox}>
          <p className={styles.statsLabel}>Avg Ticket Time</p>
          <p className={styles.statsValue}>
            {Math.floor(stats.averageTicketTimeSeconds / 60)}:
            {Math.floor(stats.averageTicketTimeSeconds % 60)
              .toString()
              .padStart(2, '0')}{' '}
            min
          </p>
        </div>
      </div>

      <div className={styles.stationTabs}>
        {stations.map((station) => (
          <Button
            key={station.id}
            type="button"
            variant="outline"
            onClick={() => setSelectedStation(station.id)}
            className={
              selectedStation === station.id
                ? styles.stationButtonActive
                : styles.stationButton
            }
          >
            {station.label}{' '}
            {station.count > 0 && (
              <span className={styles.stationCount}>{station.count}</span>
            )}
          </Button>
        ))}
        <div className={styles.stationMeta}>✓ Completed Today: {stats.activeOrders}</div>
      </div>

      <div className={styles.ticketGrid}>
        {orders.map((order) => {
          const timerSeconds = getCookingTime(order);
          const timerClass = getTimerClass(timerSeconds);
          const isUrgent = timerSeconds > 900;
          const isWarn = timerSeconds > 600 && timerSeconds <= 900;
          const borderClass = isUrgent
            ? styles.ticketUrgent
            : isWarn
              ? styles.ticketWarn
              : styles.ticketOk;

          return (
            <Card key={order.id} className={`${styles.ticketCard} ${borderClass}`}>
              <div className={styles.ticketHeader}>
                <div className={styles.ticketHeaderRow}>
                  <div>
                    <div className={styles.orderId}>#{order.id}</div>
                    <div className={styles.orderMeta}>
                      {order.orderType.toUpperCase()} ·{' '}
                      {order.orderType === 'dine-in'
                        ? `Table ${order.tableId}`
                        : order.tableId}
                    </div>
                  </div>
                  <div>
                    <div className={`${styles.timer} ${timerClass}`}>
                      {formatTime(timerSeconds)}
                    </div>
                    <div className={styles.timerStatus}>
                      {timerSeconds > 900
                        ? 'OVERDUE'
                        : timerSeconds > 600
                          ? 'DELAYED'
                          : 'ON TIME'}
                    </div>
                  </div>
                  <div>{getPriorityBadge(order.priority)}</div>
                </div>
              </div>
              <CardContent className={styles.ticketContent}>
                {order.items?.map((item, idx) => (
                  <div key={idx} className={styles.orderItem}>
                    <span className={styles.itemQty}>{item.quantity}</span>
                    <div>
                      <div className={styles.itemName}>{item.name}</div>
                      {item.modifiers && item.modifiers.length > 0 && (
                        <div className={styles.itemModifiers}>
                          {item.modifiers.join(' · ')}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div className={styles.ticketActions}>
                  <Select
                    value={order.station || ''}
                    onValueChange={(value) => assignStation(order.id, value)}
                  >
                    <SelectTrigger className={styles.selectTrigger}>
                      <SelectValue placeholder="Assign Station" />
                    </SelectTrigger>
                    <SelectContent>
                      {stations
                        .filter((s) => s.id !== 'all')
                        .map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.label}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <Button
                    size="sm"
                    className={styles.bumpButton}
                    onClick={() => bumpOrder(order.id)}
                  >
                    ✓ BUMP
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => recallOrder(order.id)}>
                    ↩ RECALL
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className={styles.metricsBar}>
        <div>
          <span className={styles.metricValue}>
            {Math.floor(stats.averageTicketTimeSeconds / 60)}:
            {Math.floor(stats.averageTicketTimeSeconds % 60)
              .toString()
              .padStart(2, '0')}
          </span>{' '}
          Avg Ticket Time
        </div>
        <div>
          <span className={`${styles.metricValue} ${styles.metricWarn}`}>12:18</span> Slowest Today
        </div>
        <div>
          <span className={`${styles.metricValue} ${styles.metricOk}`}>84</span> Completed Today
        </div>
        <div>
          <span className={`${styles.metricValue} ${styles.metricBad}`}>3</span> Delayed
        </div>
        <div>
          <span className={styles.metricValue}>{stats.activeOrders}</span> Active Queue
        </div>
        <div className={styles.metricsRight}>
          STATIONS:{' '}
          {stations
            .filter((s) => s.id !== 'all')
            .map((s) => `${s.label}:${s.count}`)
            .join(' · ')}
        </div>
      </div>
    </div>
  );
}
