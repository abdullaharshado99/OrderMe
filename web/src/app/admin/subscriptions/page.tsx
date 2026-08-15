'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import styles from './subscriptions.module.css';

export default function AdminSubscriptions() {
  const [subs, setSubs] = useState([]);
  const [subPlans, setSubPlans] = useState([]);

  useEffect(() => {
    api.get('/subscriptions/all').then((res) => setSubs(res.data));
    api.get('/subscriptions/plans').then((res) => setSubPlans(res.data))
  }, []);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>All Restaurant Subscriptions</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {subPlans.map((subPlan: any) => (
          <Card className="bg-white border border-gray-200 hover:border-[var(--brilliant-rose)] transition-all">
            <CardHeader>
              <CardTitle className="text-[var(--raspberry)] text-center">
                {subPlan.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-3">
              <div className="text-3xl font-bold">${subPlan.price}</div>
              <p className="text-gray-600">{subPlan.durationDays} duration</p>
              <p className="text-gray-600">{subPlan.features}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className={styles.list}>
        {subs.map((sub: any) => (
          <Card key={sub.id} className={styles.card}>
            <CardHeader>
              <CardTitle className={styles.cardTitle}>
                {sub.restaurant?.name || 'Restaurant'}
              </CardTitle>
            </CardHeader>
            <CardContent className={styles.content}>
              <p>
                <span className={styles.label}>Plan:</span> {sub.plan}
              </p>
              <p>
                <span className={styles.label}>Price:</span> ${sub.price}
              </p>
              <p>
                <span className={styles.label}>Start:</span>{' '}
                {new Date(sub.startDate).toLocaleDateString()}
              </p>
              <p>
                <span className={styles.label}>End:</span>{' '}
                {new Date(sub.endDate).toLocaleDateString()}
              </p>
              <p>
                <span className={styles.label}>Status:</span>{' '}
                <span className={sub.isActive ? styles.statusActive : styles.statusExpired}>
                  {sub.isActive ? 'Active' : 'Expired'}
                </span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
