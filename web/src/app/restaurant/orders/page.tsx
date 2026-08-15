'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import styles from './orders.module.css';

const statusClassMap: Record<string, string> = {
  pending: styles.statusPending,
  confirmed: styles.statusConfirmed,
  cooking: styles.statusCooking,
  ready: styles.statusReady,
  delivered: styles.statusDelivered,
  cancelled: styles.statusCancelled,
};

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

  const filteredOrders =
    filter === 'all' ? orders : orders.filter((o: any) => o.status === filter);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Orders</h1>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className={styles.filterTrigger}>
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="cooking">Cooking</SelectItem>
            <SelectItem value="ready">Ready</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className={styles.list}>
        {filteredOrders.map((order: any) => (
          <Card key={order.id} className={styles.orderCard}>
            <CardHeader className={styles.cardHeader}>
              <CardTitle className={styles.orderTitle}>
                Order #{order.id} – Table {order.tableId}
              </CardTitle>
              <span
                className={`${styles.statusBadge} ${statusClassMap[order.status] || ''}`}
              >
                {order.status}
              </span>
            </CardHeader>
            <CardContent>
              <div className={styles.contentGrid}>
                <div>
                  <p className={styles.customerInfo}>
                    {order.customerName || 'Guest'} · {order.customerPhone}
                  </p>
                  <ul className={styles.itemList}>
                    {order.items.map((item: any, idx: any) => (
                      <li key={idx}>
                        {item.name} x{item.quantity} – PKR {item.price * item.quantity}
                      </li>
                    ))}
                  </ul>
                  <p className={styles.total}>Total: PKR {order.totalAmount}</p>
                </div>
                <div className={styles.actions}>
                  {order.status === 'pending' && (
                    <Button
                      onClick={() => updateStatus(order.id, 'confirmed')}
                      className={styles.primaryButton}
                    >
                      Confirm Order
                    </Button>
                  )}
                  {order.status === 'confirmed' && (
                    <Button
                      onClick={() => updateStatus(order.id, 'cooking')}
                      className={styles.primaryButton}
                    >
                      Start Cooking
                    </Button>
                  )}
                  {order.status === 'cooking' && (
                    <Button
                      onClick={() => updateStatus(order.id, 'ready')}
                      className={styles.primaryButton}
                    >
                      Mark Ready
                    </Button>
                  )}
                  {order.status === 'ready' && (
                    <Button
                      onClick={() => updateStatus(order.id, 'delivered')}
                      className={styles.primaryButton}
                    >
                      Delivered
                    </Button>
                  )}
                  <Button variant="destructive" onClick={() => updateStatus(order.id, 'cancelled')}>
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
