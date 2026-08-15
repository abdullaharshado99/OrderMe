'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import styles from './subscription.module.css';

export default function OwnerSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<any>(null);
  const [plans, setPlans] = useState([]);
  const [upgrading, setUpgrading] = useState(false);

  useEffect(() => {
    if (user?.restaurantId) {
      api
        .get(`/subscriptions/current/${user.restaurantId}`)
        .then((res) => setSubscription(res.data))
        .catch(() => { });
      api.get('/subscriptions/plans').then((res) => setPlans(res.data));
    }
  }, [user]);

  const handleUpgrade = async (planName: any) => {
    if (!confirm(`Upgrade to ${planName}?`)) return;
    setUpgrading(true);
    try {
      await api.post(`/subscriptions/upgrade/${user?.restaurantId}`, { plan: planName });
      alert('Subscription upgraded!');
      const { data } = await api.get(`/subscriptions/current/${user?.restaurantId}`);
      setSubscription(data);
    } catch {
      alert('Upgrade failed');
    }
    setUpgrading(false);
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>My Subscription</h1>
      {subscription && (
        <Card className={styles.currentCard}>
          <CardHeader>
            <CardTitle className={styles.cardTitle}>
              Current Plan: {subscription.plan}
            </CardTitle>
          </CardHeader>
          <CardContent className={styles.currentContent}>
            <p>Valid until: {new Date(subscription.endDate).toLocaleDateString()}</p>
            <p className={styles.price}>Price: ${subscription.price}</p>
          </CardContent>
        </Card>
      )}
      <h2 className={styles.sectionTitle}>Available Plans</h2>
      <div className={styles.grid}>
        {plans.map((plan: any) => (
          <Card key={plan.id} className={styles.planCard}>
            <CardHeader>
              <CardTitle className={styles.cardTitle}>{plan.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={styles.planPrice}>${plan.price}/month</p>
              <p className={styles.planFeatures}>{plan.features}</p>
              <Button
                onClick={() => handleUpgrade(plan.name)}
                disabled={upgrading || subscription?.plan === plan.name}
                className={
                  subscription?.plan === plan.name
                    ? styles.upgradeButtonActive
                    : styles.upgradeButton
                }
              >
                {subscription?.plan === plan.name ? 'Active' : 'Upgrade'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
