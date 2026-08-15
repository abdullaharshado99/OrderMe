'use client';

import { useState } from 'react';
import api from '@/lib/axios';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import styles from './staff.module.css';

export default function StaffPage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '', name: '', phone: '' });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', {
        ...formData,
        role: 'CHEF',
        restaurantId: user?.restaurantId,
      });
      setMessage('Chef created successfully!');
      setFormData({ email: '', password: '', name: '', phone: '' });
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Failed to create chef');
    }
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Add New Chef</h1>
      <Card className={styles.card}>
        <CardHeader>
          <CardTitle className={styles.cardTitle}>Chef Details</CardTitle>
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
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <Input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Button type="submit" className={styles.submitButton}>
              Add Chef
            </Button>
          </form>
          {message && (
            <p
              className={
                message.includes('success') ? styles.messageSuccess : styles.messageError
              }
            >
              {message}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
