import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { AppShell } from '@/components/layout/AppShell';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
      <AppShell theme="admin" title="Order Me Admin" sidebar={<AdminSidebar />}>
        {children}
      </AppShell>
    </ProtectedRoute>
  );
}
