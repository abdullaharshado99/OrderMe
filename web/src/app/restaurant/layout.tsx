import { RestaurantSidebar } from '@/components/layout/RestaurantSidebar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function RestaurantLayout({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedRoute allowedRoles={['RESTAURANT_OWNER']}>
            <div className="flex min-h-screen bg-gray-50">
                <RestaurantSidebar />
                <main className="flex-1 ml-64 p-6">{children}</main>
            </div>
        </ProtectedRoute>
    );
}