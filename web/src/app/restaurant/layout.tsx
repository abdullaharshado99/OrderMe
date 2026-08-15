import { RestaurantSidebar } from '@/components/layout/RestaurantSidebar';
import { AppShell } from '@/components/layout/AppShell';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function RestaurantLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['RESTAURANT_OWNER']}>
      <AppShell theme="restaurant" title="Order Me" sidebar={<RestaurantSidebar />}>
        {children}
      </AppShell>
    </ProtectedRoute>
  );
}
