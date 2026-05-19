'use client';
import { RoleName } from '@/lib/auth';
import { useAuth } from './AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: RoleName[];
    redirectTo?: string;
}

export function ProtectedRoute({ children, allowedRoles, redirectTo = '/login' }: ProtectedRouteProps) {
    const { user, isLoading } = useAuth();
    const router = useRouter();


    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                router.push(redirectTo);
            } else if (allowedRoles && !allowedRoles.includes(user.role)) {
                if (user.role === 'SUPER_ADMIN') router.push('/admin/dashboard');
                else if (user.role === 'RESTAURANT_OWNER') router.push('/restaurant/dashboard');
                else if (user.role === 'CHEF') router.push('/chef/kitchen');
                else router.push('/login');
            }
        }
    }, [isLoading, user, router, allowedRoles, redirectTo]);

    if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    if (!user) return null;
    if (allowedRoles && !allowedRoles.includes(user.role)) return null;
    return <>{children}</>;
}