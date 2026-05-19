import { ChefSidebar } from '@/components/layout/ChefSidebar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function ChefLayout({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedRoute allowedRoles={['CHEF']}>
            <div className="flex min-h-screen bg-gray-900 text-white">
                <ChefSidebar />
                <main className="flex-1 ml-64 p-6">{children}</main>
            </div>
        </ProtectedRoute>
    );
}