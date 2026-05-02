'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { LayoutDashboard, Utensils, ShoppingCart, Package, Users, LogOut, Settings, CreditCard } from 'lucide-react';

const navItems = [
    { href: '/restaurant/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/restaurant/menu', label: 'Menu', icon: Utensils },
    { href: '/restaurant/orders', label: 'Orders', icon: ShoppingCart },
    { href: '/restaurant/inventory', label: 'Inventory', icon: Package },
    { href: '/restaurant/staff', label: 'Staff', icon: Users },
    { href: '/restaurant/settings', label: 'Settings', icon: Settings },
    { href: '/restaurant/subscription', label: 'Subscription', icon: CreditCard }
];

export function RestaurantSidebar() {
    const { logout } = useAuth();
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-white shadow-md h-screen fixed left-0 top-0 flex flex-col border-r">
            <div className="p-4 text-xl font-bold text-center border-b">Order Me</div>
            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 ${isActive ? 'bg-blue-100 text-blue-700' : ''}`}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
            <div className="p-4 border-t">
                <button onClick={logout} className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-100 text-red-600">
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}