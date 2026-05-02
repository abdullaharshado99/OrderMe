'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { LayoutDashboard, Users, Menu, ShoppingCart, LogOut } from 'lucide-react';

const adminNav = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/restaurants', label: 'Restaurants', icon: Users },
    { href: '/admin/subscriptions', label: 'Subscriptions', icon: ShoppingCart },
];

const restaurantNav = [
    { href: '/restaurant/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/restaurant/menu', label: 'Menu', icon: Menu },
    { href: '/restaurant/orders', label: 'Orders', icon: ShoppingCart },
    { href: '/restaurant/staff', label: 'Staff', icon: Users },
];

export function Sidebar() {
    const { user, logout } = useAuth();
    const pathname = usePathname();

    const navItems = user?.role === 'SUPER_ADMIN' ? adminNav : restaurantNav;

    return (
        <aside className="w-64 bg-white shadow-md h-screen fixed left-0 top-0 flex flex-col">
            <div className="p-4 text-xl font-bold border-b">Order Me</div>
            <nav className="flex-1 p-4">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 p-2 rounded-lg mb-2 ${isActive ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
            <div className="p-4 border-t">
                <button onClick={logout} className="flex items-center gap-3 text-red-600 w-full p-2 rounded-lg hover:bg-gray-100">
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}