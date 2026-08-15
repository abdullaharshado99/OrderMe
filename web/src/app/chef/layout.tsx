import { ChefSidebar } from '@/components/layout/ChefSidebar';
import { AppShell } from '@/components/layout/AppShell';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function ChefLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['CHEF']}>
      <AppShell theme="chef" title="Chef Panel" sidebar={<ChefSidebar />}>
        {children}
      </AppShell>
    </ProtectedRoute>
  );
}
