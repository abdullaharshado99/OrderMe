'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import styles from './users.module.css';

export default function UsersPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [plans, setPlans] = useState([]);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    role: 'RESTAURANT_OWNER',
    restaurantId: '',
    plan: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/restaurants').then((res) => setRestaurants(res.data)).catch(console.error);
    api.get('/subscriptions/plans').then((res) => setPlans(res.data)).catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const payload = { ...formData, restaurantId: parseInt(formData.restaurantId) };
      await api.post('/auth/register', payload);
      setMessage('Restaurant Owner created with subscription!');
      setFormData({
        email: '',
        password: '',
        name: '',
        phone: '',
        role: 'RESTAURANT_OWNER',
        restaurantId: '',
        plan: '',
      });
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Failed to create user');
    }
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Register Restaurant Owner</h1>
      <Card className={styles.card}>
        <CardHeader>
          <CardTitle className={styles.cardTitle}>Owner Details & Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className={styles.form}>
            <Input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            <Input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              type="tel"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <Select
              value={formData.restaurantId}
              onValueChange={(value) => setFormData({ ...formData, restaurantId: value })}
              required
            >
              <SelectTrigger className={styles.selectTrigger}>
                <SelectValue placeholder="Select Restaurant" />
              </SelectTrigger>
              <SelectContent>
                {restaurants.map((r: any) => (
                  <SelectItem key={r.id} value={String(r.id)}>
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={formData.plan}
              onValueChange={(value) => setFormData({ ...formData, plan: value })}
              required
            >
              <SelectTrigger className={styles.selectTrigger}>
                <SelectValue placeholder="Select Plan" />
              </SelectTrigger>
              <SelectContent>
                {plans.map((p: any) => (
                  <SelectItem key={p.id} value={p.name}>
                    {p.name} - ${p.price}/month
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="submit" className={styles.submitButton}>
              Register Owner & Activate Plan
            </Button>
          </form>
          {message && <p className={styles.message}>{message}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
