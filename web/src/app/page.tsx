'use client';
import { useAuth } from '@/components/auth/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) router.push('/login');
      else if (user.role === 'SUPER_ADMIN') router.push('/admin/dashboard');
      else if (user.role === 'RESTAURANT_OWNER') router.push('/restaurant/dashboard');
      else if (user.role === 'CHEF') router.push('/chef/kitchen');
      else router.push('/login');
    }
  }, [isLoading, user, router]);

  return <div className="flex justify-center items-center h-screen">Redirecting...</div>;
}