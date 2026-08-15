'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import styles from './kitchen.module.css';

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

  if (loading) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Kitchen Display</h1>
      <div className={styles.grid}>
        {orders.map((order: any) => (
          <Card key={order.id} className={styles.orderCard}>
            <CardHeader>
              <CardTitle>
                Order #{order.id} – Table {order.tableId}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className={styles.itemList}>
                {order.items.map((item: any, i: any) => (
                  <li key={i}>
                    {item.name} x{item.quantity}
                  </li>
                ))}
              </ul>
              <div className={styles.footer}>
                {order.status === 'cooking' && (
                  <Button onClick={() => updateStatus(order.id, 'ready')}>
                    Mark Ready
                  </Button>
                )}
                <span className={styles.status}>Status: {order.status}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
