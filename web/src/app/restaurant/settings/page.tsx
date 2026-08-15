'use client';

import { useState, type FormEvent } from 'react';
import api from '@/lib/axios';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import styles from './settings.module.css';

export default function SettingsPage() {
  const { user } = useAuth();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!logoFile) return;

    const restaurantId = user?.restaurantId;
    if (restaurantId == null) {
      alert('You must be signed in with a restaurant to upload a logo.');
      return;
    }

    const formData = new FormData();
    formData.append('logo', logoFile);

    setUploading(true);
    try {
      await api.post(`/restaurants/upload-logo/${restaurantId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Logo uploaded! Refresh page to see.');
      window.location.reload();
    } catch {
      alert('Upload failed');
    }
    setUploading(false);
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Restaurant Settings</h1>
      <Card className={styles.card}>
        <CardHeader>
          <CardTitle className={styles.cardTitle}>Update Logo</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpload} className={styles.form}>
            <Input
              type="file"
              accept="image/*"
              className={styles.fileInput}
              onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)}
            />
            <Button type="submit" disabled={uploading} className={styles.submitButton}>
              {uploading ? 'Uploading...' : 'Upload Logo'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
